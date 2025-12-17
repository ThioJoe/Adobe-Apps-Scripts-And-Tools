// Find-Audio-Offset.cpp
#include <iostream>
#include <vector>
#include <complex>
#include <cmath>
#include <numbers> 
#include <iomanip>
#include <algorithm>
#include <sstream>
#include <io.h>     
#include <fcntl.h>  
#include <conio.h>  
#include <windows.h>
#include <mfidl.h>
#include <mfapi.h>
#include <mfreadwrite.h>
#include <propvarutil.h>
#include <omp.h>
#include <chrono>
#include <mutex> // NEW: For thread-safe printing
#include "Find-Audio-Offset.h"
//#include "mkl.h"
#include "mkl_dfti.h"
#include "mkl_vml.h"

#pragma comment(lib, "mfplat.lib")
#pragma comment(lib, "mfreadwrite.lib")
#pragma comment(lib, "mfuuid.lib")
#pragma comment(lib, "propsys.lib")

// OPTIMIZATION 1: Use float instead of double
using Complex = std::complex<float>;
using CArray = std::vector<Complex>;
const double PI = 3.14159265358979323846;

// CONSTANTS
const int DOWN_SAMPLE_RATE = 8000;
std::mutex cout_mutex; // Mutex for console output

// ---------------------------------------------------------
// UTILS
// ---------------------------------------------------------
std::wstring Trim(const std::wstring& str) {
    size_t first = str.find_first_not_of(L" \t\"");
    if (std::wstring::npos == first) return str;
    size_t last = str.find_last_not_of(L" \t\"");
    return str.substr(first, (last - first + 1));
}

std::vector<std::wstring> SplitPathString(const std::wstring& input) {
    std::vector<std::wstring> paths;
    std::wstringstream ss(input);
    std::wstring item;
    while (std::getline(ss, item, L',')) {
        std::wstring clean = Trim(item);
        if (!clean.empty()) paths.push_back(clean);
    }
    return paths;
}

// ---------------------------------------------------------
// AUDIO LOADER (Optimized)
// ---------------------------------------------------------
std::vector<float> LoadAudio(const std::wstring& filename) {
    // NOTE: MFStartup moved to main() for thread safety
    IMFSourceReader* pReader = NULL;
    HRESULT hr = MFCreateSourceReaderFromURL(filename.c_str(), NULL, &pReader);

    if (FAILED(hr)) {
        // Thread-safe error printing
        std::lock_guard<std::mutex> lock(cout_mutex);
        std::wcerr << L"Error opening: " << filename << std::endl;
        return {};
    }

    IMFMediaType* pPartialType = NULL;
    MFCreateMediaType(&pPartialType);
    pPartialType->SetGUID(MF_MT_MAJOR_TYPE, MFMediaType_Audio);
    pPartialType->SetGUID(MF_MT_SUBTYPE, MFAudioFormat_Float);
    pPartialType->SetUINT32(MF_MT_AUDIO_SAMPLES_PER_SECOND, DOWN_SAMPLE_RATE);
    pPartialType->SetUINT32(MF_MT_AUDIO_NUM_CHANNELS, 1);
    pReader->SetCurrentMediaType((DWORD)MF_SOURCE_READER_FIRST_AUDIO_STREAM, NULL, pPartialType);
    pPartialType->Release();

    // OPTIMIZATION 4: Pre-allocate memory
    PROPVARIANT var;
    PropVariantInit(&var);
    LONGLONG duration = 0;
    std::vector<float> audioData;

    if (SUCCEEDED(pReader->GetPresentationAttribute(MF_SOURCE_READER_MEDIASOURCE, MF_PD_DURATION, &var))) {
        PropVariantToInt64(var, &duration);
        PropVariantClear(&var);
        // Duration is in 100-nanosecond units. 1 sec = 10,000,000 units
        // Samples = (Duration / 10,000,000) * Rate
        size_t estimatedSamples = (size_t)((duration / 10000000.0) * DOWN_SAMPLE_RATE);
        audioData.reserve(estimatedSamples + 1024); // Reserve + small buffer
    }

    IMFSample* pSample = NULL;
    DWORD flags = 0;

    while (true) {
        LONGLONG timestamp = 0;
        hr = pReader->ReadSample(MF_SOURCE_READER_FIRST_AUDIO_STREAM, 0, NULL, &flags, &timestamp, &pSample);
        if (FAILED(hr) || (flags & MF_SOURCE_READERF_ENDOFSTREAM)) break;

        // Removed Progress Bar from Loader: It slows down parallel loading significantly 
        // and causes race conditions on the console cursor.

        if (pSample) {
            IMFMediaBuffer* pBuffer = NULL;
            pSample->ConvertToContiguousBuffer(&pBuffer);
            float* data = NULL;
            DWORD currLen = 0;
            pBuffer->Lock((BYTE**)&data, NULL, &currLen);
            // Insert is faster now due to reserve
            audioData.insert(audioData.end(), data, data + (currLen / sizeof(float)));
            pBuffer->Unlock();
            pBuffer->Release();
            pSample->Release();
        }
    }

    if (pReader) pReader->Release();
    return audioData;
}

// ---------------------------------------------------------
// SYNC ENGINE CLASS (Intel MKL Version)
// ---------------------------------------------------------
class SyncEngine {
    std::vector<MKL_Complex8> mainFreq; // MKL native complex type (binary compatible with std::complex)
    DFTI_DESCRIPTOR_HANDLE fftHandle = nullptr;
    size_t paddedN = 0;
    size_t mainLen = 0;

public:
    ~SyncEngine() {
        if (fftHandle) DftiFreeDescriptor(&fftHandle);
    }

    bool Initialize(const std::wstring& mainPath) {
        std::wcout << L"Reading Main Reference...\n";
        auto mainAudio = LoadAudio(mainPath);
        if (mainAudio.empty()) return false;

        mainLen = mainAudio.size();

        // Pad to next power of 2
        size_t safetyBuffer = 120 * DOWN_SAMPLE_RATE;
        size_t targetSize = mainLen + safetyBuffer;
        paddedN = 1;
        while (paddedN < targetSize) paddedN <<= 1;

        std::wcout << L"Optimizing MKL Plan (N=" << paddedN << L")...\n";

        // 1. Create FFT Descriptor (1D, Single Precision, Real input)
        MKL_LONG status = DftiCreateDescriptor(&fftHandle, DFTI_SINGLE, DFTI_REAL, 1, (MKL_LONG)paddedN);

        // 2. Configure for "Not In Place" (Input and Output are different arrays)
        if (status == 0) status = DftiSetValue(fftHandle, DFTI_PLACEMENT, DFTI_NOT_INPLACE);

        // 3. Configure storage to be standard complex format (easier to use than packed CCS)
        // This ensures the output is a standard array of (N/2 + 1) complex numbers
        if (status == 0) status = DftiSetValue(fftHandle, DFTI_CONJUGATE_EVEN_STORAGE, DFTI_COMPLEX_COMPLEX);

        // 4. Commit the plan (Optimizes for the specific processor)
        if (status == 0) status = DftiCommitDescriptor(fftHandle);

        if (status != 0) {
            std::wcout << L"Error: Failed to initialize MKL FFT.\n";
            return false;
        }

        // Prepare Main
        std::vector<float> mainPadded = mainAudio;
        mainPadded.resize(paddedN, 0.0f);

        // Resize freq container to N/2 + 1 complex numbers
        mainFreq.resize(paddedN / 2 + 1);

        // Compute Forward FFT (Real -> Complex)
        DftiComputeForward(fftHandle, mainPadded.data(), mainFreq.data());

        std::wcout << L"Cache Built.\n\n";
        return true;
    }

    double FindOffset(const std::wstring& segPath) {
        auto segAudio = LoadAudio(segPath);
        if (segAudio.empty()) return -1.0;

        if (segAudio.size() + mainLen > paddedN) {
            std::lock_guard<std::mutex> lock(cout_mutex);
            std::wcout << L"[" << segPath << L"] Error: Segment too long.\n";
            return -1.0;
        }

        std::vector<float> segPadded = segAudio;
        segPadded.resize(paddedN, 0.0f);

        std::vector<MKL_Complex8> segFreq(paddedN / 2 + 1);

        // 1. Forward FFT for segment
        DftiComputeForward(fftHandle, segPadded.data(), segFreq.data());

        // 2. Correlation in Frequency Domain
        // MKL Vector Math: segFreq[i] = mainFreq[i] * CONJ(segFreq[i])
        // VcMulByConj(n, a, b, y) -> y = a * conj(b)
        vcMulByConj(segFreq.size(), mainFreq.data(), segFreq.data(), segFreq.data());

        // 3. Inverse FFT (Complex -> Real)
        // Note: DftiComputeBackward with DFTI_REAL descriptor expects Complex input and produces Real output
        std::vector<float> correlationResult(paddedN);
        DftiComputeBackward(fftHandle, segFreq.data(), correlationResult.data());

        // 4. Peak Finding (MKL can also do this, but standard loop is fine for just peak finding)
        // However, we can use cblas_isamax to find the index of the max absolute value if we wanted,
        // but since we need the magnitude of real numbers, a simple loop is often safer/clearer.
        float maxVal = -1.0f;
        size_t maxIdx = 0;

        // We can optimize the loop slightly by avoiding std::abs if we know it's real, 
        // but correlation results can be negative.
        for (size_t i = 0; i < paddedN; i++) {
            float mag = std::abs(correlationResult[i]);
            if (mag > maxVal) {
                maxVal = mag;
                maxIdx = i;
            }
        }

        return (double)maxIdx / DOWN_SAMPLE_RATE;
    }
};

// ---------------------------------------------------------
// MAIN
// ---------------------------------------------------------
int main()
{
    _setmode(_fileno(stdout), _O_U16TEXT);
    _setmode(_fileno(stdin), _O_U16TEXT);

    // Initialize MF once here
    MFStartup(MF_VERSION);

    std::wstring mainAudioPath, segInputString;

    std::wcout << L"--------------------------------\n";
    std::wcout << L"Audio Sync Tool (Optimized)\n";
    std::wcout << L"--------------------------------\n";

    std::wcout << L"Main File: ";
    std::getline(std::wcin, mainAudioPath);
    mainAudioPath = Trim(mainAudioPath);

    std::wcout << L"Segments: ";
    std::getline(std::wcin, segInputString);

    SyncEngine engine;
    if (!engine.Initialize(mainAudioPath)) {
        MFShutdown();
        return 1;
    }

    auto segPaths = SplitPathString(segInputString);
    int total = segPaths.size();

    std::wcout << L"Processing " << total << L" segments in parallel...\n";
    auto startProcessing = std::chrono::high_resolution_clock::now();

    // OPTIMIZATION 3: Process files in parallel
    // This scales linearly with core count.
#pragma omp parallel for schedule(dynamic)
    for (int i = 0; i < total; ++i) {
        double offset = engine.FindOffset(segPaths[i]);

        // Critical section for printing
        std::lock_guard<std::mutex> lock(cout_mutex);
        if (offset >= 0) {
            std::wcout << L" -> [" << segPaths[i] << L"] Offset: " << offset << L"s\n";
        }
        else {
            std::wcout << L" -> [" << segPaths[i] << L"] Failed\n";
        }
    }

    auto endProcessing = std::chrono::high_resolution_clock::now();
    auto durationProcessing = std::chrono::duration_cast<std::chrono::milliseconds>(endProcessing - startProcessing);

    std::wcout << L"--------------------------------\n";
    std::wcout << L"Processing completed in " << durationProcessing.count() << L" ms ("
        << std::fixed << std::setprecision(2) << (durationProcessing.count() / 1000.0) << L" s)\n";

    MFShutdown();
    std::wcout << L"Done. Press any key to exit.";
    _getwch();
    return 0;
}