#pragma once

#include <vector>
#include <string>

// Load and resample audio from a file to 8000Hz mono float PCM
std::vector<float> LoadAndResampleAudio(const std::wstring& filename);

// Find the offset in seconds where segAudio appears in mainAudio
double FindOffset(std::vector<float>& mainAudio, std::vector<float>& segAudio);
