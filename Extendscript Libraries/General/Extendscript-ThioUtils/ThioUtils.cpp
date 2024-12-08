#include "ThioUtils.h"
#include "SoSharedLibDefs.h"

// Include platform specific headers
#ifdef _WIN32
    #include <windows.h>
#elif defined(__APPLE__)
    #include <AudioToolbox/AudioToolbox.h>
#endif

//--------------------------------------------------------------------------------------
//-------------------------- Required Extendscript functions ---------------------------
//--------------------------------------------------------------------------------------

extern "C" THIOUTILS_API char* ESInitialize(const TaggedData** argv, long argc)
{
    static char funcNames[] = "systemBeep";
    return funcNames;
}

extern "C" THIOUTILS_API void ESTerminate() {
}

extern "C" THIOUTILS_API long ESGetVersion() {
    return 0x1;
}

extern "C" THIOUTILS_API void ESFreeMem(void* p) {
    delete[](char*)p;
}

//--------------------------------------------------------------------------------------
//------------------------------ Exported Custom Functions -----------------------------
//--------------------------------------------------------------------------------------
// Play system beep sound
extern "C" THIOUTILS_API long systemBeep(TaggedData* argv, long argc, TaggedData* retval) {
    #ifdef _WIN32
        MessageBeep(MB_ICONERROR);
		// This might not actually work, haven't tested it
    #elif defined(__APPLE__)
        AudioServicesPlaySystemSound(kSystemSoundID_UserPreferredAlert);
    #endif
        return kESErrOK;
}

