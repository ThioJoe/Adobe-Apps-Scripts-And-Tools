
#if defined THIOUTILS_EXPORTS
	#define THIOUTILS_API __declspec(dllexport)
#elif defined (__APPLE__) __attribute__((visibility("default")))
	#define THIOUTILS_API
#endif

#include "SoSharedLibDefs.h"
