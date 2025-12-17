#if defined THIOUTILS_EXPORTS
#define THIOUTILS_API __declspec(dllexport)
#elif defined (__APPLE__)
#define THIOUTILS_API __attribute__((visibility("default")))
#else
#define THIOUTILS_API
#endif

// General Errors Custom Versions - Still throw exceptions but they can be caught unlike the built in Extendscript fatal errors
// Use numbers above 10000 to avoid conflicts with built-in ExtendScript errors
#define THIO_ERR_INTERNAL 10033
#define THIO_ERR_NO_MEMORY 10028
#define THIO_ERR_NOT_IMPLEMENTED 10036