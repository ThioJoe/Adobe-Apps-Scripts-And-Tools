
#if defined THIOUTILS_EXPORTS
	#define THIOUTILS_API __declspec(dllexport)
#elif defined (__APPLE__) __attribute__((visibility("default")))
	#define THIOUTILS_API
#endif

// General Errors Custom Versions - Still throw exceptions but they can be caught unlike the built in Extendscript fatal errors
// Use numbers above 10000 to avoid conflicts with built-in ExtendScript errors
#define THIO_ERR_INTERNAL 10033
#define THIO_ERR_NO_MEMORY 10028
#define THIO_ERR_NOT_IMPLEMENTED 10036

// Error specific to clipboard function
#define THIO_ERR_CLIPBOARD_BUSY 10001		 // Failed to open clipboard, likely due to another process using it
#define THIO_ERR_CLIPBOARD_LOCK_FAILED 10002 // Example value, for GlobalLock failure
#define THIO_ERR_CLIPBOARD_SET_FAILED  10003 // Example value, for SetClipboardData failure