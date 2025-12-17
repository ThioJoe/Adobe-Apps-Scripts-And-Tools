#pragma once

#include <vector>
#include <cstdint>

// Internal sample rate used for correlation processing
constexpr int INTERNAL_SAMPLE_RATE = 8000;

// ---------------------------------------------------------
// AudioSyncEngine - Main class for audio offset detection
// ---------------------------------------------------------
class AudioSyncEngine {
public:
    AudioSyncEngine();
    ~AudioSyncEngine();

    // Initialize the engine with the main/reference audio
    // Parameters:
    //   audioBuffers - Premiere-style array of channel buffers (float**)
    //   numChannels  - Number of audio channels
    //   numSamples   - Number of sample frames per channel
    //   sampleRate   - Original sample rate of the audio
    // Returns: true on success, false on failure
    bool InitializeWithMainAudio(
        float** audioBuffers,
        int numChannels,
        int64_t numSamples,
        int sampleRate
    );

    // Find the offset of a segment within the main audio
    // Parameters:
    //   audioBuffers - Premiere-style array of channel buffers (float**)
    //   numChannels  - Number of audio channels
    //   numSamples   - Number of sample frames per channel
    //   sampleRate   - Original sample rate of the audio
    // Returns: Offset in seconds, or -1.0 on error
    double FindOffset(
        float** audioBuffers,
        int numChannels,
        int64_t numSamples,
        int sampleRate
    );

    // Check if the engine has been initialized
    bool IsInitialized() const;

    // Reset the engine (clears cached main audio FFT)
    void Reset();

private:
    class Impl;
    Impl* pImpl; // Pointer to implementation (PIMPL pattern)
};

// ---------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------

// Convert multi-channel audio to mono by averaging all channels
// Parameters:
//   audioBuffers - Premiere-style array of channel buffers (float**)
//   numChannels  - Number of audio channels
//   numSamples   - Number of sample frames per channel
// Returns: Mono audio as a vector of floats
std::vector<float> ConvertToMono(
    float** audioBuffers,
    int numChannels,
    int64_t numSamples
);

// Resample audio to the internal sample rate (8000 Hz)
// Uses simple linear interpolation
// Parameters:
//   audio      - Input audio samples
//   srcRate    - Source sample rate
//   targetRate - Target sample rate (default: INTERNAL_SAMPLE_RATE)
// Returns: Resampled audio
std::vector<float> ResampleAudio(
    const std::vector<float>& audio,
    int srcRate,
    int targetRate = INTERNAL_SAMPLE_RATE
);

// Select the best channel from multi-channel audio
// Currently selects channel 0 (left channel for stereo)
// Parameters:
//   audioBuffers - Premiere-style array of channel buffers (float**)
//   numChannels  - Number of audio channels  
//   numSamples   - Number of sample frames per channel
//   channelIndex - Which channel to select (default: 0)
// Returns: Single channel audio as a vector of floats
std::vector<float> SelectChannel(
    float** audioBuffers,
    int numChannels,
    int64_t numSamples,
    int channelIndex = 0
);
