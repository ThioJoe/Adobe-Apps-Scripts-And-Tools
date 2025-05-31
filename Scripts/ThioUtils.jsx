// File: ThioUtils.jsx
// Purpose: Wrapper for ThioUtils.dll ExternalObject.

// Place this script next to the ThioUtils.dll file.

var ThioUtils = (function() {

    // --- Private Members ---
    const VERSION = "1.1.0"; // Version of this wrapper script. The minor version should match the DLL version.

    var thioUtilsDll = null; // Stores the ExternalObject instance
    var _isLoaded = false;
    var _libFilename = "ThioUtils.dll";
    const ERROR_OK = 0; // kESErrOK from C++

    // --- DLL Loading ---
    // This block attempts to load the DLL when ThioUtils.jsx is included.
    try {
        var currentScriptFile = File($.fileName); // Path to this ThioUtils.jsx file
        
        // Assuming ThioUtils.dll is next to ThioUtils.jsx
        var libPath = currentScriptFile.parent.fullName + "/" + _libFilename;

        // Check if it's already loaded by some other means (less likely with this module pattern)
        if (typeof thioUtilsDll === 'undefined' || thioUtilsDll === null || thioUtilsDll === undefined || force === true) {
            var thioUtilsDll = new ExternalObject("lib:" + libPath);
            if (thioUtilsDll !== null) {
                _isLoaded = true;
            } else {
                _isLoaded = false;
                $.writeln("Failed to load ThioUtils library from: " + libPath);
            }
        } else {
            _isLoaded = true; // Already loaded, no need to reinitialize
        }
    } catch (e) {
        thioUtilsDll = null;
        _isLoaded = false;
        $.writeln("Error loading " + _libFilename + " (path: " + (typeof libPath !== 'undefined' ? libPath : "unknown") + "): " + e);
        // You might want to alert the user here if loading is critical for all scripts using this module.
        alert("Critical Error: Failed to load the ThioUtils library (" + _libFilename + ").\n" + e);
    }

    // -------------------------------------------------------------------------

    function getDllVersion() {
        var versionStr = "Unknown";
        if (!_isLoaded || typeof thioUtilsDll === 'undefined' && thioUtilsDll === null){
            return versionStr;
        }
    
        try {
            var version = thioUtilsDll.getVersion();
            if (version !== null && version !== undefined) {
                versionStr = version;
            }
        } catch (e) {
            $.writeln("ThioUtils.getVersion: Exception during call - " + e);
            return "Error retrieving version";
        }

        return versionStr;
    };

    // Check if the error object is a custom ThioUtils error
    function checkForCustomError(errorObj) {
        if (!errorObj || typeof errorObj !== 'object') {
            $.writeln("getErrorInfo: Invalid error object provided.");
            return 0; // Return 0 for no error information
        }

        if (errorObj.message === "Error #") {
            var errMsg = _getCustomErrorMessage(errorObj.number);
            if (errMsg !== 0) {
                return errMsg;
            }
        }

        return 0; // Default return if no custom error is found or it's not a ThioUtils error
    }

    // --- Error Definitions ---
    // Stores error names, codes, and messages in one place.
    var ERROR_DEFINITIONS = {
        OK: {
            code: 0,
            message: "Operation successful." // kESErrOK
        },
        THIO_ERR_INTERNAL: {
            code: 10033,
            message: "An internal library error occurred." // Custom mapping for kESErrInternal
        },
        THIO_ERR_NO_MEMORY: {
            code: 10028,
            message: "The library reported an out-of-memory condition." // Custom mapping for kESErrNoMemory
        },
        THIO_ERR_NOT_IMPLEMENTED: {
            code: 10036,
            message: "This feature is not implemented for the current platform." // Custom mapping for kESErrNotImplemented
        },
        THIO_ERR_CLIPBOARD_BUSY: {
            code: 10001,
            message: "Failed to open the system clipboard, it may be in use by another application."
        },
        THIO_ERR_CLIPBOARD_LOCK_FAILED: {
            code: 10002,
            message: "Failed to lock clipboard memory."
        },
        THIO_ERR_CLIPBOARD_SET_FAILED: {
            code: 10003,
            message: "Failed to set data to the clipboard."
        }
        // Add other error definitions here as needed
    };

    // --- Private Error Message Helper (for custom codes primarily) ---
    // Retrieves the message for a given error code by looking it up in ERROR_DEFINITIONS.
    function _getCustomErrorMessage(errorCode) {
        for (var key in ERROR_DEFINITIONS) {
            if (ERROR_DEFINITIONS.hasOwnProperty(key)) {
                if (ERROR_DEFINITIONS[key].code === errorCode) {
                    return ERROR_DEFINITIONS[key].message;
                }
            }
        }
        return 0; // Return 0 if the error code is not found (maintains previous behavior for unknown codes)
    }

    // ======================== Public API Object ========================
    var publicApi = {};

    publicApi.version_script = "1.0.0"; // Version of this script wrapper
    publicApi.version_dll = getDllVersion(); // Version of the loaded DLL, if available

    /**
     * Checks if the ThioUtils DLL was successfully loaded.
     * @returns {boolean} True if loaded, false otherwise.
     */
    publicApi.isLoaded = function() {
        var _result = (_isLoaded && typeof thioUtilsDll !== 'undefined' && thioUtilsDll !== null)
        return _result;
    };

    /**
     * Plays a system beep sound. (Corresponds to C++ systemBeep_u)
     * @param {number} soundType - The UINT sound type code (Windows-specific).
     */
    publicApi.systemBeep = function(soundType) {
        if (!publicApi.isLoaded()) {
            return -999;
        }

        try {
            var result = thioUtilsDll.systemBeep(soundType);
            if (result === ERROR_OK) {
                return 0;
            } 
        } catch (e) {
            var exceptMsg = "ThioUtils.systemBeep: Exception during call - " + e;
            $.writeln(exceptMsg);
            return e.number;
        }
    };

    /**
     * Plays a system sound by alias or filename. (Corresponds to C++ playSoundAlias_s)
     * @param {string} aliasOrFilename - The sound alias or simple .wav filename.
     */
    publicApi.playSoundAlias = function(aliasOrFilename) {
        if (!publicApi.isLoaded()) {
            return -999;
        }

        if (typeof aliasOrFilename !== 'string') {
            alert("ThioUtils.copyTextToClipboard: The text to copy must be a string.");
            return -1;
        }

        try {
            var result = thioUtilsDll.playSoundAlias(aliasOrFilename);
            if (result === ERROR_OK) {
                return 0;
            }
        } catch (e) {
            var exceptMsg = "ThioUtils.playSoundAlias: Exception during call - " + e;
            $.writeln(exceptMsg);
            return e.number;
        }
    };

    /**
     * Copies the given text to the system clipboard. (Corresponds to C++ copyTextToClipboard_s)
     * @param {string} textToCopy - The string to copy.
     */
    publicApi.copyTextToClipboard = function(textToCopy) {
        if (!publicApi.isLoaded()) { return -999; }

        if (typeof textToCopy !== 'string') {
            alert("ThioUtils.copyTextToClipboard: The text to copy must be a string.");
            return -1;
        }

        try {
            var result = thioUtilsDll.copyTextToClipboard(textToCopy);
            if (result === ERROR_OK) { return 0; } 
        } catch (e) {
            var customErrorResult = checkForCustomError(e);

            if (customErrorResult !== 0) {
                var exceptMsg = "ThioUtils.copyTextToClipboard Error - " + customErrorResult;
            } else {
                var exceptMsg = "ThioUtils.copyTextToClipboard: Exception during call - " + e.message;
            }

            $.writeln(exceptMsg);
            alert(exceptMsg);
            return e.number;
        }
    };

    publicApi.reloadDll = function() {
        // Reload the DLL if needed, or reinitialize the object
        try {
            if (thioUtilsDll !== null) {
                thioUtilsDll.close(); // Close the existing instance
            }
            thioUtilsDll = new ExternalObject("lib:" + _libFilename);
            _isLoaded = (thioUtilsDll !== null);
        } catch (e) {
            _isLoaded = false;
            $.writeln("Error reloading ThioUtils library: " + e);
            alert("Critical Error: Failed to reload the ThioUtils library.\n" + e);
        }
    };

    publicApi.reloadThisWrapper = function() {
        // Reload this script wrapper, useful for development or testing
        try {
            var currentScriptFile = File($.fileName);
            $.evalFile(currentScriptFile);
            $.writeln("ThioUtils wrapper reloaded successfully.");
        } catch (e) {
            $.writeln("Error reloading ThioUtils wrapper: " + e);
            alert("Critical Error: Failed to reload the ThioUtils wrapper.\n" + e);
        }
    };

    // Return the public API object, making it available as 'ThioUtils'
    return publicApi;

})(); // Execute the IIFE to create the ThioUtils object

