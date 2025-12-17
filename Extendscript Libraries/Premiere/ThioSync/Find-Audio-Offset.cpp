// Find-Audio-Offset.cpp
// Audio offset detection engine for Premiere Pro plugin integration
// Uses Intel MKL for FFT-based cross-correlation

#include <vector>
#include <complex>
#include <cmath>
#include <algorithm>
#include <cstdint>
#include "Find-Audio-Offset.h"
#include "mkl_dfti.h"
#include "mkl_vml.h"

// ---------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------
using Complex = std::complex<float>;

// ---------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------

std::vector<float> ConvertToMono(
    float** audioBuffers,
    int numChannels,
    int64_t numSamples)
{
    if (!audioBuffers || numChannels <= 0 || numSamples <= 0) {
        return {};
    }

    std::vector<float> mono(numSamples);

    if (numChannels == 1) {
        // Already mono, just copy
        std::copy(audioBuffers[0], audioBuffers[0] + numSamples, mono.begin());
    }
    else {
        // Average all channels
        float scale = 1.0f / numChannels;
        for (int64_t i = 0; i < numSamples; ++i) {
            float sum = 0.0f;
            for (int ch = 0; ch < numChannels; ++ch) {
                sum += audioBuffers[ch][i];
            }
            mono[i] = sum * scale;
        }
    }

    return mono;
}

std::vector<float> SelectChannel(
    float** audioBuffers,
    int numChannels,
    int64_t numSamples,
    int channelIndex)
{
    if (!audioBuffers || numChannels <= 0 || numSamples <= 0) {
        return {};
    }

    // Clamp channel index to valid range
    int ch = channelIndex;
    if (ch < 0) ch = 0;
    if (ch >= numChannels) ch = numChannels - 1;
    
    std::vector<float> result(numSamples);
    std::copy(audioBuffers[ch], audioBuffers[ch] + numSamples, result.begin());
    return result;
}

std::vector<float> ResampleAudio(
    const std::vector<float>& audio,
    int srcRate,
    int targetRate)
{
    if (audio.empty() || srcRate <= 0 || targetRate <= 0) {
        return {};
    }

    if (srcRate == targetRate) {
        return audio; // No resampling needed
    }

    double ratio = static_cast<double>(srcRate) / targetRate;
    size_t newSize = static_cast<size_t>(audio.size() / ratio);
    
    if (newSize == 0) {
        return {};
    }

    std::vector<float> resampled(newSize);

    // Linear interpolation resampling
    for (size_t i = 0; i < newSize; ++i) {
        double srcIndex = i * ratio;
        size_t idx0 = static_cast<size_t>(srcIndex);
        size_t idx1 = (std::min)(idx0 + 1, audio.size() - 1);
        float frac = static_cast<float>(srcIndex - idx0);
        
        resampled[i] = audio[idx0] * (1.0f - frac) + audio[idx1] * frac;
    }

    return resampled;
}

// ---------------------------------------------------------
// AUDIO SYNC ENGINE IMPLEMENTATION
// ---------------------------------------------------------

class AudioSyncEngine::Impl {
public:
    std::vector<MKL_Complex8> mainFreq;
    DFTI_DESCRIPTOR_HANDLE fftHandle = nullptr;
    size_t paddedN = 0;
    size_t mainLen = 0;
    bool initialized = false;

    ~Impl() {
        Reset();
    }

    void Reset() {
        if (fftHandle) {
            DftiFreeDescriptor(&fftHandle);
            fftHandle = nullptr;
        }
        mainFreq.clear();
        paddedN = 0;
        mainLen = 0;
        initialized = false;
    }

    bool Initialize(const std::vector<float>& mainAudio) {
        Reset();

        if (mainAudio.empty()) {
            return false;
        }

        mainLen = mainAudio.size();

        // Pad to next power of 2 (with safety buffer for segment correlation)
        size_t safetyBuffer = 120 * INTERNAL_SAMPLE_RATE; // 120 seconds buffer
        size_t targetSize = mainLen + safetyBuffer;
        paddedN = 1;
        while (paddedN < targetSize) {
            paddedN <<= 1;
        }

        // Create MKL FFT Descriptor (1D, Single Precision, Real input)
        MKL_LONG status = DftiCreateDescriptor(&fftHandle, DFTI_SINGLE, DFTI_REAL, 1, (MKL_LONG)paddedN);

        // Configure for "Not In Place" (Input and Output are different arrays)
        if (status == 0) {
            status = DftiSetValue(fftHandle, DFTI_PLACEMENT, DFTI_NOT_INPLACE);
        }

        // Configure storage to standard complex format
        if (status == 0) {
            status = DftiSetValue(fftHandle, DFTI_CONJUGATE_EVEN_STORAGE, DFTI_COMPLEX_COMPLEX);
        }

        // Commit the plan (Optimizes for the specific processor)
        if (status == 0) {
            status = DftiCommitDescriptor(fftHandle);
        }

        if (status != 0) {
            Reset();
            return false;
        }

        // Prepare main audio with zero padding
        std::vector<float> mainPadded = mainAudio;
        mainPadded.resize(paddedN, 0.0f);

        // Resize freq container to N/2 + 1 complex numbers
        mainFreq.resize(paddedN / 2 + 1);

        // Compute Forward FFT (Real -> Complex)
        DftiComputeForward(fftHandle, mainPadded.data(), mainFreq.data());

        initialized = true;
        return true;
    }

    double FindOffset(const std::vector<float>& segAudio) {
        if (!initialized || segAudio.empty()) {
            return -1.0;
        }

        if (segAudio.size() + mainLen > paddedN) {
            // Segment too long for current FFT size
            return -1.0;
        }

        std::vector<float> segPadded = segAudio;
        segPadded.resize(paddedN, 0.0f);

        std::vector<MKL_Complex8> segFreq(paddedN / 2 + 1);

        // 1. Forward FFT for segment
        DftiComputeForward(fftHandle, segPadded.data(), segFreq.data());

        // 2. Correlation in Frequency Domain
        // vcMulByConj(n, a, b, y) -> y = a * conj(b)
        vcMulByConj(static_cast<MKL_INT>(segFreq.size()), mainFreq.data(), segFreq.data(), segFreq.data());

        // 3. Inverse FFT (Complex -> Real)
        std::vector<float> correlationResult(paddedN);
        DftiComputeBackward(fftHandle, segFreq.data(), correlationResult.data());

        // 4. Peak Finding
        float maxVal = -1.0f;
        size_t maxIdx = 0;

        for (size_t i = 0; i < paddedN; ++i) {
            float mag = std::abs(correlationResult[i]);
            if (mag > maxVal) {
                maxVal = mag;
                maxIdx = i;
            }
        }

        return static_cast<double>(maxIdx) / INTERNAL_SAMPLE_RATE;
    }
};

// ---------------------------------------------------------
// AUDIO SYNC ENGINE PUBLIC INTERFACE
// ---------------------------------------------------------

AudioSyncEngine::AudioSyncEngine() : pImpl(new Impl()) {}

AudioSyncEngine::~AudioSyncEngine() {
    delete pImpl;
}

bool AudioSyncEngine::InitializeWithMainAudio(
    float** audioBuffers,
    int numChannels,
    int64_t numSamples,
    int sampleRate)
{
    if (!audioBuffers || numChannels <= 0 || numSamples <= 0 || sampleRate <= 0) {
        return false;
    }

    // Convert to mono and resample to internal rate
    std::vector<float> mono = ConvertToMono(audioBuffers, numChannels, numSamples);
    std::vector<float> resampled = ResampleAudio(mono, sampleRate, INTERNAL_SAMPLE_RATE);

    return pImpl->Initialize(resampled);
}

double AudioSyncEngine::FindOffset(
    float** audioBuffers,
    int numChannels,
    int64_t numSamples,
    int sampleRate)
{
    if (!audioBuffers || numChannels <= 0 || numSamples <= 0 || sampleRate <= 0) {
        return -1.0;
    }

    // Convert to mono and resample to internal rate
    std::vector<float> mono = ConvertToMono(audioBuffers, numChannels, numSamples);
    std::vector<float> resampled = ResampleAudio(mono, sampleRate, INTERNAL_SAMPLE_RATE);

    return pImpl->FindOffset(resampled);
}

bool AudioSyncEngine::IsInitialized() const {
    return pImpl->initialized;
}

void AudioSyncEngine::Reset() {
    pImpl->Reset();
}