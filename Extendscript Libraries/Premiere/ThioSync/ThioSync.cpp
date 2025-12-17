#include "ThioSync.h"
#include "VERSION.h"
#include "SoSharedLibDefs.h"
#include "Find-Audio-Offset.h"

//--------------------------------------------------------------------------------------
//-------------------------- Required Extendscript functions ---------------------------
//--------------------------------------------------------------------------------------

extern "C" THIOUTILS_API char* ESInitialize(const TaggedData** argv, long argc)
{
    static char funcNames[] = "getAudioOffset_s";
    return funcNames;
}

extern "C" THIOUTILS_API void ESTerminate() {
    // Free any resources if we had allocated any.
}

extern "C" THIOUTILS_API long ESGetVersion() {
    // Return the version of this library as a long integer.
    return MYPROJECT_VERSION_LONG;
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

extern "C" THIOUTILS_API long getVersion(TaggedData* argv, long argc, TaggedData* retval) {
    retval->type = kTypeString;
    retval->data.string = _strdup(MYPROJECT_VERSION_STRING); // Allocate memory for the string
    return kESErrOK;  // Return success code
}



/**
 * @brief Plays a system sound specified by a registry alias OR a simple filename in C:\Windows\Media.
 * @param argv JavaScript arguments.
 * @param argc Argument count. 
 * @param retval Return value
 * @return kESErrOK on success, or an error code.
 *
 *
 * JavaScript Usage:

 */
extern "C" THIOUTILS_API long getAudioOffset(TaggedData* argv, long argc, TaggedData* retval) {
    retval->type = kTypeString;

    //if (argc != 1) return kESErrBadArgumentList;
    //if (argv[0].type != kTypeString) return kESErrTypeMismatch;

    return kESErrOK;
}