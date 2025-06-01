#include "ThioUtils.h"
#include "VERSION.h"
#include "SoSharedLibDefs.h"
#include <vector>
#include <string>     // For std::wstring, std::string manipulations
#include <algorithm>  // For std::transform
#include <stdexcept>  // For std::bad_alloc

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
    static char funcNames[] = "systemBeep_u,playSoundAlias_s,copyTextToClipboard_s,getVersion_s";
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

extern "C" THIOUTILS_API long getVersion(TaggedData* argv, long argc, TaggedData* retval) {
    retval->type = kTypeString;
    retval->data.string = _strdup(MYPROJECT_VERSION_STRING); // Allocate memory for the string
    return kESErrOK;  // Return success code
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


/**
 * @brief Copies the given string to the system clipboard.
 * @param argv JavaScript arguments. Expects one string.
 * @param argc Argument count. Should be 1.
 * @param retval Return value.
 * @return kESErrOK on success, or an error code.
 *
 * JavaScript Usage: externalLibrary.copyTextToClipboard("Text to copy");
 */
extern "C" THIOUTILS_API long copyTextToClipboard(TaggedData* argv, long argc, TaggedData* retval) {
    retval->type = kTypeInteger; // Set the type once for all integer status code returns via retval

    if (argc != 1) {
        retval->data.intval = kESErrBadArgumentList;
        return kESErrBadArgumentList;
    }
    if (argv[0].type != kTypeString) {
        retval->data.intval = kESErrTypeMismatch;
        return kESErrTypeMismatch;
    }

    const char* textToCopyUtf8 = argv[0].data.string;
    if (textToCopyUtf8 == nullptr) {
        retval->data.intval = kESErrBadArgumentList; // Null string pointer
        return kESErrBadArgumentList;
    }

    // If debug version of binary, add test case for special string to purposefully throw errors
    #ifdef _DEBUG
        try {
            // Check if the string starts with "__ERROR__" to trigger a test error. If there's an integer after "__ERROR__", it will be used as the error code
            if (strncmp(textToCopyUtf8, "__ERROR__", 9) == 0) {
                // Check if the string is exactly "__ERROR__" or has an integer after it
                if (textToCopyUtf8[9] == '\0') {
                    retval->data.intval = THIO_ERR_INTERNAL;
                    return THIO_ERR_INTERNAL;
                }
                else {
                    // Try to parse the integer after "__ERROR__"
                    int errorCode = std::stoi(textToCopyUtf8 + 9);
                    if (errorCode > -999 && errorCode < 99999) { // Just set a range as a sanity check
                        retval->data.intval = errorCode;
                        return errorCode;
                    }
                }
            }
        }
        catch (...) {
		    // Throw fatal error if parsing fails
            retval->data.intval = kESErrInternal;
		    return kESErrInternal;
        }
    #endif

#ifdef _WIN32
    // Convert UTF-8 string from ExtendScript to UTF-16 (WCHAR) for Windows API
    int wideCharCount = MultiByteToWideChar(CP_UTF8, 0, textToCopyUtf8, -1, NULL, 0);
    if (wideCharCount == 0) {
        retval->data.intval = kESErrConversion; // kESErrConversion is positive, no change needed unless you want to map it too
        return kESErrConversion;
    }

    std::vector<wchar_t> wideText;
    try {
        wideText.resize(wideCharCount); // Allocate memory for the vector
    }
    catch (const std::bad_alloc&) {
        retval->data.intval = THIO_ERR_NO_MEMORY;
        return THIO_ERR_NO_MEMORY;
    }

    if (MultiByteToWideChar(CP_UTF8, 0, textToCopyUtf8, -1, wideText.data(), wideCharCount) == 0) {
        retval->data.intval = kESErrConversion; // kESErrConversion is positive
        return kESErrConversion;
    }

    // Open the clipboard
    if (!OpenClipboard(NULL)) {
        retval->data.intval = THIO_ERR_CLIPBOARD_BUSY;
        return THIO_ERR_CLIPBOARD_BUSY;
    }

    // Empty the clipboard
    EmptyClipboard();

    // Allocate global memory for the string
    HGLOBAL hGlobal = GlobalAlloc(GMEM_MOVEABLE, wideText.size() * sizeof(wchar_t));
    if (hGlobal == NULL) {
        CloseClipboard();
        retval->data.intval = THIO_ERR_NO_MEMORY;
        return THIO_ERR_NO_MEMORY;
    }

    // Lock the memory and copy the string
    LPVOID pGlobal = GlobalLock(hGlobal);
    if (pGlobal == NULL) {
        GlobalFree(hGlobal);
        CloseClipboard();
        retval->data.intval = THIO_ERR_CLIPBOARD_LOCK_FAILED;
        return THIO_ERR_CLIPBOARD_LOCK_FAILED;
    }
    memcpy(pGlobal, wideText.data(), wideText.size() * sizeof(wchar_t));
    GlobalUnlock(hGlobal);

    // Set the clipboard data
    if (SetClipboardData(CF_UNICODETEXT, hGlobal) == NULL) {
        GlobalFree(hGlobal); // Free if SetClipboardData fails and system does not take ownership
        CloseClipboard();
        retval->data.intval = THIO_ERR_CLIPBOARD_SET_FAILED;
        return THIO_ERR_CLIPBOARD_SET_FAILED;
    }

    // Note: Do not call GlobalFree(hGlobal) after a successful SetClipboardData, as the system now owns that memory.
    // It will be freed when EmptyClipboard is called again or the clipboard is closed by another app.
    CloseClipboard();
    // If all Windows operations succeeded, we fall through to the final success return

#elif defined(__APPLE__)
    retval->data.intval = THIO_ERR_NOT_IMPLEMENTED; // Use your custom positive error code
    return THIO_ERR_NOT_IMPLEMENTED;
#endif

    // Success case
    retval->data.intval = kESErrOK;
    return kESErrOK;
}