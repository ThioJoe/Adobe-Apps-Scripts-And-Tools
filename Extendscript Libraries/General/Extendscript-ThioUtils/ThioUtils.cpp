#include "ThioUtils.h"
#include "SoSharedLibDefs.h"
#include <vector>
#include <string>     // For std::wstring, std::string manipulations
#include <algorithm>  // For std::transform

// Include platform specific headers
// ---------------- Windows ----------------
#ifdef _WIN32
#include <windows.h>
#include <mmsystem.h> // For PlaySound
#include <Shlwapi.h>
#include <pathcch.h> // For PathCchAppend. Using this instead of PathAppendW for safety and modernity.
#pragma comment(lib, "Winmm.lib")
#pragma comment(lib, "Pathcch.lib") // Needed for PathCchAppend
// ---------------- Apple ----------------
#elif defined(__APPLE__)
#include <AudioToolbox/AudioToolbox.h>
#endif

// Helper function for case-insensitive substring search (needed for ".wav")
// Returns true if 'sub' is found in 'str', ignoring case.
static bool findSubstringIgnoreCase(const std::string& str, const std::string& sub) {
    if (sub.length() > str.length()) {
        return false;
    }
    auto it = std::search(
        str.begin(), str.end(),
        sub.begin(), sub.end(),
        [](char ch1, char ch2) { return std::toupper(ch1) == std::toupper(ch2); }
    );
    return (it != str.end());
}

//--------------------------------------------------------------------------------------
//-------------------------- Required Extendscript functions ---------------------------
//--------------------------------------------------------------------------------------

extern "C" THIOUTILS_API char* ESInitialize(const TaggedData** argv, long argc)
{
    static char funcNames[] = "systemBeep_u,playSoundAlias_s";
    return funcNames;
}

extern "C" THIOUTILS_API void ESTerminate() {
}

extern "C" THIOUTILS_API long ESGetVersion() {
    return 0x1;
}

extern "C" THIOUTILS_API void ESFreeMem(void* p) {
    // Use free() as it matches memory allocated by malloc/strdup, which is commonly used for returning strings in these scenarios.
    if (p != nullptr) { // Add a null check for safety
        free(p);
    }
}

//--------------------------------------------------------------------------------------
//------------------------------ Exported Custom Functions -----------------------------
//--------------------------------------------------------------------------------------
//
// Remember:
//       argv = The javascript arguments passed to the function
//       argc = The number of arguments passed to the function
//       retval = The return value of the function passed back to javascript
//

/**
 * @brief Play system beep sound based on the provided type.
 * @param argv JavaScript arguments. Expects one unsigned integer (uint).
 * @param argc Argument count. Should be 1.
 * @param retval Return value (not used here).
 * @return kESErrOK on success, or an error code.
 *
 * JavaScript Usage: externalLibrary.systemBeep(soundType);
 * Example soundType values (Windows):
 * 0xFFFFFFFF : Simple Beep
 * 0x00000000 : MB_OK (Default Beep)
 * 0x00000010 : MB_ICONERROR / MB_ICONHAND / MB_ICONSTOP
 * 0x00000020 : MB_ICONQUESTION
 * 0x00000030 : MB_ICONWARNING / MB_ICONEXCLAMATION
 * 0x00000040 : MB_ICONINFORMATION / MB_ICONASTERISK
 */
extern "C" THIOUTILS_API long systemBeep(TaggedData* argv, long argc, TaggedData* retval) {
    // Set retval to undefined by default
    retval->type = kTypeUndefined;

#ifdef _WIN32
    // Check if exactly one argument was passed
    if (argc != 1) {
        return kESErrBadArgumentList; // Error: Incorrect number of arguments
    }

    UINT uType = 0; // Variable to hold the sound type

    if (argv[0].type == kTypeUInteger || argv[0].type == kTypeInteger) {
        // Extract the integer value and cast it to UINT.
        // For positive kTypeInteger, this works directly.
        // For negative kTypeInteger, it will wrap around (standard C++ unsigned cast behavior).
        uType = (UINT)argv[0].data.intval;
    }
    else {
        // Reject other types like double, string, bool, etc.
        return kESErrTypeMismatch; // Error: Incorrect argument type
    }

    // Call MessageBeep with the extracted type
    MessageBeep(uType);

#elif defined(__APPLE__)
    // Keep the original Mac behavior
    AudioServicesPlaySystemSound(kSystemSoundID_UserPreferredAlert);
#endif

    return kESErrOK; // Success
}

/**
 * @brief Plays a system sound specified by a registry alias OR a simple filename in C:\Windows\Media.
 * @param argv JavaScript arguments. Expects one string (the sound alias or simple filename like "ding.wav").
 * Strings containing path separators (\ or /) are rejected.
 * @param argc Argument count. Should be 1.
 * @param retval Return value (not used here).
 * @return kESErrOK on success, or an error code (e.g., kESErrBadArgumentList if path separators are found).
 *
 * If the input string contains ".wav" (case-insensitive), it's treated as a filename
 * relative to C:\Windows\Media. Otherwise, it's treated as a registry sound alias.
 * Plays asynchronously. Does nothing if the alias/file is not found.
 *
 * JavaScript Usage:
 * externalLibrary.playSoundAlias("SystemAsterisk"); // Plays alias
 * externalLibrary.playSoundAlias("notify.wav");     // Plays C:\Windows\Media\notify.wav
 * externalLibrary.playSoundAlias("C:\\Windows\\Media\\notify.wav"); // Throws Error (BadArgumentList)
 */
extern "C" THIOUTILS_API long playSoundAlias(TaggedData* argv, long argc, TaggedData* retval) {
    retval->type = kTypeUndefined;

#ifdef _WIN32
    if (argc != 1) return kESErrBadArgumentList;
    if (argv[0].type != kTypeString) return kESErrTypeMismatch;

    const char* inputUtf8 = argv[0].data.string;
    if (inputUtf8 == nullptr || inputUtf8[0] == '\0') return kESErrBadArgumentList;

    std::string inputStr(inputUtf8);
    DWORD dwFlags = 0;
    std::vector<wchar_t> widePathOrAlias;

    // Explicitly reject strings containing path separators. We will only allow filenames
    if (inputStr.find('\\') != std::string::npos || inputStr.find('/') != std::string::npos) {
        return kESErrBadArgumentList; // Error: Input string contains path separators
    }

    // Now determine if the path-separator-free input is likely a filename or an alias
    bool isLikelyFilename = findSubstringIgnoreCase(inputStr, ".wav");
    // (Removed path separator check here as it's done above)

    if (isLikelyFilename) {
        // --- Handle as Filename ---
        dwFlags = SND_FILENAME | SND_ASYNC | SND_NODEFAULT | SND_SYSTEM;

        wchar_t winDir[MAX_PATH];
        if (GetWindowsDirectoryW(winDir, MAX_PATH) == 0) return kESErrConversion;

        wchar_t mediaPath[MAX_PATH];
        if (FAILED(PathCchAppend(winDir, MAX_PATH, L"Media"))) return kESErrConversion;

        int fnWideCharCount = MultiByteToWideChar(CP_UTF8, 0, inputUtf8, -1, NULL, 0);
        if (fnWideCharCount == 0) return kESErrConversion;
        std::vector<wchar_t> wideFilename(fnWideCharCount);
        if (MultiByteToWideChar(CP_UTF8, 0, inputUtf8, -1, wideFilename.data(), fnWideCharCount) == 0) return kESErrConversion;

        wcscpy_s(mediaPath, MAX_PATH, winDir);
        if (FAILED(PathCchAppend(mediaPath, MAX_PATH, wideFilename.data()))) return kESErrConversion;

        size_t finalLen = wcslen(mediaPath) + 1;
        widePathOrAlias.resize(finalLen);
        wcscpy_s(widePathOrAlias.data(), finalLen, mediaPath);

    }
    else {
        // --- Handle as Alias ---
        dwFlags = SND_ALIAS | SND_ASYNC | SND_NODEFAULT | SND_SYSTEM;

        int wideCharCount = MultiByteToWideChar(CP_UTF8, 0, inputUtf8, -1, NULL, 0);
        if (wideCharCount == 0) return kESErrConversion;

        widePathOrAlias.resize(wideCharCount);
        if (MultiByteToWideChar(CP_UTF8, 0, inputUtf8, -1, widePathOrAlias.data(), wideCharCount) == 0) return kESErrConversion;
    }

    PlaySoundW(widePathOrAlias.data(), NULL, dwFlags);

#elif defined(__APPLE__)
    // No implementation for Mac
#endif

    return kESErrOK;
}