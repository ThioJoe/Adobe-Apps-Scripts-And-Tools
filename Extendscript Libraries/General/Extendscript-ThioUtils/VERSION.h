// VERSION.h
#pragma once

// --------------------------------------------------------------
// Define as (Major,Minor,Patch,Build) including the parentheses.
// This tuple will be used to generate all version formats.
#define MYPROJECT_VERSION_COMPONENTS_TUPLE (1,1,1,0)
// --------------------------------------------------------------

// --- Helper macros (you generally don't need to touch these) ---
#define STRINGIZE2(s) #s
#define STRINGIZE(s) STRINGIZE2(s)

// Macro to apply a tuple of arguments to another macro
// e.g., APPLY_TUPLE_TO_MACRO(FOO, (1,2,3)) becomes FOO(1,2,3)
#define APPLY_TUPLE_TO_MACRO(macro_to_call, tuple_with_args) macro_to_call tuple_with_args

// Macros to format the version components (these remain the same)
#define CREATE_VERSION_RC_FORMAT(major, minor, patch, build)      major,minor,patch,build
#define CREATE_VERSION_STRING_FORMAT(major, minor, patch, build)  STRINGIZE(major) "." STRINGIZE(minor) "." STRINGIZE(patch) "." STRINGIZE(build)

// Define the final macros for use in the .rc file and C++ code
#define MYPROJECT_VERSION_RC      APPLY_TUPLE_TO_MACRO(CREATE_VERSION_RC_FORMAT, MYPROJECT_VERSION_COMPONENTS_TUPLE)
#define MYPROJECT_VERSION_STRING  APPLY_TUPLE_TO_MACRO(CREATE_VERSION_STRING_FORMAT, MYPROJECT_VERSION_COMPONENTS_TUPLE)

// Define it as a long int for ESGetVersion
#define MYPROJECT_VERSION_LONG    APPLY_TUPLE_TO_MACRO(CREATE_VERSION_LONG_FORMAT, MYPROJECT_VERSION_COMPONENTS_TUPLE)

// Helper macro to create the long version format
#define CREATE_VERSION_LONG_FORMAT(major, minor, patch, build) (major * 10000000L + minor * 100000L + patch * 1000L + build)
