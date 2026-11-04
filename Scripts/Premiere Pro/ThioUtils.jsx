// ThioUtils.jsx - Utility functions for Premiere Pro Extendscript
// Updated - 11/4/26
//
// NOTE FOR AI AGENTS: See organized list of all helpers functions at the bottom, searchable by the line containing "// region Categories"
//
// Examples of ways to Include:
//    #include './includes/ThioUtils.jsx'
//    #include 'ThioUtils.jsx'
//
// ---------------------------- How to Use ----------------------------
// To use these utilities, include this file. Then, you can call functions like:
//      var topTrackIndex = Thio.getTopTrackItemAtPlayhead();
//      var selectedClips = Thio.GetSelectedVideoClips();
//
// You can use this robust include logic at the top of your script:
// ---------------------- Include Thio Utils ---------------------------
// function getCurrentScriptDirectory() { return (new File($.fileName)).parent; }
// function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }
// /** @param {string} relPath */ function relativeToFullPath(relPath) { return joinPath(getCurrentScriptDirectory(), relPath); }
// try { eval("#include '" + relativeToFullPath("ThioUtils.jsx") + "'"); }
// catch(e) {
//     try { var e1=e; eval("#include '" + relativeToFullPath("includes/ThioUtils.jsx") + "'"); } // Check Utils folder
//     catch(e) { var e2=e; try { eval("#include '" + relativeToFullPath("../ThioUtils.jsx") + "'"); } // Check parent directory
//     catch (e) { var e3=e; try { eval("#include '" + relativeToFullPath("../includes/ThioUtils.jsx") + "'"); } // Check parent includes folder
//     catch (e) { var e4=e; alert("Could not find ThioUtils.jsx in current dir, includes folder, or parent dir." + "\n\nAll Attempt Errors: \n"+e1+"\n"+e2+"\n"+e3+"\n"+e4); } // Return optional here, if you're within a main() function
// }}}
// ----------------------------------------------------------------------
//
// Random Notes:
//    To clear console in Extendscript Toolkit, can use app.clc();  Or this line for automatic each run, regardless of target app:
//      var bt=new BridgeTalk;bt.target='estoolkit-4.0';bt.body='app.clc()';bt.send(5);
//
// Author Repo: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools

// Useful Objects:
// QE DOM is at: $.global.qe
//      Some functions at: $.global.qe.ea

// Notes for ts-ignore: Don't use the @ after // syntax, it will cause error. Instead use this syntax. 
//      expect error is better because it will let you know if the defs catch up and is no longer necessary
//   /* @ts-ignore */
//   /* @ts-expect-error */

// These path functions are kept global to allow this file to load its own dependencies.
// They are also added to the Thio object for consistent access from other scripts.
/**
 * @returns {Folder} The directory of the current running script as a Folder object.
 */
function getCurrentScriptDirectory() { return (new File($.fileName)).parent; }
/**
 * @returns {string} A string that joins all arguments with '/' as the separator.
 */
function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }
/**
 * @param {string} relativePath
 * @returns {string} The full path as a string.
 */
function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }

/**
 * Function to search several pre-designated paths for a script file to include. If found it returns a full "#include" string that can be passed into eval.
 * The eval function apparently needs to be ran from global scope which is why we don't just run the eval within this function.
 * @param {string} fileName 
 * @param {boolean} required 
 * @param {string} notAvailableFunctionalityString 
 */
function includeFile(fileName, required, notAvailableFunctionalityString) {
    var notAvailStr;
    if (typeof notAvailableFunctionalityString === 'undefined' || notAvailableFunctionalityString === undefined || notAvailableFunctionalityString === null ||  (typeof notAvailableFunctionalityString === 'string' && notAvailableFunctionalityString === '')) {
        notAvailStr = "Some";
    } else {
        notAvailStr = notAvailableFunctionalityString;
    }

    /**
     * Makes an eval include string from a file path
     * @param {string} path 
     */
    function getEvalString(path) {
        return "#include '" + path + "'"
    }

    // Define where to look
    var pathsToSearch = [
        relativeToFullPath(fileName),
        relativeToFullPath("includes/" + fileName),
        relativeToFullPath("include/" + fileName),
        relativeToFullPath("../" + fileName),
        relativeToFullPath("../includes/" + fileName)
    ]

    // Look through each path and return if found
    for (var i = 0; i < pathsToSearch.length; i++) {
        if ( File(pathsToSearch[i]).exists === true ) {
            return getEvalString(pathsToSearch[i]);
        }
    }

    // If at this point, it failed to find the file.
    if (required === true) {
        var errStr = "Could not find " + fileName + ". Looked in same folder, and looked in any 'includes' and 'include' folders. This file is required and some utilities won't work without it."
        $.writeln(errStr);
        alert(errStr + "\n\n" + notAvailStr);
    } else {
        $.writeln("Could not find " + fileName + ". Looked in same folder, and looked in any 'includes' and 'include' folders. " + notAvailStr + " functionality will not be available");
    }

    return null;
}

// ------- Other included scripts. We apparently need to run eval in the global scope. -------
// Not required but recommended - ThioUtilsLib.jsx and ThioUtils.dll
var incThioUtilsLib = includeFile("ThioUtilsLib.jsx", false, "ThioUtils.dll")
if (incThioUtilsLib !== null) {
    try {
        eval(incThioUtilsLib);
    } catch (e) {
        var err = /** @type {Error} */ (e);
        $.writeln("Error including ThioUtilsLib.jsx. " + err.toString());
        alert("Error -- Found ThioUtilsLib.jsx but failed to load it. Some functionality will not be available. \n\nError Message:\n" + err.toString());
    }
}
// Required - es5-shim.js
var incEs5Shim = includeFile("es5-shim.js", true, "You can find this file in the Scripts/include folder of my repo (https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools). Put the file next to the ThioUtils.jsx script or in a folder called 'includes' or 'include'.")
if (incEs5Shim !== null) {
    try {
        eval(incEs5Shim);
    } catch (e) {
        var err = /** @type {Error} */ (e);
        $.writeln("Error including es5-shim.js. " + err.toString());
        alert("Error -- Found ThioUtilsLib.jsx but failed to load it because es5-shim.js failed to load. Some functionality will not be available. \n\nError Message:\n" + err.toString());
    }
}

// ------- Capture a private, known-good copy of the JSON shim -------
// es5-shim.js only builds its JSON implementation if a global JSON is missing (json2.js-style
// guards: `typeof JSON !== "object"`, `typeof JSON.parse/stringify !== "function"`). So if another
// extension or script already installed an OLDER global JSON before this file loaded, the include
// above will have left that older version in place, and bare JSON.parse / JSON.stringify calls in
// this file would silently use it.
// To guarantee a known-good copy without modifying es5-shim.js: temporarily clear the global JSON,
// re-run the shim (every one of its other patches is feature-guarded, so re-evaluating them is a
// harmless no-op), privately keep a reference to the freshly built JSON, then restore the global
// to exactly what it was so other extensions are unaffected.
// Note: This must run at global scope, same as the includes above.
var __ThioUtils_pristineJSON = null;
if (incEs5Shim !== null) {
    var __ThioUtils_prevJSON = $.global.JSON; // Whatever is global right now (ours, or another extension's)
    try {
        $.global.JSON = undefined;                // Makes `typeof JSON !== "object"` true, so the shim rebuilds JSON in full
        eval(incEs5Shim);                         // Re-evaluate the shim; only the JSON portion actually does anything this time
        __ThioUtils_pristineJSON = $.global.JSON; // Capture the freshly built, complete JSON object privately
    } catch (e) {
        var errShimJson = /** @type {Error} */ (e);
        $.writeln("Warning: Could not capture a pristine JSON shim, will fall back to the global JSON. " + errShimJson.toString());
    }
    $.global.JSON = __ThioUtils_prevJSON;         // Always restore the global exactly as it was
}

// -------------------------------------------------------

app.enableQE();
if (typeof qe === 'undefined' || qe === undefined || qe === null) {
    alert("Error: Could not access the QE DOM. Make sure you are running this script in Adobe Premiere Pro and that you have enabled the QE DOM.");
    throw("Error: Could not access the QE DOM. Make sure you are running this script in Adobe Premiere Pro and that you have enabled the QE DOM.");
}

/**
 * Custom object for holding info about QE TrackItems.
 * @typedef {Object} ThioUtils.ClipInfoQE
 * @property {string} name - The name of the clip
 * @property {string} vanillaMediaType - Media type from vanilla API ("Video" or "Audio")
 * @property {number} clipItemIndexQE - The QE clip index in the track
 * @property {number} trackIndex - The track index in the sequence
 * @property {string} startTicks - Start time in ticks as string
 * @property {string} endTicks - End time in ticks as string
 * @property {string} vanillaNodeId - Node ID from vanilla clip object
 * @property {QETrackItem} fullQEClipObject - Complete QE clip object reference
 * @property {TrackItem} fullVanillaClipObject - Complete vanilla clip object reference
 */

/**
 * Custom object for holding info about TrackItems
 * @typedef {Object} ThioUtils.ClipInfoVanilla
 * @property {string} name - The name of the clip
 * @property {string} startTicks - Start time in ticks relative to the timeline
 * @property {string} endTicks - End time in ticks relative to the timeline
 * @property {string} internalClipStartTicks - In point in ticks relative to the clip
 * @property {string} internalClipEndTicks - Out point in ticks relative to the clip
 * @property {number} trackIndex - The track index in the sequence
 * @property {string} nodeId - Node ID of the clip
 * @property {TrackItem} fullClipObject - Complete clip object reference
 */

/**
 * Custom object for holding a clip's timeline range after any transition-covered portions have been excluded.
 * @typedef {Object} ThioUtils.ClipTimelineRangeNoTransitions
 * @property {Time} start - The clip's timeline start, pushed later if a transition covers the head of the clip
 * @property {Time} end - The clip's timeline end, pulled earlier if a transition covers the tail of the clip
 * @property {Time} originalStart - The clip's unmodified timeline start
 * @property {Time} originalEnd - The clip's unmodified timeline end
 * @property {boolean} trimmedStart - Whether a transition caused the start to be moved
 * @property {boolean} trimmedEnd - Whether a transition caused the end to be moved
 * @property {boolean} fullyCovered - True if transitions cover the entire clip, in which case start and end are equal (zero length range)
 * @property {TrackItem} clip - The vanilla clip the range belongs to
 */

/**
 * @typedef {Object} ThioUtils.ClipTransitionInfo
 * @property {ThioUtils.ClipInfoQE} clipInfo - Clip information from ThioUtils.getSelectedClipInfoQE()
 * @property {ThioUtils.TransitionPair} transitions - Object containing left and right transition data
 */

/**
 * @typedef {Object} ThioUtils.TransitionPair
 * @property {ThioUtils.TransitionData|null} left - Left transition data or null if none exists
 * @property {ThioUtils.TransitionData|null} right - Right transition data or null if none exists
 */

/**
 * @typedef {Object} ThioUtils.TransitionData
 * @property {string} name - The name of the transition
 * @property {Time} timelineStart - Start time relative to timeline
 * @property {Time} timelineEnd - End time relative to timeline
 * @property {Time} timelineEffectiveStart - Calculated effective start time, relative to timeline -- Maybe redundant?
 * @property {Time} timelineEffectiveEnd - Calculated effective end time, relative to timeline -- Maybe redundant?
 * @property {Time} internalStart - Start time relative to the clip's internal timecode
 * @property {Time} internalEnd - End time relative to the clip's internal timecode
 * @property {Time} duration - Duration object
 * @property {number} alignment - Transition alignment value
 * @property {Object} fullTransitionObject - Complete transition object reference
 */

/**
 * @typedef {Object} ThioUtils.FileNameParts
 * @property {string} stem The file name stem. The name without extension.
 * @property {string} extension - The file name extension (without the period)
 */

var ThioUtils = (function () {
    // ======================== Public API Object ========================
    var pub = {}; // Public object

    // ======================== Shims ========================
    // Defined first, immediately after `pub`, so that pub.JSON / pub.shims etc. are valid
    // everywhere in this IIFE - including internal use inside any function below (prefer
    // `pub.JSON.parse(...)` internally: unlike `this.JSON` it works in any call style, and
    // unlike `ThioUtils.JSON` it doesn't depend on the global binding existing/surviving).
    // Known-good references captured when this file loaded.
    // - JSON is the pristine copy built directly from es5-shim.js at load time (see the capture
    //   logic near the top of this file), so it stays correct even if another extension replaces
    //   the global JSON with an older version before OR after ThioUtils loads.
    // - The rest are the built-in constructors: the shim patches those in place (it only ADDS
    //   missing prototype methods, never replaces the objects), so capturing the references here
    //   is sufficient; another script can't swap them out from under us the way it can with JSON.
    var privateShims = {
        JSON: (__ThioUtils_pristineJSON !== null) ? __ThioUtils_pristineJSON : $.global.JSON, // Fall back to global if capture failed
        Array: Array,
        String: String,
        Object: Object,
        Date: Date,
        Function: Function,
        Number: Number,
        Boolean: Boolean
    };

    /**
     * @namespace shims
     * @memberof ThioUtils
     * @description Known-good shims for ES5 features in older ExtendScript environments. Unlike the
     * bare globals, ThioUtils.shims.JSON is guaranteed to be the full implementation from es5-shim.js
     * even if another script/extension has overridden the global JSON with an older version.
     */
    pub.shims = privateShims;

    // Each shim is also attached directly onto the public object (same convention as MAX_SAFE_INTEGER),
    // so internal functions can use `this.JSON`, `this.Array`, etc., and external scripts can use
    // ThioUtils.JSON.parse(...) as a shortcut for ThioUtils.shims.JSON.parse(...).
    //
    // CAUTION on `this`: it only points at ThioUtils when a function is INVOKED as ThioUtils.func().
    // In a bare call, a callback, or a call through a sub-namespace (ThioUtils.edit.func()), `this`
    // is the global object (or the namespace object) instead - and `this.JSON` would then silently
    // resolve to the global JSON, which is exactly the possibly-overridden one we're avoiding.
    // In any code where that could happen, reference `privateShims.JSON` directly (it's a closure
    // variable, so it works regardless of how the function was called), or use ThioUtils.shims.JSON.
    pub.JSON = privateShims.JSON;
    pub.Array = privateShims.Array;
    pub.String = privateShims.String;
    pub.Object = privateShims.Object;
    pub.Date = privateShims.Date;
    pub.Function = privateShims.Function;
    pub.Number = privateShims.Number;
    pub.Boolean = privateShims.Boolean;


    // Returns the directory of the current running script as a File object.
    // Useful for referencing other scripts or resources relative to this script's location.
    pub.getCurrentScriptDirectory = function () {
        return getCurrentScriptDirectory();
    };

    // Joins multiple path segments into a single path string separated by '/'.
    /** @type {(...args: string[]) => string} */
    pub.joinPath = joinPath;

    // Given a relative path, returns a full path by joining it with the directory of the current script.
    /** @type {(relativePath: string) => string} */
    pub.relativeToFullPath = relativeToFullPath;

    /**
     * Determines the top track item at the current playhead position in the active sequence, or the track index of that item.
     * Useful for placing an item on the track and ensuring you don't overwrite something there.
     *
     * @overload
     * @param {true} returnAsObject Specifies that the function should return the TrackItem object.
     * @returns {TrackItem | null} The top track item at the playhead position, or null if no item is found.
     *
     * @overload
     * @param {false} [returnAsObject=false] Specifies that the function should return the track index.
     * @returns {number} The track index (0-based) of the top item. Returns -1 if no item is found.
     *
     * @param {boolean} [returnAsObject=false] If true, returns the TrackItem object; if false, returns the track index.
     * @returns {TrackItem | number | null} The top track item, its track index, or a value indicating not found.
     */
    pub.getTopTrackItemAtPlayhead = function (returnAsObject) {
        var seq = app.project.activeSequence;
        var currentTime = Number(seq.getPlayerPosition().ticks);
        var highestTrackIndex = -1;

        if (typeof returnAsObject === 'undefined' || returnAsObject === undefined || returnAsObject === null) {
            returnAsObject = false; // Default to returning the track index
        }

        // Make a dictionary with clips and their corresponding track index
        /** @type {{ [key: number]: TrackItem }} */
        var clipsDict = {};
        var indexesArray = []; // Use to easily get the max index later

        for (var i = 0; i < seq.videoTracks.numTracks; i++) {
            var track = seq.videoTracks[i];
            for (var j = 0; j < track.clips.numItems; j++) {
                var clip = track.clips[j];
                var clipStart = Number(clip.start.ticks);
                var clipEnd = Number(clip.end.ticks);

                if (currentTime >= clipStart && currentTime < clipEnd) {
                    clipsDict[i] = clip;
                    indexesArray.push(i);
                }
            }
        }

        // Get the largest key index number
        highestTrackIndex = Math.max.apply(null, indexesArray);
        var topTrackItem = clipsDict[highestTrackIndex];

        if (topTrackItem) {
            if (returnAsObject) {
                return topTrackItem; // Return the track item object
            } else {
                return highestTrackIndex; // Return the track index (Note this is 0 based, add 1 to get track number)
            }
        } else {
            return -1; // Return -1 to indicate no track item found
        }
    };
    
    /**
     * Gets the first available track with no clips at the desired position. If provided start and end time objects, it will ensure the entire range on the returned track is available, otherwise will just use the point in time at the playhead.
     * @param {Time=} startTime Optional: The clip to check the entire range of. If not provided, will just check the playhead position. If provided but not endTime, this will be used as the point in time.
     * @param {Time=} endTime Optional: The clip to check the entire range of. If not provided, will just check the playhead position.
     * @param {Number=} minTrackIndex Optional: The minimum track index to start checking from. Default is 0.
     * @param {Boolean=} onTop Optional: If true, will return the first available track without any clips above it, instead of the first available one outright. Default is false.
     * @param {Boolean=} allowLockedAvailable Optional: If true, may consider locked tracks as available. Default is false.
     * @returns {Number|null}
     */
    pub.getFirstAvailableTrackIndex = function(startTime, endTime, minTrackIndex, onTop, allowLockedAvailable) {
        var seq = app.project.activeSequence;
        var targetStart, targetEnd;
        
        if (typeof minTrackIndex === 'undefined' || minTrackIndex === undefined || minTrackIndex === null) {
            minTrackIndex = 0;
        }
        if (typeof onTop === 'undefined' || onTop === undefined || onTop === null) {
            onTop = false;
        }
        if (typeof allowLockedAvailable === 'undefined' || allowLockedAvailable === undefined || allowLockedAvailable === null) {
            allowLockedAvailable = false;
        }

        // If no start time
        if (typeof startTime === 'undefined' || startTime === undefined || startTime === null) {
            var playheadTimeObj = seq.getPlayerPosition();
            targetStart = playheadTimeObj;
            targetEnd = playheadTimeObj;
        } else if (startTime instanceof Time) {
            // If there is an end time
            if (endTime instanceof Time) {
                targetStart = startTime;
                targetEnd = endTime;
            // If there was a start time but no end time
            } else {
                targetStart = startTime;
                targetEnd = startTime;
            }
        } else {
            alert("Error: The provided clip parameter is not a valid TrackItem.");
            return null;
        }

        var originalNumTracks = seq.videoTracks.numTracks;
        if (onTop) {
            // Walk down from the top track. Once a track has a clip in range, it and every track below it have a clip above them, so stop there.
            var lowestClearTrackIndex = null;
            for (var i = seq.videoTracks.numTracks - 1; i >= minTrackIndex; i--) {
                if (seq.videoTracks[i].isLocked() && !allowLockedAvailable) {
                    continue; // Consider locked tracks not available, but don't let their clips block the tracks below
                }
                if (ThioUtils.checkIfAnyClipsInTimeRangeOnTrack(targetStart, targetEnd, i, "video") !== false) {
                    break;
                }
                lowestClearTrackIndex = i;
            }
            if (lowestClearTrackIndex !== null) {
                return lowestClearTrackIndex;
            }
        } else {
            for (var i = minTrackIndex; i < seq.videoTracks.numTracks; i++) {
                if (seq.videoTracks[i].isLocked() && !allowLockedAvailable) {
                    continue; // Consider locked tracks not available
                }

                if (ThioUtils.checkIfAnyClipsInTimeRangeOnTrack(targetStart, targetEnd, i, "video") === false) {
                    return i; // Return the first available track index
                }
            }
        }

        var QESeq = ThioUtils.getQESequenceFromVanilla(seq)
        if (typeof QESeq === 'undefined' || QESeq === undefined || QESeq === null) {
            return null
        }

        // If no available track found, add one with the QE DOM
        QESeq.addTracks(1, seq.videoTracks.numTracks, 0) // Add one video track at the top index, no audio tracks
        if (seq.videoTracks.numTracks > originalNumTracks) {
            return (seq.videoTracks.numTracks - 1)
        }
        return null;
    };

    /**
     * Gets the intrinsic media type from a clip's project item metadata. For example, "Still Image"
     * @param {ProjectItem} targetItem 
     * @returns {string|null} The intrinsic media type string, or null if it cannot be determined.
     */
    pub.getIntrinsicMediaType = function(targetItem) {
        var metadata = targetItem.getProjectMetadata(); 
        try {
            if (!metadata) { return null; }

            // Use string manipulation to find the VideoInfo tag content
            var startTag = '<premierePrivateProjectMetaData:Column.Intrinsic.MediaType>';
            var endTag = '</premierePrivateProjectMetaData:Column.Intrinsic.MediaType>';

            var startIndex = metadata.indexOf(startTag);
            var endIndex = metadata.indexOf(endTag, startIndex);
            if (startIndex === -1 || endIndex === -1) { return null; }

            startIndex += startTag.length; // Move index past the start tag
            var mediaTypeString = metadata.substring(startIndex, endIndex);
            
            return mediaTypeString;
        } catch (e) {
            var err = /** @type {Error} */ (e);
            $.writeln("Error processing projectItem metadata: " + err.toString());
        }
        return null
    };

    /**
     * Gets the video resolution from a clip's project item metadata.
     * @param {TrackItem|ProjectItem} targetItem The clip on the timeline to inspect.
     * @returns {{x: number, y: number} | null} An object containing the x and y resolution, or null if it cannot be determined.
     */
    pub.getResolutionFromProjectItem = function (targetItem) {
        var projectItem = null;
        // If it's not already a project item, get the project item from the clip
        if (targetItem instanceof TrackItem) {
            projectItem = targetItem.projectItem;
        } else if (targetItem instanceof ProjectItem) {
            projectItem = targetItem; // It's already a ProjectItem
        }

        var xRes = -1;
        var yRes = -1;

        if (typeof projectItem === 'undefined' || projectItem === undefined || projectItem === null) {
            return null
        }

        try {
            var metadata = projectItem.getProjectMetadata(); //

            if (metadata) {
                // Use string manipulation to find the VideoInfo tag content
                var startTag = '<premierePrivateProjectMetaData:Column.Intrinsic.VideoInfo>';
                var endTag = '</premierePrivateProjectMetaData:Column.Intrinsic.VideoInfo>';

                var startIndex = metadata.indexOf(startTag);
                if (startIndex !== -1) {
                    startIndex += startTag.length; // Move index past the start tag
                    var endIndex = metadata.indexOf(endTag, startIndex);
                    if (endIndex !== -1) {
                        var videoInfo = metadata.substring(startIndex, endIndex);

                        // Optional: Clean up to remove pixel aspect ratio like "(1.0)"
                        var parIndex = videoInfo.indexOf('(');
                        if (parIndex !== -1) {
                            videoInfo = videoInfo.substring(0, parIndex).replace(/^\s+|\s+$/g, ''); // Trim whitespace

                            // Split into dimensions
                            var dimensions = videoInfo.split('x');

                            if (dimensions.length === 2) {
                                // Trim whitespace from each part and parse
                                var xStr = dimensions[0].replace(/^\s+|\s+$/g, '');
                                var yStr = dimensions[1].replace(/^\s+|\s+$/g, '');

                                xRes = parseInt(xStr, 10);
                                yRes = parseInt(yStr, 10);

                                // Check if parsing was successful
                                if (!isNaN(xRes) && !isNaN(yRes)) {
                                    // $.writeln("Parsed Resolution: x=" + xRes + ", y=" + yRes); // Debugging
                                    return { x: xRes, y: yRes };
                                } else {
                                    $.writeln("Error: Failed to parse dimensions from '" + videoInfo + "'");
                                    return null; // Parsing failed
                                }
                            } else {
                                $.writeln("Error: Could not split videoInfo '" + videoInfo + "' into two parts using 'x'.");
                                return null; // Splitting failed
                            }
                        }
                    }
                }
                $.writeln("VideoInfo tag not found in metadata.");
                return null; // Tag not found
            } else {
                $.writeln("Error: Could not retrieve project metadata for item: " + projectItem.name);
                return null; // Metadata retrieval failed
            }
        } catch (e) {
            var err = /** @type {Error} */ (e);
            $.writeln("Error processing projectItem metadata: " + err.toString());
            return null;
        }
    };


    /**
     * Returns an array of clip/track objects that have video clips intersecting the current playhead position.
     * @returns {TrackItem[]} An array of TrackItems (clips) that are under the playhead position in the active sequence.
     */
    pub.GetAllVideoClipsUnderPlayhead_AsObjectArray = function () {
        var seq = app.project.activeSequence;
        var currentTime = Number(seq.getPlayerPosition().ticks);

        // Array to store the track objects
        var clipsArray = [];

        for (var i = 0; i < seq.videoTracks.numTracks; i++) {
            var track = seq.videoTracks[i];
            for (var j = 0; j < track.clips.numItems; j++) {
                var clip = null;
                clip = track.clips[j];
                var clipStart = Number(clip.start.ticks);
                var clipEnd = Number(clip.end.ticks);

                if (currentTime >= clipStart && currentTime < clipEnd) {
                    clipsArray.push(clip);
                }
            }
        }
        return clipsArray;
    };

    /**
     * Retrieves the current playhead position, relative to the timeline, as a tick value.
     * @returns {Number} The current playhead position in ticks.
     */
    pub.GetPlayheadPosition_WithinTimeline_AsTicks = function () {
        // var seq = app.project.activeSequence;
        return Number(app.project.activeSequence.getPlayerPosition().ticks);
    };

    /**
     * Provide a ProjectItem that is a Sequence and get the corresponding Sequence object if able.
     * @param {ProjectItem} projectItem
     * @return {Sequence|null} Returns the sequence corresponding to the provided project item, or null
     */
    pub.getSequenceFromProjectItem = function (projectItem) {
        var projItemNodeID = projectItem.nodeId;
        
        var allSequences = app.project.sequences;
        for (var i = 0; i < allSequences.numSequences; i++) {
            if (allSequences[i].projectItem.nodeId === projItemNodeID) {
                return allSequences[i];
            }
        }
        return null;
    };

    /**
     * Finds which sequence in the project a given clip (TrackItem) belongs to. In other words which sequence timeline contains the given clip, aka that clip's parent.
     *
     * Clips are matched by nodeId, which is unique per clip within a project - duplicating a sequence gives the
     * copied clips their own new nodeIds (verified by testing). Names are never compared, since multiple clips
     * and project items can share the same name.
     * @param {TrackItem} clip The clip to find the parent sequence of.
     * @param {Sequence|null|undefined=} likelySequence Optional: A sequence to check before any others, as an optimization. The active sequence is always checked early regardless.
     * @returns {Sequence|null} The sequence containing the clip, or null if the clip wasn't found in any sequence.
     */
    pub.getSequenceFromClip = function (clip, likelySequence) {
        if (clip instanceof TrackItem === false) {
            return null;
        }

        var targetNodeId = clip.nodeId;
        if (targetNodeId === null || targetNodeId === undefined) {
            return null; // Without a nodeId there's nothing dependable to match on
        }

        var targetMediaType = clip.mediaType;
        var targetTrackIndex = clip.parentTrackIndex;

        // A clip reports the track index it sits on, which lets the first pass check just that one track per
        // sequence instead of all of them. A second, exhaustive pass covers the case where that doesn't hold.
        var hasValidTrackIndex = (typeof targetTrackIndex === 'number' && targetTrackIndex >= 0);

        /**
         * @param {Track} track
         * @returns {boolean}
         */
        function trackContainsTargetClip(track) {
            for (var i = 0; i < track.clips.numItems; i++) {
                if (track.clips[i].nodeId === targetNodeId) { return true; }
            }
            // Transitions live in a separate collection from clips on the track, so check those too in case a transition was passed in
            try {
                for (var j = 0; j < track.transitions.numItems; j++) {
                    if (track.transitions[j].nodeId === targetNodeId) { return true; }
                }
            } catch (e) { }
            return false;
        }

        /**
         * @param {Sequence} sequence
         * @param {boolean} exhaustive False: only check the track collection and index the clip reports. True: check every track of both media types.
         * @returns {boolean}
         */
        function sequenceContainsTargetClip(sequence, exhaustive) {
            if (sequence instanceof Sequence === false) { return false; }

            // Normally only the track collection matching the clip's media type can contain it
            var trackCollections = [];
            if (exhaustive === false && targetMediaType === 'Audio') {
                trackCollections.push(sequence.audioTracks);
            } else if (exhaustive === false && targetMediaType === 'Video') {
                trackCollections.push(sequence.videoTracks);
            } else {
                trackCollections.push(sequence.videoTracks);
                trackCollections.push(sequence.audioTracks);
            }

            for (var c = 0; c < trackCollections.length; c++) {
                var tracks = trackCollections[c];
                if (exhaustive === false && hasValidTrackIndex === true) {
                    if (targetTrackIndex < tracks.numTracks && trackContainsTargetClip(tracks[targetTrackIndex]) === true) {
                        return true;
                    }
                } else {
                    for (var t = 0; t < tracks.numTracks; t++) {
                        if (trackContainsTargetClip(tracks[t]) === true) { return true; }
                    }
                }
            }
            return false;
        }

        // Used to avoid scanning the same sequence twice. A sequence's project item nodeId is unique within the project.
        /**
         * @param {Sequence} sequence 
         * @returns {string}
         */
        function getSequenceId(sequence) {
            try {
                return sequence.projectItem.nodeId;
            } catch (e) {
                return null;
            }
        }

        // Check the most likely candidates first, then fall back to every sequence in the project
        var sequencesToCheck = [];
        if (likelySequence instanceof Sequence === true) {
            sequencesToCheck.push(likelySequence);
        }
        var activeSequence = app.project.activeSequence;
        if (activeSequence instanceof Sequence === true) {
            sequencesToCheck.push(activeSequence);
        }
        var allSequences = app.project.sequences;
        for (var s = 0; s < allSequences.numSequences; s++) {
            sequencesToCheck.push(allSequences[s]);
        }

        // Skip any sequence already scanned earlier in the list. A null id means it couldn't be identified, so scan it to be safe.
        /**@type {string[]} */
        var checkedSequenceIds = [];

        /**
         * @param {Sequence} sequence 
         * @returns {Boolean}
         */
        function isDuplicateSequence(sequence) {
            var sequenceId = getSequenceId(sequence);
            if (sequenceId === null) { return false; }
            for (var k = 0; k < checkedSequenceIds.length; k++) {
                if (checkedSequenceIds[k] === sequenceId) { return true; }
            }
            checkedSequenceIds.push(sequenceId);
            return false;
        }

        // First pass uses the track index shortcut. Only if that finds nothing does the second pass check every
        // track of every sequence, so a wrong or unusable parentTrackIndex can't make the lookup fail.
        var uniqueSequences = [];
        for (var q = 0; q < sequencesToCheck.length; q++) {
            if (isDuplicateSequence(sequencesToCheck[q]) === true) { continue; }
            uniqueSequences.push(sequencesToCheck[q]);

            if (sequenceContainsTargetClip(sequencesToCheck[q], false) === true) {
                return sequencesToCheck[q];
            }
        }
        for (var r = 0; r < uniqueSequences.length; r++) {
            if (sequenceContainsTargetClip(uniqueSequences[r], true) === true) {
                return uniqueSequences[r];
            }
        }

        return null;
    };

    /**
     * Unlocks all of the tracks in a given sequence.
     * @param {Sequence|null|undefined} sequence The sequence to unlock the tracks on. If none provided, uses active sequence
     * @param {boolean=} lockAudioTracks Default: True - Whether to unlock all the audio tracks
     * @param {boolean=} lockVideoTracks Default: True - Whether to unlock all the video tracks
     */
    pub.unlockAllTracksInSequence = function (sequence, lockAudioTracks, lockVideoTracks) {
        ThioUtils.lockAllTracksInSequence(sequence, lockAudioTracks, lockVideoTracks, true);
    }

    /**
     * Locks all of the tracks in a given sequence.
     * @param {Sequence|null|undefined} sequence The sequence to lock the tracks on. If none provided, uses active sequence
     * @param {boolean=} lockAudioTracks Default: True - Whether to lock all the audio tracks
     * @param {boolean=} lockVideoTracks Default: True - Whether to lock all the video tracks
     * @param {boolean=} unlock Optional: Whether to unlock them instead. Default = False
     */
    pub.lockAllTracksInSequence = function(sequence, lockAudioTracks, lockVideoTracks, unlock) {
        var sequenceToUse = ThioUtils.checkOrGetActiveSequence(sequence)

        if (typeof sequenceToUse === 'undefined' || sequenceToUse === undefined || sequenceToUse === null) {
            alert("Error: No sequence provided and no active sequence found. Cannot lock tracks.");
            return
        }

        if (typeof lockAudioTracks === 'undefined' || lockAudioTracks === undefined || lockAudioTracks === null) {
            lockAudioTracks = true
        }

        if (typeof lockVideoTracks === 'undefined' || lockVideoTracks === undefined || lockVideoTracks === null) {
            lockVideoTracks = true
        }

        if (typeof unlock === 'undefined' || unlock === undefined || unlock === null) {
            unlock = false
        }

        var lockOrUnlock = 1 // Default 1=Locked
        if (unlock === true) {
            lockOrUnlock = 0
        }


        if (lockAudioTracks) {
            var audioTracksArray = ThioUtils.convertToArray(sequenceToUse.audioTracks)
            for (var i = 0; i < audioTracksArray.length; i++) {
                var track = audioTracksArray[i];
                track.setLocked(lockOrUnlock);
            }
        }

        if (lockVideoTracks) {
            var videoTracksArray = ThioUtils.convertToArray(sequenceToUse.videoTracks)
            for (var j = 0; j < videoTracksArray.length; j++) {
                var track = videoTracksArray[j];
                track.setLocked(lockOrUnlock);
            }
        }
    };

    /**
     * Makes a new sequence by copying a previous one.
     * @param {string} templateProjectItemPath The path to the sequence to copy
     * @param {string} newSequenceName The name of the new duplicate sequence
     * @param {ProjectItem|string=} destinationBin Optional: A bin object, or path thereto, in which to put the new copied sequence. Defaults to staying in root path
     * @returns {Sequence|null} Returns the new copy sequence if success, or null otherwise.
     */
    pub.makeSequenceCopy = function(templateProjectItemPath, newSequenceName, destinationBin) {
        var matchedItems = ThioUtils.getItemByPath(templateProjectItemPath)

        if (typeof matchedItems === 'undefined' || matchedItems === undefined || matchedItems === null || matchedItems.length === 0) {
            alert("No project item found at path: " + templateProjectItemPath); return null;
        }

        // Clone the template sequence to be used as the main sequence
        var templateSequenceProjItem = matchedItems[0]
        var templateSequence = ThioUtils.getSequenceFromProjectItem(templateSequenceProjItem)
        if (templateSequence === null) { alert("templateSequence is null"); return null; }
        templateSequence.clone()

        // Rename the new sequence and move into the desired bin
        var templateSequenceName = templateSequence.name
        var newSequenceProjItem = ThioUtils.getItemInBinByName(app.project.rootItem, templateSequenceName + " Copy")[0] // It will be in the root when duplicated and + "Copy" added by default
        newSequenceProjItem.name = newSequenceName

        // Get the destination bin
        var destinationBinFinal = app.project.rootItem; // Default

        if (typeof destinationBin !== 'undefined' && destinationBin != null && destinationBin != undefined) {
            // Supplied directly
            if (destinationBin instanceof ProjectItem) {
                if (destinationBin.type === ProjectItemType.BIN) {
                    destinationBinFinal = destinationBin
                } else {
                    alert("makeSequenceCopy: Supplied destinationBin is not a bin. Sequence will go into root directory.")
                }
                // Supplied as string path
            } else if (typeof destinationBin === 'string' && destinationBin !== '') {
                // Get the bin from the path
                var matchedBins = ThioUtils.getItemByPath(destinationBin)

                if (typeof matchedBins === 'undefined' || matchedBins === undefined || matchedBins === null || matchedBins.length === 0) {
                    alert("makeSequenceCopy: No bin found at path: " + destinationBin + ". Sequence will go into root directory.")
                } else {
                    var matchedBin = matchedBins[0]
                    if (matchedBin.type === ProjectItemType.BIN) {
                        destinationBinFinal = matchedBin
                    } else {
                        alert("makeSequenceCopy: Supplied destinationBin path does not point to a bin. Sequence will go into root directory.")
                    }
                }
            }
        }

        var newSequence = ThioUtils.getSequenceFromProjectItem(newSequenceProjItem)
        if (newSequence === null) { alert("newSequence is null"); return null; }

        newSequence.projectItem.moveBin(destinationBinFinal);

        return newSequence;
    }

    /**
     * Returns the latest end time considering all clips on the specified tracks in the sequence.
     * @param {Sequence=} sequence 
     * @param {Number[]=} trackIndexesToCheck Which track indexes to check for the latest clip end time. If not provided, all tracks will be considered.
     * @returns {Time} The latest end time of the clips on the specified tracks. If no clips are found, still returns a time of 0.
     */
    pub.getLatestClipEndTimeInSequence =function(sequence, trackIndexesToCheck) {
        var sequence = ThioUtils.checkOrGetActiveSequence(sequence)

        // All tracks if none provided
        if (typeof trackIndexesToCheck === 'undefined' || trackIndexesToCheck === undefined || trackIndexesToCheck === null || /**@type {any}*/ (trackIndexesToCheck) === 'null') {
            trackIndexesToCheck = []
            for (var i = 0; i < sequence.videoTracks.numTracks; i++) {
                trackIndexesToCheck.push(i);
            }
        }

        var latestEndTime = new Time();

        for (var i = 0; i < trackIndexesToCheck.length; i++) {
            var trackIndex = trackIndexesToCheck[i];
            var track = sequence.videoTracks[trackIndex];
            for (var j = 0; j < track.clips.numItems; j++) {
                var clip = track.clips[j];
                if (clip.end.seconds > latestEndTime.seconds) {
                    latestEndTime = clip.end;
                }
            }
        }

        return latestEndTime;
    }
    
    /**
     * Sets the targeted tracks in a sequence based on the currently selected clips. 
     * @param {MediaType|"video"|"audio"|"any"} mediaType Can be "Audio", "Video", or "Any", to set targeted tracks for that media type. If "Any" is provided, it will set targeted tracks for both audio and video.
     * @param {Sequence|null|undefined=} sequence 
     * @returns {void}
     */
    pub.setTargetedTracksFromSelectedClips = function (mediaType, sequence) {
        var sequenceToUse = ThioUtils.checkOrGetActiveSequence(sequence)
        if (typeof sequenceToUse === 'undefined' || sequenceToUse === undefined || sequenceToUse === null) {
            alert("ThioUtils.setTargetedTracksFromSelectedClips error - No active sequence, cannot continue.")
            return null
        }

        var videoTrackIndexes;
        var audioTrackIndexes;

        if (mediaType.toLowerCase() === "video" || mediaType.toLowerCase() === "any") {
            videoTrackIndexes = ThioUtils.getTrackIndexesWithSelectedClips("Video", sequenceToUse)
        } 
        if (mediaType.toLowerCase() === "audio" || mediaType.toLowerCase() === "any") {
            audioTrackIndexes = ThioUtils.getTrackIndexesWithSelectedClips("Audio", sequenceToUse)
        } 

        // Set all tracks to not targeted first
        var vTracks = sequenceToUse.videoTracks
        var aTracks = sequenceToUse.audioTracks

        if (typeof videoTrackIndexes !== 'undefined' && videoTrackIndexes != null && videoTrackIndexes != undefined) {
            // Process Video Tracks
            for (var i = 0; i < vTracks.numTracks; i++) {
                var track = vTracks[i];

                // If i is in the index list, set it targeted, otherwise false
                var hasSelected = (videoTrackIndexes.indexOf(i) !== -1);

                // The second parameter handles auto-selection behavior; true ensures it mirrors the UI correctly
                track.setTargeted(hasSelected, true);
            }
        }

        if (typeof audioTrackIndexes !== 'undefined' && audioTrackIndexes != null && audioTrackIndexes != undefined) {
            // Process Audio Tracks
            for (var i = 0; i < aTracks.numTracks; i++) {
                var track = aTracks[i];

                // If i is in the index list, set it targeted, otherwise false
                var hasSelected = (audioTrackIndexes.indexOf(i) !== -1);

                track.setTargeted(hasSelected, true);
            }
        }
    };

    /**
     * Gets the indexes of tracks that have selected clips in a given sequence.
     * @param {MediaType|"video"|"audio"} mediaType Must be either "video" or "audio". For which track types to look at.
     * @param {Sequence|null|undefined=} sequence If not provided, uses the active sequence
     * @returns {Number[]|null} 
     */
    pub.getTrackIndexesWithSelectedClips = function (mediaType, sequence) {
        var sequenceToUse = ThioUtils.checkOrGetActiveSequence(sequence)
        if (typeof sequenceToUse === 'undefined' || sequenceToUse === undefined || sequenceToUse === null) {
            alert("ThioUtils.getTrackIndexesWithSelectedClips error - No active sequence, cannot continue.")
            return null
        }

        var tracks;
        var trackIndexesWithSelectedClips = [];

        if (mediaType.toLowerCase() === "video") {
            tracks = sequenceToUse.videoTracks;
        } else if (mediaType.toLowerCase() === "audio") {
            tracks = sequenceToUse.audioTracks;
        } else {
            alert("ThioUtils.getTrackIndexesWithSelectedClips Error - Invalid mediaType parameter provided. Must be either 'Video' or 'Audio'.");
            throw new Error("ThioUtils.getTrackIndexesWithSelectedClips Error - Invalid mediaType parameter provided. Must be either 'Video' or 'Audio'.");
        }

        // Process all the tracks
        for (var i = 0; i < tracks.numTracks; i++) {
            var track = tracks[i];
            var clips = track.clips;

            for (var j = 0; j < clips.numItems; j++) {
                if (clips[j].isSelected()) {
                    trackIndexesWithSelectedClips.push(i);
                    break;
                }
            }
        }

        return trackIndexesWithSelectedClips
    };

    /**
     * Retrieves an array of currently selected video clips from the active sequence.
     * Filters out any non-video items and alerts if no video clips are selected.
     * @returns {TrackItem[]} An array of selected video clips in the active sequence.
     */
    pub.GetSelectedVideoClips = function () {
        var selectedClipsRaw = app.project.activeSequence.getSelection();
        var selectedClips = [];

        // Filter out clips that are not of the correct type
        for (var i = 0; i < selectedClipsRaw.length; i++) {
            if (selectedClipsRaw[i].mediaType === "Video") {
                selectedClips.push(selectedClipsRaw[i]);
            }
        }
        if (selectedClips.length === 0) {
            alert("No video clips selected in the active sequence.");
            return [];
        }

        return selectedClips;
    };

    /**
     * Gets all the sequences in the current project as an array of QESequence objects
     * @param {boolean=} flushCache Default: False. May be necessary if you create new bins and sequences, but invalidates previous QESequence references.
     * @returns {QESequence[]}
     */
    pub.getAllQESequencesInProject = function (flushCache) {
        if (typeof flushCache === 'undefined' || flushCache === undefined || flushCache === null) {
            flushCache = false;
        }

        // Get the items in the bin, and if any of them are also bins, recursively get the rest
        /**
         * @param {Number} numBins 
         * @returns {QEProjectItemContainer[]}
         */
        function getBins(numBins) {
            /** @type {QEProjectItemContainer[]} */ var binArray = [];

            for (var i = 0; i < numBins; i++) {
                var currBin = (/** @type {QEApplication} */ (qe)).project.getBinAt(i);
                binArray.push(currBin);

                // Recursively get bins within this bin
                var nestedBins = getBinsInBin(currBin);
                binArray = binArray.concat(nestedBins);
            }
            return binArray;
        }

        /**
         * @param {QEProjectItemContainer} binObj 
         * @returns {QEProjectItemContainer[]} Array of bins found within the given bin
         */
        function getBinsInBin(binObj) {
            /** @type {QEProjectItemContainer[]} */ var binArray = [];
            binObj.flushCache();
            var numBins = binObj.numBins;

            for (var i = 0; i < numBins; i++) {
                var nestedBin = binObj.getBinAt(i);
                binArray.push(nestedBin);

                // Recursively get bins within this nested bin
                var deeperBins = getBinsInBin(nestedBin);
                binArray = binArray.concat(deeperBins);
            }

            return binArray;
        }

        /**
         * @param {QEProjectItemContainer} binObj
         * @returns {QESequence[]}
         */
        function getSequencesInBin(binObj) {
            var seqArray = [];
            var numSeq = binObj.numSequences;

            //TODO: Verify getSequenceAt takes the sequence index and not overall bin item index
            for (var i = 0; i < numSeq; i++) {
                try {
                    var seq = binObj.getSequenceAt(i);
                    seqArray.push(seq);
                } catch (ex) {
                    // $.writeln("Error getting sequence #" + i)
                }
            }
            return seqArray;
        }

        // -------------------------------------------------

        if (flushCache === true) {
            qe.project.flushCache(); // Needed to update current number of bins and such
        }

        var numSeq = qe.project.numSequences;
        var numBins = qe.project.numBins;

        // First try and get all the sequences using getSequenceAt in the root
        var QESequenceArray = [];
        for (var i = 0; i < numSeq; i++) {
            try {
                var seq = qe.project.getSequenceAt(i);
                QESequenceArray.push(seq);
            } catch(ex) {
                // $.writeln("Error getting sequence #" + i)
            }
        }
        
        // That won't find any sequences within bins because of a bug in QE API, so need to go through bins too
        var binArray = [];
        binArray = getBins(numBins)

        for (var i = 0; i < binArray.length; i++) {
            var currBin = binArray[i];
            var seqsInBin = getSequencesInBin(currBin);
            QESequenceArray = QESequenceArray.concat(seqsInBin);
        }

        return QESequenceArray;
    };

    /**
     * Gets an array of selected sequences from the Project panel view
     * @returns {Sequence[]}
     */
    pub.getSelectedSequencesArray = function () {
        var selectedProjectItems = app.getCurrentProjectViewSelection();
        var allSequences = app.project.sequences;
        var selectedSequenceProjItemArray = [];
        var selectedSequenceArray = [];

        // If not found return empty array
        if (typeof selectedProjectItems === 'undefined' || selectedProjectItems === undefined || selectedProjectItems === null) {
            return []
        }

        for (var i = 0; i < selectedProjectItems.length; i++) {
            var item = selectedProjectItems[i];
            if (item.isSequence() === true) {
                selectedSequenceProjItemArray.push(item);
            }
        }

        // Now we can use allSequences to match up the ones in selectedSequenceProjItemArray
        for (var i = 0; i < allSequences.length; i++) {
            var currSeq = allSequences[i];
            for (var j = 0; j < selectedSequenceProjItemArray.length; j++) {
                var selItem = selectedSequenceProjItemArray[j];
                if (selItem.nodeId === currSeq.projectItem.nodeId) {
                    selectedSequenceArray.push(currSeq);
                }
            }
        }
        return selectedSequenceArray;
    };

    /**
     * Gets the corresponding QESequence object for a given regular Sequence object
     * @param {Sequence} vanillaSequence
     * @param {Boolean=} flushCache Default: False. May be necessary if you create new bins and sequences, but invalidates previous QESequence references.
     * @returns {QESequence|null}
     */
    pub.getQESequenceFromVanilla = function(vanillaSequence, flushCache) {
        var allQESequences = ThioUtils.getAllQESequencesInProject(flushCache);
        for (var i = 0; i < allQESequences.length; i++) {
            var qeSequence = allQESequences[i];
            if (qeSequence.guid === vanillaSequence.sequenceID) {
                return qeSequence;
            }
        }
        return null; // Return null if no match is found
    };

    /**
     * Gets the corresponding regular Sequence object for a given QESequence object
     * @param {QESequence} qeSequence
     * @returns {Sequence|null}
     */
    pub.getVanillaSequenceFromQE = function(qeSequence) {
        var seqGuid = qeSequence.guid;
        var allSequences = app.project.sequences;

        for (var i = 0; i < allSequences.length; i++) {
            var sequence = allSequences[i];
            if (sequence.sequenceID === seqGuid) {
                return sequence;
            }
        }

        // If none found return null
        return null;
    };

    /** 
     * Gets the selected sequences in the project panel as QESequence objects
     * @returns {QESequence[]}
    */
    pub.getSelectedSequencesQE = function() {
        var selectedSequences = ThioUtils.getSelectedSequencesArray();

        // Find the selected sequences as QESequence objects by comparing the vanilla sequence "sequenceID" property and QE "guid" property
        var selectedQESequences = [];

        for (var i = 0; i < selectedSequences.length; i++) {
            var sequence = selectedSequences[i];
            var qeSeq = ThioUtils.getQESequenceFromVanilla(sequence);
            if (qeSeq) {
                selectedQESequences.push(qeSeq);
            }
        }

        return selectedQESequences;
    };

    /**
     * Gets all the clips for a given sequence. Optionally select whether to get audio/video clips.
     * @param {boolean=} getVideoClips Whether to include video clips in the return. Defaults to true if not provided.
     * @param {boolean=} getAudioClips Whether to include audio clips in the return. Defaults to true if not provided.
     * @param {Sequence=} sequenceToGet The sequence to get clips from. If not provided, will use the active sequence.
     * @returns {TrackItem[]}
     */
    pub.getAllClipsInSequence = function (getVideoClips, getAudioClips, sequenceToGet) {
        // Get the active sequence if none is provided
        if (!(sequenceToGet instanceof Sequence)) {
            sequenceToGet = app.project.activeSequence;
        }
        // If the audio/video parameters aren't provided, assume true
        if (typeof getVideoClips === 'undefined' || getVideoClips === undefined || getVideoClips === null) {
            getVideoClips = true;
        }
        if (typeof getAudioClips === 'undefined' || getAudioClips === undefined || getAudioClips === null) {
            getAudioClips = true;
        }
        // ---------------------

        var allClipsArray = []; /** @type {TrackItem[]} */

        // Get video clips
        if (getVideoClips) {
            for (var v = 0; v < sequenceToGet.videoTracks.numTracks; v++) {
                var videoTrack = sequenceToGet.videoTracks[v];
                for (var j = 0; j < videoTrack.clips.numItems; j++) {
                    allClipsArray.push(videoTrack.clips[j]);
                }
            }
        }

        // Get audio clips
        if (getAudioClips) {
            for (var a = 0; a < sequenceToGet.audioTracks.numTracks; a++) {
                var audioTrack = sequenceToGet.audioTracks[a];
                for (var k = 0; k < audioTrack.clips.numItems; k++) {
                    allClipsArray.push(audioTrack.clips[k]);
                }
            }
        }

        return allClipsArray;
    }

    /**
     * Retrieves a specific effect component from a clip object by its display name. Components are the highest level expandable thing.
     * @param {TrackItem} clipObj The clip object to search within.
     * @param {string} componentName The display name of the component (effect) to find.
     * @returns {Component|null} The component object if found, otherwise null.
     */
    pub.GetEffectComponent = function (clipObj, componentName) {
        // Find specified component
        var component = null;
        for (var i = 0; i < clipObj.components.numItems; i++) {
            if (clipObj.components[i].displayName.toLowerCase() === componentName.toLowerCase()) {
                component = clipObj.components[i];
                break;
            }
        }
        return component;
    };

    /**
     * Returns a component collection on a track item or project item, even if it's empty.
     * @param {TrackItem|ProjectItem} item The clip or project item to retrieve the component collection from.
     * @returns {ComponentCollection|null} The returned component collection, or null if something went wrong or returned undefined. If it simply has no effects, it will return an empty collection.
     */
    pub.getEffectComponentCollection = function(item) {
        if (typeof item === 'undefined' || item === undefined || item === null) {
            return null
        }

        // Project items have to use the videoComponents method
        if (item instanceof ProjectItem) {
            var componentCollection = item.videoComponents()
            if (typeof componentCollection === 'undefined' || componentCollection === undefined || componentCollection === null) {
                return null
            } else {
                return componentCollection
            }
        } else {
            if (typeof item.components === 'undefined' || item.components === undefined || item.components === null) {
                return null
            } else {
                return item.components
            }            
        }
    }

    /**
     * Retrieves all the components of a given clip
     * @param {TrackItem|ProjectItem} clipObj The clip object to retrieve components from.
     * @param {string=} effectName Optional: The name of a specific effect to filter by.
     * @param {boolean=} filterExact Optional: If true, will only match effects that fully match the effectName variable (not case sensitive), otherwise will match any that contain the string.
     * @returns {Component[]} An array of Component objects representing all components of the clip.
     */
    pub.GetEffectComponentArray = function(clipObj, effectName, filterExact) {
        // Handle parameters
        var filterBy = "";
        if (typeof effectName !== 'undefined' && effectName != null && effectName != undefined && effectName != "") {
            filterBy = effectName.toLowerCase();
        }
        if (typeof filterExact === 'undefined' || filterExact === undefined || filterExact === null) {
            filterExact = false;
        }

        // To store the components as the return value
        /** @type {Component[]} */
        var componentArray = []

        /** @type {ComponentCollection|null} */
        var componentCollection = ThioUtils.getEffectComponentCollection(clipObj)
        if (componentCollection === null) {
            return componentArray
        }

        // Now we can proceed the same because it's a component collection for both cases
        for (var i = 0; i < componentCollection.numItems; i++) {
            var currComponent = componentCollection[i];

            // Apply a filter if there is one
            if (filterBy !== "") {
                if (filterExact === true && currComponent.displayName.toLowerCase() === filterBy.toLowerCase()) {
                    componentArray.push(currComponent);
                } else if (filterExact === false && ThioUtils.containsStr(currComponent.displayName, filterBy, false)) {
                    componentArray.push(currComponent);
                }
            // No filter, get them all
            } else {
                componentArray.push(currComponent);
            }
        }

        return componentArray;
    };

    // Get a specific property from a component, or all of them. Returns an array of property objects
    /**
     * Retrieves an array of property objects from a specific effect component.
     * @param {Component} component The effect component to retrieve properties from.
     * @param {string=} propertyName The display name of the property to retrieve (optional).
     * @returns {ComponentParam[]} An single-item array with the property matching the specified name, or all properties if no name is specified.
     */
    pub.GetEffectComponentPropertyArray = function (component, propertyName) {
        var propertyArray = [];
        var getAll = false;

        if (propertyName != null && propertyName != "" && propertyName != undefined) {
            propertyName = propertyName.toLowerCase();
        } else {
            getAll = true;
        }

        for (var j = 0; j < component.properties.numItems; j++) {
            var property = component.properties[j];
            if (!getAll && property.displayName.toLowerCase() === propertyName) {
                return [property];
            } else if (getAll) {
                propertyArray.push(property);
            }
        }
        return propertyArray;
    };

    /**
     * Get a single property of the specified component
     * @param {Component} component 
     * @param {string} propertyName 
     * @return {ComponentParam|null} The property object if found, otherwise null.
     */
    pub.GetEffectComponentProperty = function (component, propertyName) {
        for (var j = 0; j < component.properties.numItems; j++) {
            var property = component.properties[j];
            if (property.displayName.toLowerCase() === propertyName.toLowerCase()) {
                return property;
            }
        }
        return null;
    };

    /**
     * Input an effect name (such as 'Motion') and a property name within that effect (such as 'Scale') to get that property (Scale)
     * @param {TrackItem} clipObj 
     * @param {String} effectName 
     * @param {String} effectPropertyName
     * @return {ComponentParam|null} The property object if found, otherwise null.
     */
    pub.GetEffectComponentAndProperty = function (clipObj, effectName, effectPropertyName) {
        // Get the component (effect) by name
        var component = ThioUtils.GetEffectComponent(clipObj, effectName);
        if (!component) {
            alert("Effect '" + effectName + "' not found on the selected clip.");
            return null;
        }

        // Get the property from the component
        var properties = ThioUtils.GetEffectComponentPropertyArray(component, effectPropertyName);
        if (properties.length === 0) {
            alert("Property '" + effectPropertyName + "' not found in effect '" + effectName + "'.");
            return null;
        }

        return properties[0]; // Return the first matching property
    };

    /**
     * Checks if the clip has an effect component with a specific instance name. Like "Shape 01" from "Shape (Shape 01)". Not case sensitive.
     * @param {TrackItem} clipObj 
     * @param {string} instanceName 
     * @return {Component|null}
     */
    pub.checkHasEffectComponentInstance = function(clipObj, instanceName) {
        var components = ThioUtils.GetEffectComponentArray(clipObj)

        // Find component where their matchName property matches the input
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            if (component.instanceName.toLowerCase() === instanceName.toLowerCase()) {
                return component;
            }
        }

        return null;
    };

    /**
     * Updates a text property for a MoGRT. Must have been created in after effects.
     * @param {TrackItem} mogrtToEdit The trackitem / clip of the mogrt to edit the text of
     * @param {string|null} newText The new text to set. If null, just returns without updating
     * @param {string=} textPropertyName The name of the text property to edit (default: "Text")
     * @param {boolean=} silent If true, will not show any alerts on error (default: false)
     * @return {{ComponentObj: ComponentParam, text: string}|null|undefined} Returns an object with the updated Component property and the new text value, or null if there was an error.
     */
    pub.getOrUpdateMogrtText = function(mogrtToEdit, newText, textPropertyName, silent) {
        if (typeof silent === 'undefined' || silent === undefined || silent === null) {
            silent = false;
        }

        // Default to 'Text'
        if (typeof textPropertyName === 'undefined' || textPropertyName === undefined || textPropertyName === null || textPropertyName === '') {
            textPropertyName = "Text";
        }

        // Check if it's a MoGRT. Will need to do further checks because this will return true for non-AE mogrts too
        if (mogrtToEdit.isMGT() === false) {
            if (!silent) {alert("Error: Clip is not a MoGRT");}
            return;
        }

        // This will only return the component if it was made in After Effects like we need
        var component = mogrtToEdit.getMGTComponent();
        if (component === null) {
            if (!silent) {alert("Error: Could not get MoGRT component. It must be a MoGRT made in After Effects for this to work.");}
            return;
        }

        // Find the property for the text
        var textProperty = ThioUtils.GetEffectComponentProperty(component, textPropertyName)
        if (textProperty === null) {
            if (!silent) {alert("Error: Could not find text property named '" + textPropertyName + "'");}
            return;
        }

        try {
            // currentValue will be json string, need to convert to object
            var currentValueObj, currentText;
            var currentValue = textProperty.getValue(); // Might take '1' as argument for something?

            try {
                currentValueObj = privateShims.JSON.parse(currentValue);
                currentText = currentValueObj.textEditValue
            } catch (e) {
                currentValueObj = { textEditValue: currentValue };
                $.writeln("Problem parsing value, got: " + currentValue); // Debug
                if (!silent) {alert("Warning: Could not parse existing text property as JSON.");}
                return;
            }

            // Apply changes
            if (newText != null) {
                currentValueObj.textEditValue = newText;
                textProperty.setValue(privateShims.JSON.stringify(currentValueObj), 1);
            }

            return { ComponentObj: textProperty, text: currentValueObj.textEditValue }

        } catch (e) {
            var err = /** @type {Error} */ (e);
            {alert("Error: " + err.message);}
            $.writeln("Error in process: " + err.message); // Debug
        }
        return null;
    };

    /**
     * Removes motion keyframes from a clip or array of clips and sets all the motion properties to non-time-varying. Optionally set new static values to current playhead position
     * @param {TrackItem|TrackItem[]|TrackItemCollection} clips The clip to reset
     * @param {boolean} maintainMotionValuesAtPlayhead If true, the current values at the playhead will be maintained, otherwise they will be reset to their default values.
     */
    pub.removeMotionKeyframes = function(clips, maintainMotionValuesAtPlayhead) {
        // Make an array. Even if it's just one it will just be an array of one.
        var clipsArray = ThioUtils.convertToArray(clips);

        // First check all the clips to ensure there's none outside the playhead if that needs to be used
        if (maintainMotionValuesAtPlayhead && ThioUtils.checkIfPlayheadIsInClip(clipsArray) == false) {
            alert("removeMotionKeyframes Error:\nYou've set to use the playhead position for the new motion values, but the playhead position is not within at least one of the clips.");
            return;
        }

        var playheadTimelinePos = Number(app.project.activeSequence.getPlayerPosition().ticks)

        /** --------------------------Local function --------------------------
         * @param {TrackItem} clip The clip to reset 
         */
        function removeMotionKeyframesFromSingleClip(clip) {
            var components = ThioUtils.GetEffectComponentArray(clip)
            var motionComponent = null;

            // Need to get the internal position of each individual clip
            var internalPlayheadPos = null;
            if (maintainMotionValuesAtPlayhead) {
                internalPlayheadPos = ThioUtils.GetPlayheadPosition_WithinSource_AsTicks(clip, playheadTimelinePos, false);
            }

            for (var i = 0; i < components.length; i++) {
                var component = components[i];
                if (component.displayName === "Motion") {
                    motionComponent = component;

                    var motionProperties = ThioUtils.GetEffectComponentPropertyArray(component, undefined);
                    for (var j = 0; j < motionProperties.length; j++) {
                        var effectProp = motionProperties[j];
                        var currentPosValue = null;

                        // If it's already not time varying then skip
                        if (!effectProp.isTimeVarying()) {
                            continue
                        }

                        // Store the value ahead of time if we're meant to set it back as the static value after
                        if (internalPlayheadPos != null) {
                            var internalTimeObj = ThioUtils.ticksToTimeObject(internalPlayheadPos);
                            currentPosValue = effectProp.getValueAtTime(internalTimeObj);
                        }

                        effectProp.setTimeVarying(false, true);

                        // Restore the value
                        if (currentPosValue != null) {
                            effectProp.setValue(currentPosValue, true);
                        }
                    }
                }
            }
        }
        // -------------------------- End Local Function --------------------------

        for (var i = 0; i < clipsArray.length; i++) {
            var clip = clipsArray[i];
            if (clip.mediaType === "Video") {
                removeMotionKeyframesFromSingleClip(clip);
            }
        }
    };

    /**
     * Calculates the current position of the playhead, relative to within a selected clip's source media, as ticks. If no TrackItem is provided, it will use the selected clip.
     * @overload
     * @param {Boolean} useAudioTrack If true, the selected clip must be audio; otherwise, it must be video.
     * @param {Boolean=} noAlertsOnError If true, will just return null without showing an alert.
     * @returns {Number|null} The playhead position in ticks relative to the source media of the selected clip, or null if conditions are not met.
     */

    /**
     * Calculates the current position of the playhead, relative to within a selected clip's source media, as ticks. If no TrackItem is provided, it will use the selected clip.
     * @overload
     * @param {TrackItem} clip The clip to get the playhead position within.
     * @param {Number|null=} playheadTimelinePositionTicks If you want to specify the timeline playhead position instead of getting it during the function.
     * @param {Boolean=} noAlertsOnError If true, will just return null without showing an alert.
     * @returns {Number|null} The playhead position in ticks relative to the source media of the selected clip, or null if conditions are not met.
     */
    pub.GetPlayheadPosition_WithinSource_AsTicks = function (/** @type {Boolean|TrackItem} */ arg1, /** @type {Boolean|Number|null=} */ arg2, /** @type {Boolean=} */ arg3) {
        var clip;
        var useAudioTrack;
        var noAlertsOnError;
        /** @type {Number|null} */ var playheadTimelinePositionTicks = null;

        // ---------- Overload checking ------------
        if (typeof arg1 === 'object' && arg1 !== null && typeof arg1.mediaType !== 'undefined') {
            // Signature: (clip, useAudioTrack, noAlertsOnError)
            clip = arg1;
            noAlertsOnError = arg3;
            // Handle whether they provided the playhead position or not
            if (typeof arg2 === 'undefined' || arg2 === undefined || arg2 === null) {
                playheadTimelinePositionTicks = null;
            } else {
                playheadTimelinePositionTicks = /** @type {Number} */ (arg2);
            }
        } else {
            clip = null; // No clip provided, will use selection
            useAudioTrack = arg1;
            noAlertsOnError = arg2;
            playheadTimelinePositionTicks = null;
        }
        // ----------------------------------------

        if (typeof noAlertsOnError === 'undefined' || noAlertsOnError === undefined || noAlertsOnError === null) {
            noAlertsOnError = false; // Default to showing alerts
        }
        
        if (playheadTimelinePositionTicks == null) {
            playheadTimelinePositionTicks = Number(app.project.activeSequence.getPlayerPosition().ticks);
        }

        // If no clip is provided, use the currently selected clip in the timeline.
        if (clip == null) {
            var selectedClipsRaw = app.project.activeSequence.getSelection();
            var selectedClips = [];

            // Filter out clips that are not of the correct type
            for (var i = 0; i < selectedClipsRaw.length; i++) {
                if ((!useAudioTrack && selectedClipsRaw[i].mediaType === "Video") || (useAudioTrack && selectedClipsRaw[i].mediaType === "Audio")) {
                    selectedClips.push(selectedClipsRaw[i]);
                }
            }

            if (!selectedClips.length || selectedClips.length > 1) {
                if (!noAlertsOnError) { alert("GetPlayheadPosition_WithinSource_AsTicks Error: You must select exactly 1 clip in the timeline to use this function."); }
                return null;
            }

            // Ensure the playhead is within the selected clip
            var selectedClip = selectedClips[0];
        } else {
            selectedClip = clip
        }

        if (playheadTimelinePositionTicks < Number(selectedClip.start.ticks) || playheadTimelinePositionTicks > Number(selectedClip.end.ticks)) {
            if (!noAlertsOnError) { alert("GetPlayheadPosition_WithinSource_AsTicks Error: The playhead is not within the selected clip."); }
            return null;
        }

        return ThioUtils.ConvertTimelineTicksToSourceTicks(selectedClip, playheadTimelinePositionTicks);
    };

    /**
     * Move inputted clips to a new time in the sequence on the same track.
     * @remarks LIMITATION: In copy mode, if a source has multiple audio tracks and the audio streams removed from the original aren't the last ones, the copy gets the wrong streams. Copies also set the source clip’s in/out marks in the project.
     * @param {TrackItem[]} clips 
     * @param {Number|Time|string} adjustedStartTime Either a time object, seconds number, or ticks string representing either the new start time or relative shift for the clips.
     * @param {boolean} relative If true, the adjustedStartTime is treated as a relative shift from the current start time of the clips, otherwise it is treated as an absolute new start time.
     * @param {boolean=} copy Optional: If true, will keep the original clips and copy them to the new time instead of moving. Default: false
     * @param {Sequence=} sequence Optional: The sequence the clips are on. Defaults to active sequence.
     * @returns {boolean} Whether it was a success or fail
     */
    pub.moveClips = function (clips, adjustedStartTime, relative, copy, sequence) {
        var getSequence = ThioUtils.checkOrGetActiveSequence(sequence) // Defaults to active sequence if not provided.

        if (typeof getSequence === 'undefined' || getSequence === undefined || getSequence === null) {
            return false
        } else {
            sequence = getSequence
        }

        if (typeof copy === 'undefined' || copy === undefined || copy === null) {
            copy = false
        }

        var adjustedStartTimeObj = ThioUtils.makeTimeObjUniversal(adjustedStartTime);

        // Don't move anything if any clip would end up before the start of the sequence
        for (var c = 0; c < clips.length; c++) {
            var checkStartTicks = relative ? Number(clips[c].start.ticks) + Number(adjustedStartTimeObj.ticks) : Number(adjustedStartTimeObj.ticks);
            if (checkStartTicks < 0) {
                return false;
            }
        }

        // overwriteClip places both halves of a linked pair, so skip clips that were already handled through a linked clip
        /**@type {Object.<string, boolean>}*/ var handledNodeIds = {};

        for (var i = 0; i < clips.length; i++) {
            var clip = clips[i];
            if (handledNodeIds[clip.nodeId] === true) {
                continue;
            }
            handledNodeIds[clip.nodeId] = true;
            var linkedClipsToSkip = ThioUtils.convertToArray(clip.getLinkedItems());
            for (var s = 0; s < linkedClipsToSkip.length; s++) {
                handledNodeIds[linkedClipsToSkip[s].nodeId] = true;
            }
            var originalStartTickTime = TickTime.createWithTicks(clip.start.ticks)
            var originalEndTickTime = TickTime.createWithTicks(clip.end.ticks)
            var clipDurationTickTime = originalEndTickTime.subtract(originalStartTickTime)

            var clipAdjustedStartTicks = adjustedStartTimeObj.ticks;

            if (relative) {
                // Do the relative adjustment using ticks for most accurate results
                clipAdjustedStartTicks = String(Number(originalStartTickTime.ticks) + Number(adjustedStartTimeObj.ticks)); // Add the relative offset in ticks
            }

            var sequenceFPS = new FrameRate()
            sequenceFPS.ticksPerFrame = Number(sequence.timebase) // Do NOT use .createWithValue(), that's apparently if you are inputting the framerate not ticks per frame

            var newInPointTickTime = TickTime.createWithTicks(clipAdjustedStartTicks); // Create a new TickTime object with the updated inpoint ticks
            newInPointTickTime = newInPointTickTime.alignToNearestFrame(sequenceFPS); // Align to the nearest frame based on the source frame rate

            var newEndTickTime = newInPointTickTime.add(clipDurationTickTime)
            var newOutPointTickTime = newEndTickTime.alignToNearestFrame(sequenceFPS)

            // We have to convert the TickTime objects to regular Time objects
            var newTimeObjStart = new Time();
            var newTimeObjEnd = new Time();
            newTimeObjStart.ticks = newInPointTickTime.ticks;
            newTimeObjEnd.ticks = newOutPointTickTime.ticks;
            

            // Get the type of media, whether audio or video. We will then check the linked clips to get the parent track of the linked clip to know which track each goes to
            var inputtedClipMediaType = clip.mediaType; // "video" or "audio"
            var linkedClipMediaType = null
            var linkedClips = clip.getLinkedItems()
            var linkedClip = null
            
            for (var l = 0; l < linkedClips.length; l++) {
                // Find the linked clip which is not the main clip
                if (linkedClips[l].mediaType !== inputtedClipMediaType) {
                    linkedClip = linkedClips[l]
                    linkedClipMediaType = linkedClip.mediaType
                    break
                }
            }
            // Default to parentTrackIndex
            var audioClipTrackIndex = clip.parentTrackIndex
            var videoClipTrackIndex = clip.parentTrackIndex

            if (linkedClipMediaType != null && linkedClip != null) {
                if (linkedClipMediaType === "Audio") {
                    audioClipTrackIndex = linkedClip.parentTrackIndex
                } else if (linkedClipMediaType === "Video") {
                    videoClipTrackIndex = linkedClip.parentTrackIndex
                }
            }
            // Now set the main clip parent track index. It shouldn't be the same media type but in case it is we'll set it after the linked clip so it takes priority
            if (inputtedClipMediaType === "Audio") {
                audioClipTrackIndex = clip.parentTrackIndex
            } else if (inputtedClipMediaType === "Video") {
                videoClipTrackIndex = clip.parentTrackIndex
            }

            if (copy !== true) {
                // Shift the existing clip and its linked items instead of placing a new instance of the project item, so removed streams stay removed and effects are kept
                var moveOffsetTimeObj = new Time();
                moveOffsetTimeObj.ticks = String(Number(newTimeObjStart.ticks) - Number(clip.start.ticks));

                /**@type {TrackItem[]}*/ var itemsToMove = [clip];
                var linkedItemsArray = ThioUtils.convertToArray(clip.getLinkedItems());
                for (var m = 0; m < linkedItemsArray.length; m++) {
                    if (linkedItemsArray[m].nodeId !== clip.nodeId) {
                        itemsToMove.push(linkedItemsArray[m]);
                    }
                }

                // Record the starts before moving anything, so a linked clip that Premiere already moved along with another one isn't moved twice
                /**@type {string[]}*/ var startTicksBeforeMove = [];
                for (var n = 0; n < itemsToMove.length; n++) {
                    startTicksBeforeMove.push(itemsToMove[n].start.ticks);
                }
                for (var p = 0; p < itemsToMove.length; p++) {
                    if (itemsToMove[p].start.ticks === startTicksBeforeMove[p]) {
                        itemsToMove[p].move(moveOffsetTimeObj);
                    }
                }
            } else {

                // Record the tracks the original clip and its linked items are on, so anything extra that overwriteClip adds can be removed afterwards
                /**@type {Object.<string, boolean>}*/ var originalTrackKeys = {};
                originalTrackKeys[clip.mediaType + ":" + clip.parentTrackIndex] = true;
                for (var q = 0; q < linkedClips.length; q++) {
                    originalTrackKeys[linkedClips[q].mediaType + ":" + linkedClips[q].parentTrackIndex] = true;
                }

                // Before inserting/overwrite, set the inpoint/outpoint on the project item to be the same size as the clip
                clip.projectItem.setInPoint(clip.inPoint, 4) // 2nd Param: 1 = video only, 2 = audio only, 4 = all media type
                clip.projectItem.setOutPoint(clip.outPoint, 4)

                // Lock every unlocked track the original isn't on, so overwriteClip can't write extra streams over existing clips there
                /**@type {Track[]}*/ var tracksLockedForCopy = [];
                for (var vt = 0; vt < sequence.videoTracks.numTracks; vt++) {
                    if (originalTrackKeys["Video:" + vt] !== true && sequence.videoTracks[vt].isLocked() !== true) {
                        sequence.videoTracks[vt].setLocked(1);
                        tracksLockedForCopy.push(sequence.videoTracks[vt]);
                    }
                }
                for (var at = 0; at < sequence.audioTracks.numTracks; at++) {
                    if (originalTrackKeys["Audio:" + at] !== true && sequence.audioTracks[at].isLocked() !== true) {
                        sequence.audioTracks[at].setLocked(1);
                        tracksLockedForCopy.push(sequence.audioTracks[at]);
                    }
                }

                try {
                    // Adds the clip
                    sequence.overwriteClip(clip.projectItem, newTimeObjStart, videoClipTrackIndex, audioClipTrackIndex) // Add 1 because they're 1-indexed
                    // sequence.insertClip(clip.projectItem, newTimeObjStart, clip.parentTrackIndex + 1, clip.parentTrackIndex + 1)  // Test doing clipInsert instead
                } finally {
                    // Unlock only the tracks locked above, even if overwriteClip throws
                    for (var lt = 0; lt < tracksLockedForCopy.length; lt++) {
                        tracksLockedForCopy[lt].setLocked(0);
                    }
                }

                // Find the new copy on the original clip's track, then remove any of its linked items on tracks the original didn't use
                var newClipTrack = (inputtedClipMediaType === "Audio") ? sequence.audioTracks[clip.parentTrackIndex] : sequence.videoTracks[clip.parentTrackIndex];
                /**@type {TrackItem|null}*/ var newClip = null;
                for (var r = 0; r < newClipTrack.clips.numItems; r++) {
                    if (Number(newClipTrack.clips[r].start.ticks) === Number(newTimeObjStart.ticks)) {
                        newClip = newClipTrack.clips[r];
                        break;
                    }
                }
                if (newClip !== null) {
                    var newLinkedItems = ThioUtils.convertToArray(newClip.getLinkedItems());
                    for (var u = 0; u < newLinkedItems.length; u++) {
                        if (originalTrackKeys[newLinkedItems[u].mediaType + ":" + newLinkedItems[u].parentTrackIndex] !== true) {
                            newLinkedItems[u].remove(false, false);
                        }
                    }
                }
            }
        }
        return true
    }

    /**
     * Trims the start of a clip without moving the remaining part of the clip.
     * @param {TrackItem} clip 
     * @param {Number|Time} trimTime The number of seconds, or time object to trim from the start of the clip. A negative value will extend the clip earlier.
     * @param {Boolean=} alignToNearestFrame Whether to align the new inpoint to the nearest frame. Default: true
     * @param {Boolean=} useAbsoluteStartTime Whether to treat trimTime as the new absolute start time of the clip in the timeline, instead of an amount relative to the current start. Default: false
     */
    pub.trimClipStart = function (clip, trimTime, alignToNearestFrame, useAbsoluteStartTime) {
        if (typeof alignToNearestFrame === 'undefined' || alignToNearestFrame === undefined || alignToNearestFrame === null) {
            alignToNearestFrame = true;
        }
        if (typeof useAbsoluteStartTime === 'undefined' || useAbsoluteStartTime === undefined || useAbsoluteStartTime === null) {
            useAbsoluteStartTime = false;
        }

        var sequenceFrameRate = new FrameRate();
        sequenceFrameRate.ticksPerFrame = Number(app.project.activeSequence.timebase); // Set the current frame rate to the sequence timebase

        var sourceFrameRate = new FrameRate()
        sourceFrameRate.ticksPerFrame = Number(clip.projectItem.sourceTimebase) // sourceTimebase is new 

        // var sourceFPS = clip.projectItem.getFootageInterpretation().frameRate; // Get the source frame rate from the clip's project item
        // var sourceFrameRate = FrameRate.createWithValue(sourceFPS); // Create a FrameRate object with the source frame rate

        var adjustmentTimeObj = new Time();
        if (!(useAbsoluteStartTime)) {
            if (trimTime instanceof Time) {
                adjustmentTimeObj = trimTime;
            } else {
                adjustmentTimeObj.seconds = trimTime;
            }
        } else {
            // If useAbsoluteStartTime is true, we need to first calculate the difference between the desired absolute start time in the timeline and the current start time
            var currentStartTicks = Number(clip.start.ticks);
            var absoluteStartTimeObj = new Time();
            if (trimTime instanceof Time) {
                absoluteStartTimeObj = trimTime;
            } else {
                absoluteStartTimeObj.seconds = trimTime;
            }
            adjustmentTimeObj.ticks = String(Number(absoluteStartTimeObj.ticks) - currentStartTicks); // Positive trims, negative extends
        }


        var inPointTimeObj = clip.inPoint;
        inPointTimeObj.ticks = String(Number(inPointTimeObj.ticks) + Number(adjustmentTimeObj.ticks)); // Shift the inpoint back by the specified amount
        var newInPointTickTime = TickTime.createWithTicks(inPointTimeObj.ticks); // Create a new TickTime object with the updated inpoint seconds
        if (alignToNearestFrame) {
            newInPointTickTime = newInPointTickTime.alignToNearestFrame(sourceFrameRate); // Align to the nearest frame based on the source frame rate, because we're working within the clip
        }
        inPointTimeObj.ticks = newInPointTickTime.ticks; // Update the inpoint seconds to the aligned time

        clip.inPoint = inPointTimeObj; // Set the new inpoint

        var startTimeObj = clip.start;
        startTimeObj.ticks = String(Number(startTimeObj.ticks) + Number(adjustmentTimeObj.ticks)); // Shift the start time back by the specified amount
        var startTimeTickTime = TickTime.createWithTicks(startTimeObj.ticks); // Create a new TickTime object with the updated start time seconds
        if (alignToNearestFrame) {
            startTimeTickTime = startTimeTickTime.alignToNearestFrame(sequenceFrameRate); // Align to the nearest frame based on the sequence frame rate, because we're working within the sequence timeline
        }
        startTimeObj.ticks = startTimeTickTime.ticks; // Update the start time seconds to the aligned time

        clip.start = startTimeObj; // Set the new start time
    };

    /**
     * Trims the end of a clip without moving the remaining part of the clip.
     * @param {TrackItem} clip 
     * @param {Number|Time} trimTime The number of seconds, or time object to trim from the end of the clip. A negative value will extend the clip further.
     * @param {Boolean=} alignToNearestFrame Whether to align the new outpoint to the nearest frame. Default: true
     * @param {Boolean=} useAbsoluteEndTime Whether to treat trimTime as the new absolute end time of the clip in the timeline, instead of an amount relative to the current end. Default: false
     */
    pub.trimClipEnd = function (clip, trimTime, alignToNearestFrame, useAbsoluteEndTime) {
        if (typeof alignToNearestFrame === 'undefined' || alignToNearestFrame === undefined || alignToNearestFrame === null) {
            alignToNearestFrame = true;
        }
        if (typeof useAbsoluteEndTime === 'undefined' || useAbsoluteEndTime === undefined || useAbsoluteEndTime === null) {
            useAbsoluteEndTime = false;
        }

        var sequenceFrameRate = new FrameRate();
        sequenceFrameRate.ticksPerFrame = Number(app.project.activeSequence.timebase); // Set the current frame rate to the sequence timebase

        var sourceFrameRate = new FrameRate()
        sourceFrameRate.ticksPerFrame = Number(clip.projectItem.sourceTimebase) // sourceTimebase is new

        // var sourceFPS = clip.projectItem.getFootageInterpretation().frameRate; // Get the source frame rate from the clip's project item
        // var sourceFrameRate = FrameRate.createWithValue(sourceFPS); // Create a FrameRate object with the source frame rate

        var adjustmentTimeObj = new Time();
        if (!(useAbsoluteEndTime)) {
            if (trimTime instanceof Time) {
                adjustmentTimeObj = trimTime;
            } else {
                adjustmentTimeObj.seconds = trimTime;
            }
        } else {
            // If useAbsoluteEndTime is true, we need to first calculate the difference between the current end time in the timeline and the desired absolute end time
            var currentEndTicks = Number(clip.end.ticks);
            var absoluteEndTimeObj = new Time();
            if (trimTime instanceof Time) {
                absoluteEndTimeObj = trimTime;
            } else {
                absoluteEndTimeObj.seconds = trimTime;
            }
            adjustmentTimeObj.ticks = String(currentEndTicks - Number(absoluteEndTimeObj.ticks)); // Positive trims, negative extends
        }

        var outPointTimeObj = clip.outPoint;
        outPointTimeObj.ticks = String(Number(outPointTimeObj.ticks) - Number(adjustmentTimeObj.ticks)); // Shift the outpoint forward by the specified amount
        var newOutPointTickTime = TickTime.createWithTicks(outPointTimeObj.ticks); // Create a new TickTime object with the updated outpoint seconds
        if (alignToNearestFrame) {
            newOutPointTickTime = newOutPointTickTime.alignToNearestFrame(sourceFrameRate); // Align to the nearest frame based on the source frame rate, because we're working within the clip
        }
        outPointTimeObj.ticks = newOutPointTickTime.ticks; // Update the outpoint seconds to the aligned time

        clip.outPoint = outPointTimeObj; // Set the new outpoint

        var endTimeObj = clip.end;
        endTimeObj.ticks = String(Number(endTimeObj.ticks) - Number(adjustmentTimeObj.ticks)); // Shift the end time forward by the specified amount
        var endTimeTickTime = TickTime.createWithTicks(endTimeObj.ticks); // Create a new TickTime object with the updated end time seconds
        if (alignToNearestFrame) {
            endTimeTickTime = endTimeTickTime.alignToNearestFrame(sequenceFrameRate); // Align to the nearest frame based on the sequence frame rate, because we're working within the sequence timeline
        }
        endTimeObj.ticks = endTimeTickTime.ticks; // Update the end time seconds to the aligned time

        clip.end = endTimeObj; // Set the new end time
    };

    /**
     * Ripple deletes all empty items from a specified track in the active sequence. 
     * The ripple delete will shift all tracks, like a normal ripple delete.
     * @param {Number} trackIndex The index of the track to delete empty items from.
     * @param {("audio"|"video")} trackType Whether the track is audio or video.
     */
    pub.rippleDeleteEmptySpaceOnTrack = function (trackIndex, trackType) {
        var qeSequence = qe.project.getActiveSequence();

        var trackToDo;
        if (trackType === "audio") {
            trackToDo = qeSequence.getAudioTrackAt(trackIndex);
        } else if (trackType === "video") {
            trackToDo = qeSequence.getVideoTrackAt(trackIndex);
        } else {
            $.writeln("Invalid track type specified. Use 'audio' or 'video'.");
            return;
        }

        // We need to loop over getItemAt every time because it changes when we ripple delete items.
        while (true) {
            var foundEmptyItem = false;
            for (var i = trackToDo.numItems - 1; i >= 0; i--) {
                var vidItem = trackToDo.getItemAt(i);
                var isLastItem = (i === trackToDo.numItems - 1);

                // Delete the empty silence. The end apparently still shows as an empty item but won't be deleted so we won't count that one.
                if (vidItem.type === "Empty" && !isLastItem) {
                    // Ripple delete the empty item
                    vidItem.rippleDelete();
                    foundEmptyItem = true;
                }
            }
            // If we didn't find any empty items, we can stop looping
            if (!foundEmptyItem) {
                break;
            }
        }
    };

    /**
     * Sets the scale of the clip(s) to fill the frame of the sequence, with optional safety checks on whether to reset position and overwrite time varying
     * @param {TrackItem|TrackItemCollection} clip The clip to fill the frame for, or collection of clips
     * @param {Sequence=} parentSequence Optional: The sequence the clip is in. If not provided, will use active sequence
     * @param {boolean} [resetPosition=true] Optional: Whether to reset the position to center. If false and position/anchor point are not default, will be skipped. (default: true)
     * @param {boolean} [overWriteTimeVarying=false] Optional: If true, time varying clips will be made not time varying and filled. Otherwise time varying clips will be skipped. (default: false)
     * @param {boolean=} silent If true, will not show any alerts. Default: false
     */
    pub.fillFrameWithClip = function(clip, parentSequence, resetPosition, overWriteTimeVarying, silent) {
        // Process parameters
        if (parentSequence instanceof Sequence === false) {
            parentSequence = app.project.activeSequence;
        }
        if (typeof resetPosition !== 'boolean') {
            resetPosition = true;
        }
        if (typeof overWriteTimeVarying !== 'boolean') {
            overWriteTimeVarying = false;
        }
        if (typeof silent === 'undefined' || silent === undefined || silent === null) {
            silent = false;
        }

        // Get an array of the selected video clips
        var clipsArrayRaw = ThioUtils.convertToArray(clip); // This will return an array of TrackItems even if there's only one
        var clipsArray = [];
        for (var i = 0; i < clipsArrayRaw.length; i++) {
            if (clipsArrayRaw[i] instanceof TrackItem && clipsArrayRaw[i].mediaType === 'Video') {
                clipsArray.push(clipsArrayRaw[i]);
            }
        }

        if (clipsArray.length === 0) {
            if (!silent) { alert("Error: No video clips found to fill frame for."); }
            return;
        }

        var errorStringArray = [];
        var warningStringArray = [];

        // Process the clips
        for (var i = 0; i < clipsArray.length; i++) {
            var motionComponent = ThioUtils.GetEffectComponent(clipsArray[i], "Motion");

            // Skip if not found
            if (typeof motionComponent === 'undefined' || motionComponent === undefined || motionComponent === null) { continue }

            var scaleProp = motionComponent.properties.getParamForDisplayName("Scale");
            var positionProp = motionComponent.properties.getParamForDisplayName("Position");
            var anchorProp = motionComponent.properties.getParamForDisplayName("Anchor Point");

            // Skip if not found
            if (typeof scaleProp === 'undefined' || scaleProp === undefined || scaleProp === null) { continue }
            if (typeof positionProp === 'undefined' || positionProp === undefined || positionProp === null) { continue }
            if (typeof anchorProp === 'undefined' || anchorProp === undefined || anchorProp === null) { continue }

            var posValue = positionProp.getValue();
            var anchorValue = anchorProp.getValue();

            // Scale as needed to fill the frame
            var res = ThioUtils.getResolutionFromProjectItem(clipsArray[i]);
            // Get current sequence resolution
            var seq = parentSequence;
            var width = seq.frameSizeHorizontal;
            var height = seq.frameSizeVertical;

            if (res === null || res.x === -1 || res.y === -1) {
                errorStringArray.push("Could not get resolution for clip: " + clipsArray[i].name);
                continue;
            }

            var scaleX = (width / res.x) * 100;
            var scaleY = (height / res.y) * 100;

            // Maybe in the future, try to account for anchor point and position (which is relative to anchor point).
            //      posValue and anchorValue are both arrays of size 2, X and Y, and the values are fractions between 0 and 1 to represent the relative location. So [0.5, 0.5] is center for both.
            //      If both posValue and anchorValue are [0.5, 0.5] then scaleX and scaleY can be used as is.

            // If the anchor point and position are not default, and we're not resetting position, skip this clip with a warning
            if (resetPosition === false && (posValue[0] !== 0.5 || posValue[1] !== 0.5 || anchorValue[0] !== 0.5 || anchorValue[1] !== 0.5)) {
                warningStringArray.push("Skipped clip with non-default position or anchor point: " + clipsArray[i].name);
                continue;
            }
            // Also check if time varying and we're not overwriting time varying
            if (overWriteTimeVarying === false && (scaleProp.isTimeVarying() || positionProp.isTimeVarying() || anchorProp.isTimeVarying())) {
                warningStringArray.push("Skipped time varying clip: " + clipsArray[i].name);
                continue;
            }

            // At this point it's safe to set the position and anchor point to center and reset time varying
            scaleProp.setTimeVarying(false);
            positionProp.setTimeVarying(false);
            anchorProp.setTimeVarying(false);
            // Reset Position
            positionProp.setValue([0.5, 0.5], 1);
            anchorProp.setValue([0.5, 0.5], 1);

            // Sets the new scale
            var newScale = Math.max(scaleX, scaleY); // Use whichever is larger to ensure it fills the frame
            scaleProp.setValue(newScale, 1);
        }

        if (errorStringArray.length > 0) {
            if (!silent) {alert("Some errors occurred:\n\n" + errorStringArray.join("\n"));}
        }
        if (warningStringArray.length > 0) {
            if (!silent) {alert("Some warnings occurred:\n\n" + warningStringArray.join("\n"));}
        }
    };

    /**
     * Sets up a Ken-Burns-like effect by calculating and placing start and end keyframes. The current scale will be used as the ending size.
     * Importantly, you can define the 'pixel velocity' for the visual expansion speed regardless of the image/clip's resolution
     * @param {TrackItem} clip The video clip to process.
     * @param {Number} pixelVelocity The desired rate of visual expansion, as a percentage of sequence width per second.
     * @param {Boolean} useExistingKeyframes Whether to use an existing pair of start/end keyframes instead of putting them at the start and end of the clip (if there are 2 keyframes)
     * @param {Boolean=} accountForCrop Whether to account for any crop effect applied to the clip when calculating the scale (default: true)
     * @param {Boolean=} silent If true, will not show any alerts. Default: false
     * @param {Boolean=} placeAtTransitionEnds Default:False. If true, will place the keyframes at the ends of any transitions on the clip instead of the clip in/out points. Only applies if useExistingKeyframes is false or there are no existing keyframes.
     */
    pub.AutoSpeedScaleExpand = function(clip, pixelVelocity, useExistingKeyframes, accountForCrop, silent, placeAtTransitionEnds) {
        // Only work on video track items
        if (clip.mediaType != "Video") {
            return;
        }

        if (typeof silent === 'undefined' || silent === undefined || silent === null) {
            silent = false;
        }
        if (typeof accountForCrop === 'undefined' || accountForCrop === undefined || accountForCrop === null) {
            accountForCrop = true;
        }

        if (typeof placeAtTransitionEnds === 'undefined' || placeAtTransitionEnds === undefined || placeAtTransitionEnds === null) {
            placeAtTransitionEnds = false;
        }

        var sequence = app.project.activeSequence;
        var sequenceWidth = sequence.frameSizeHorizontal;

        var itemResolution = ThioUtils.getResolutionFromProjectItem(clip)
        if (itemResolution == null) {
            if (!silent) { alert("Could not determine the resolution of the clip: " + clip.name + ". Please ensure it is a valid video clip."); }
            return;
        }
        var imageWidth = itemResolution.x;

        // Check if there is a crop effect applied and account for that
        if (accountForCrop === true) {
            var cropComponent = ThioUtils.GetEffectComponent(clip, "Crop");
            if (cropComponent) {
                var leftCropProp = ThioUtils.GetEffectComponentProperty(cropComponent, "Left");
                var rightCropProp = ThioUtils.GetEffectComponentProperty(cropComponent, "Right");
                if (leftCropProp && rightCropProp) {
                    var leftCrop = leftCropProp.getValue() / 100; // Convert from percentage to decimal
                    var rightCrop = rightCropProp.getValue() / 100; // Convert from percentage to decimal
                    imageWidth = imageWidth * (1 - leftCrop - rightCrop);
                }
            }
        }

        // Get the clip's "Motion" effect properties.
        var scaleProp = ThioUtils.GetEffectComponentAndProperty(clip, "Motion", "Scale");
        if (!scaleProp) { return; }

        // DEFINE END AND START STATES
        var endScale = scaleProp.getValueAtTime(clip.outPoint);
        var clipDurationSeconds = null;

        var leftTrans, rightTrans = null
        if (placeAtTransitionEnds) {
            var transitionInfoList = ThioUtils.transitions.getTransitionsForSelectedClips([clip], false, true)
            if (transitionInfoList && transitionInfoList.length !== 0) {
                var transitionInfo = transitionInfoList[0]
                leftTrans = transitionInfo.transitions.left
                rightTrans = transitionInfo.transitions.right
            }
        }

        var leftDuration = 0
        var rightDuration = 0
        // If not set to use existing keyframes use clip duration. Also if time varying is disabled.
        if (!useExistingKeyframes || !scaleProp.isTimeVarying()) {
            if (placeAtTransitionEnds) {
                if (leftTrans != null) { leftDuration = leftTrans.duration.seconds }
                if (rightTrans != null) { rightDuration = rightTrans.duration.seconds}

                clipDurationSeconds = clip.duration.seconds - leftDuration - rightDuration;
            } else {
                clipDurationSeconds = clip.duration.seconds
            }
            useExistingKeyframes = false; // Set to false in case we got here because isTimeVarying is false
        } else {
            var keyTimes = scaleProp.getKeys();
            if (typeof keyTimes === 'undefined' || keyTimes === undefined || keyTimes === null) {
                if (!silent) { alert("AutoSpeedScaleExpand Error: Unexpected number of keys. Can't continue.") }
                return
            }

            // If too many keys
            if (keyTimes.length > 2) {
                if (!silent) { alert("AutoSpeedScaleExpand Error: useExistingKeyframes is true but the clip has more than two keyframes. Please ensure it only has 2 keyframes (for start and end) for this function to work correctly, or set useExistingKeyframes false.\n\nClip Name: " + clip.name); }
                return;
                // If not enough keys
            } else if (keyTimes.length == 1) {
                if (!silent) { alert("AutoSpeedScaleExpand Error: useExistingKeyframes is true but the clip has less than two keyframes. Please ensure it has 2 keyframes (for start and end) for this function to work correctly, or set useExistingKeyframes false.\n\nClip Name: " + clip.name); }
                return;
                // If no keyframes, just treat it as if not time varying
            } else if (keyTimes.length == 0) {
                clipDurationSeconds = clip.duration.seconds;
                useExistingKeyframes = false;
                // The correct number of keys
            } else if (keyTimes.length == 2) {
                // Shouldn't be negative but just in case. Not sure how that would affect the expansion/shrinkage though.
                clipDurationSeconds = Math.abs(keyTimes[1].seconds - keyTimes[0].seconds);
            } else {
                if (!silent) { alert("AutoSpeedScaleExpand Error: Unexpected number of keys. Can't continue.") }
                return
            }
        }

        if (!clipDurationSeconds || clipDurationSeconds <= 0) {
            return; // Can't calculate velocity on a clip with no duration
        }

        var totalPixelChange = (pixelVelocity / 100) * sequenceWidth * clipDurationSeconds;
        var startScale = ((endScale / 100) * imageWidth - totalPixelChange) / imageWidth * 100;

        // If the scale ends up being negative, just set it to zero as a minimum
        if (startScale < 0) {
            startScale = 0;
        }

        // This should only be true if there's exactly two keyframes
        if (useExistingKeyframes) {
            var keyTimes = scaleProp.getKeys();
            if (typeof keyTimes === 'undefined' || keyTimes === undefined || keyTimes === null) {
                if (!silent) { alert("AutoSpeedScaleExpand Error: Unexpected number of keys. Can't continue.") }
                return
            }
            
            scaleProp.setValueAtKey(keyTimes[0], startScale, true);
            scaleProp.setValueAtKey(keyTimes[1], endScale, true);
        } else {
            if (placeAtTransitionEnds && leftTrans != null) {
                var startKeyTime = leftTrans.internalEnd  // The end of the opening transition
            } else {
                var startKeyTime = clip.inPoint
            }

            if (placeAtTransitionEnds && rightTrans != null) {
                var endKeyTime = rightTrans.internalStart // The start of the closing transition
            } else {
                var endKeyTime = clip.outPoint
            }

            // Clear any existing keyframes by disabling and re-enabling time varying
            scaleProp.setTimeVarying(false)
            scaleProp.setTimeVarying(true)

            // SET THE TWO KEYFRAMES
            // --- Start Keyframes ---
            scaleProp.addKey(startKeyTime)
            scaleProp.setValueAtKey(startKeyTime, startScale, true)

            // --- End Keyframes ---
            // Create time object for time at a single frame prior to endpoint because otherwise if we line up the playhead to the keyframe it won't show the clip in the preview
            var endTimeObjToUse = new Time()
            endTimeObjToUse.ticks = (Number(endKeyTime.ticks) - Number(ThioUtils.singleFrameTimeObject(sequence).ticks)).toString()

            scaleProp.addKey(endTimeObjToUse)
            scaleProp.setValueAtKey(endTimeObjToUse, endScale, true)
        }
    };

    /**
     * Checks whether two clips/track items overlap at any point on the timeline, but different tracks
     *
     * @overload
     * @param {TrackItem} clipA
     * @param {TrackItem} clipB
     * @param {Boolean=} [ignoreTransitions] Optional: Whether to not include the end ranges where there's a transition. Default = False
     * @param {Sequence=} [sequence] Optional: The sequence the clips are in, otherwise the active sequence is used. Reads transitions through the vanilla API only, which is the fastest path.
     * @returns {Boolean} Whether the two clips overlap in time
     *
     * @overload
     * @param {TrackItem} clipA
     * @param {TrackItem} clipB
     * @param {Boolean} ignoreTransitions Whether to not include the end ranges where there's a transition.
     * @param {QESequence} sequence The QE sequence the clips are in. Reads transitions through the QE DOM instead, which is slower, so prefer passing the vanilla sequence when you have one.
     * @returns {Boolean} Whether the two clips overlap in time
     *
     * @param {TrackItem} clipA
     * @param {TrackItem} clipB
     * @param {Boolean=} ignoreTransitions
     * @param {Sequence|QESequence=} sequence
     * @returns {Boolean}
    */
    pub.checkIfClipsShareTimeRange = function(clipA, clipB, ignoreTransitions, sequence) {
        // Two clips on the same track can never occupy the same time, so that's settled before anything else gets read.
        // Note this means passing the same clip in as both arguments returns false.
        if (clipA.mediaType === clipB.mediaType && clipA.parentTrackIndex === clipB.parentTrackIndex) {
            return false;
        }

        // ---------- Overload checking ------------
        if (checkIfSequenceIsQE(sequence)) {
            return checkIfClipsShareTimeRangeQE(clipA, clipB, ignoreTransitions, sequence);
        }
        return checkIfClipsShareTimeRangeVanilla(clipA, clipB, ignoreTransitions, sequence);
    };

    /**
     * Internal: QE DOM based implementation of checkIfClipsShareTimeRange(), used when a QE sequence is given.
     * @param {TrackItem} clipA
     * @param {TrackItem} clipB
     * @param {Boolean=} ignoreTransitions
     * @param {QESequence|Sequence=} qeSequence
     * @returns {Boolean}
     */
    function checkIfClipsShareTimeRangeQE(clipA, clipB, ignoreTransitions, qeSequence) {
        var aStartTicks = Number(clipA.start.ticks);
        var aEndTicks   = Number(clipA.end.ticks);
        var bStartTicks = Number(clipB.start.ticks);
        var bEndTicks   = Number(clipB.end.ticks);

        if (typeof ignoreTransitions === 'undefined' || ignoreTransitions === undefined || ignoreTransitions === null) {
            ignoreTransitions = false
        }

        // Excluding transitions can only ever shrink the ranges, so if the untrimmed ranges already don't overlap, there's no
        // point looking at any transitions at all
        if (!(aStartTicks < bEndTicks && aEndTicks > bStartTicks)) {
            return false;
        }

        if (ignoreTransitions === true) {
            // Resolve the sequence once so both clips reuse it instead of each doing its own lookup
            var resolvedQESequence = checkOrGetQESequenceForRange(qeSequence);
            if (resolvedQESequence === null) return false;

            var aTrack = getQETrackForClip(clipA, resolvedQESequence);
            var bTrack = getQETrackForClip(clipB, resolvedQESequence);
            if (aTrack === null || bTrack === null) return false;

            // Trim each clip's range inward by however far its transitions actually extend into it. Only the track's transition
            // list gets read (no QE clip lookup, no Time objects), and clamping against the clip's own boundaries means
            // alignment (start/center/end at cut) is handled automatically, including when Premiere re-aligns a transition
            // due to a lack of handles.
            var aRange = calculateRangeTicksWithoutTransitions(clipA, aTrack);
            var bRange = calculateRangeTicksWithoutTransitions(clipB, bTrack);

            // If either clip is entirely covered by its transitions there's no remaining range left to overlap
            if (aRange.fullyCovered || bRange.fullyCovered) {
                return false;
            }

            aStartTicks = aRange.startTicks;
            aEndTicks   = aRange.endTicks;
            bStartTicks = bRange.startTicks;
            bEndTicks   = bRange.endTicks;
        }

        // Check if the clips overlap in time
        return (aStartTicks < bEndTicks) && (aEndTicks > bStartTicks);
    }


    /**
     * Check if there are any clips on the timeline in a time range on a specified video track.
     * @param {Time} startTimeObj
     * @param {Time} endTimeObj
     * @param {Number} trackIndex
     * @param {"video"|"audio"} mediaType
     * @param {Boolean=} includeTracksAbove Optional: Include clips in range on the given track index and up. Default = False
     * @returns {TrackItem[]|false} Return an array of clips if any are in the range, otherwise false.
     */
    pub.checkIfAnyClipsInTimeRangeOnTrack = function (startTimeObj, endTimeObj, trackIndex, mediaType, includeTracksAbove) {
        if (typeof includeTracksAbove === 'undefined' || includeTracksAbove === undefined || includeTracksAbove === null) {
            includeTracksAbove = false
        }

        /**@type {TrackItem[]}*/ var clipsInRange = []

        var activeSeq = app.project.activeSequence;
        if (!activeSeq) return false;
        if (mediaType !== "video" && mediaType !== "audio") {
            alert("ThioUtils checkIfAnyClipsInTimeRangeOnTrack Error - Invalid media type specified. Use 'video' or 'audio'.");
            return false;
        }

        // var trackObj = null;

        // Get the tracks above if applicable
        var tracksToCheck = [];

        if (mediaType === "video") {
            if (!activeSeq.videoTracks[trackIndex]) return false;

            if (!includeTracksAbove) {
                tracksToCheck.push(activeSeq.videoTracks[trackIndex])
            } else {
                for (var t = trackIndex; t < activeSeq.videoTracks.length; t++) {
                    tracksToCheck.push(activeSeq.videoTracks[t]);
                }
            }            

        } else if (mediaType === "audio") {
            if (!activeSeq.audioTracks[trackIndex]) return false;

            if (!includeTracksAbove) {
                tracksToCheck.push(activeSeq.audioTracks[trackIndex])
            } else {
                for (var t = trackIndex; t < activeSeq.audioTracks.length; t++) {
                    tracksToCheck.push(activeSeq.audioTracks[t]);
                }
            }
            
        } else {
            alert("ThioUtils checkIfAnyClipsInTimeRangeOnTrack Error - Invalid media type specified. Use 'video' or 'audio'.");
            throw ("ThioUtils checkIfAnyClipsInTimeRangeOnTrack Error - Invalid media type specified. Use 'video' or 'audio'.");
        }
        
        for (var i = 0; i < tracksToCheck.length; i++) {
            var trackObj = tracksToCheck[i];

            for (var j = 0; j < trackObj.clips.numItems; j++) {
                var clip = trackObj.clips[j];
                // Handle case where start and end are the same (point-in-time check)
                if (startTimeObj.ticks === endTimeObj.ticks) {
                    // Check if the point is within the clip (inclusive of start, exclusive of end)
                    if (Number(clip.start.ticks) <= Number(startTimeObj.ticks) && Number(clip.end.ticks) > Number(startTimeObj.ticks)) {
                        clipsInRange.push(clip)
                    }
                } else {
                    // Range overlap logic
                    if (Number(clip.start.ticks) < Number(endTimeObj.ticks) && Number(clip.end.ticks) > Number(startTimeObj.ticks)) {
                        clipsInRange.push(clip)
                    }
                }
            }
        }

        if (clipsInRange.length === 0) {
            return false;
        } else {
            return clipsInRange;
        }
    };

    /**
     * Check if the current playhead position is within the time range of a given clip object on the timeline.
     * @param {TrackItem|TrackItemCollection|TrackItem[]} clipToCheck The clip object to check against.
     * @return {Boolean} True if the playhead is within the clip's time range, false otherwise.
     */
    pub.checkIfPlayheadIsInClip = function (clipToCheck) {
        var activeSeq = app.project.activeSequence;
        if (!activeSeq) {
            alert("checkIfPlayheadIsInClip Error: No active sequence found.")
            return false;
        }

        var playheadPositionTicks = Number(activeSeq.getPlayerPosition().ticks);
        var clipsArray = ThioUtils.convertToArray(clipToCheck);
        var anyBadFound = false;

        for (var i = 0; i < clipsArray.length; i++) {
            
            var clipStartTicks = Number(clipsArray[i].start.ticks);
            var clipEndTicks = Number(clipsArray[i].end.ticks);

            // Check if the playhead is within the clip's time range
            if (playheadPositionTicks >= clipStartTicks && playheadPositionTicks <= clipEndTicks) {
                // // Playhead is within the clip's time range, do nothing
            } else {
                anyBadFound = true; // Playhead is not within the clip's time range
                break
            }
        }

        return !anyBadFound; // Return true if no clips were found that the playhead is not in       
    };

    /**
     * Converts a given tick count to seconds based on a known TICKS_PER_SECOND value.
     * @param {Number|string} ticks
     * @returns {Number} The equivalent time in seconds.
     */
    pub.ticksToSeconds = function (ticks) {
        var TICKS_PER_SECOND = 254016000000;
        return Number(ticks) / TICKS_PER_SECOND;
    };

    /**
     * Converts a given tick count to a Time object.
     * @param {Number|string} ticks The number of ticks to convert.
     * @returns {Time} A Time object with the seconds property set.
     */
    pub.ticksToTimeObject = function (ticks) {
        var time = new Time();
        time.ticks = String(ticks);
        return time;
    };

    /**
     * Converts a given number of seconds to a Time object.
     * @param {Number} seconds The number of seconds to convert.
     * @return {Time} A Time object with the seconds property set.
     */
    pub.secondsToTimeObject = function (seconds) {
        var time = new Time();
        time.seconds = seconds;
        return time;
    };

    /**
     * Takes in any kind of time and converts to a Time object
     * @param {Time|Number|String} inputTime 
     * @returns {Time}
     */
    pub.makeTimeObjUniversal = function(inputTime) {
        if (inputTime instanceof Time) {
            return inputTime
        } else if (typeof inputTime === 'number') {
            return ThioUtils.secondsToTimeObject(inputTime)
        } else if (typeof inputTime === 'string') {
            return ThioUtils.ticksToTimeObject(inputTime)
        } else {
            var inputtedType = typeof inputTime
            throw new Error("makeTimeObjUniversal Error: inputTime must be a Time object, number (seconds), or string (ticks). Type was: " + inputtedType)
        }
    }

    /**
     * Creates a Time object representing a single frame duration based on the sequence's timebase.
     * @param {Sequence=} sequence The sequence object to get the timebase from. If not provided, active sequence will be used.
     * @return {Time} A Time object representing the duration of a single frame in seconds.
     */
    pub.singleFrameTimeObject = function (sequence) {

        if (sequence instanceof Sequence === false) {
            sequence = app.project.activeSequence;
        }

        var time = new Time();
        time.ticks = sequence.timebase // Sequence.timebase is the number of ticks per frame
        return time;
    };

    /**
     * Updates a Time object to the nearest frame based on the sequence's timebase
     * @param {Sequence} sequence Sequence object to get the timebase from.
     * @param {Time} timeObj The Time object to round to the nearest frame.
     * @returns {Time} Updated time object rounded to the nearest frame.
     */
    pub.convertTimeObjectToNearestFrame = function (sequence, timeObj) {
        // The timebase is ticks per frame
        var frameRateTicks = Number(sequence.timebase);
        var currentTicks = Number(timeObj.ticks);
        // Modulus the current ticks by the frame rate to get the remainder
        var remainder = currentTicks % frameRateTicks;
        var halfFrameduration = frameRateTicks / 2;
        // If the remainder is less than half the frame rate, round down; otherwise, round up
        if (remainder < halfFrameduration) {
            currentTicks -= remainder; // Round down
        } else {
            currentTicks += (frameRateTicks - remainder); // Round up
        }
        // Create a new Time object with the rounded ticks
        var roundedTime = ThioUtils.ticksToTimeObject(currentTicks);
        return roundedTime;
    };

    /**
     * Takes in an array of TrackItems (clips) and returns a new array sorted by their start ticks.
     * @param {TrackItem[]|TrackItemCollection} clips
     * @returns {TrackItem[]} An array of TrackItems sorted by their start ticks.
     */
    pub.getSortedClipsArray = function (clips) {
        var sortedClips = [];
        // If it's not already an array, convert it to one. Otherwise make a copy of it.
        if (!Array.isArray(clips)) {
            sortedClips = ThioUtils.convertToArray(clips);
        } else {
            sortedClips = clips.slice(); // Make a copy of the array to avoid modifying the original
        }

        // Sort the clips based on their start ticks
        sortedClips.sort(function (a, b) {
            return Number(a.start.ticks) - Number(b.start.ticks);
        });

        return sortedClips;
    };

    /**
     * Convert a time object to a formatted string based on the sequence's frame rate and display format.
     * @param {Time} timeObj
     * @param {boolean=} useAudioFormat Whether to use audioDisplayFormat. Only applicable if timebaseReference is a sequence, otherwise uses the inherent timeDisplay type. Defaults to false and uses videoDisplayFormat
     * @param {Sequence|TrackItem|ProjectItem=} timebaseReference Required to ensure it uses the right timecode format, like if the source video has a different fps. Can be provided in a few ways, such as the parent sequence's timecode, or a clip for its source timecode. Defaults to current active sequence. Recommended to provide something yourself.
     * @returns {string} A formatted timecode string representing the time object.
     */
    pub.getTimecodeString_FromTimeObject = function (timeObj, useAudioFormat, timebaseReference) {
        if (typeof timebaseReference === 'undefined' || timebaseReference === undefined || timebaseReference === null) {
            timebaseReference = app.project.activeSequence;
        }

        if (typeof useAudioFormat === 'undefined' || useAudioFormat === undefined || useAudioFormat === null) {
            useAudioFormat = false;
        }

        var frameRateTicks;
        var formatToUse;

        if (timebaseReference instanceof Sequence) {
            frameRateTicks = timebaseReference.timebase;

            if (useAudioFormat) {
                formatToUse = timebaseReference.getSettings().audioDisplayFormat;
            } else {
                formatToUse = timebaseReference.getSettings().videoDisplayFormat;
            }

        } else if (timebaseReference instanceof TrackItem) {
            frameRateTicks = timebaseReference.projectItem.sourceTimebase;
            formatToUse = timebaseReference.projectItem.timeDisplayFormat;

        } else if (timebaseReference instanceof ProjectItem) {
            frameRateTicks = timebaseReference.sourceTimebase;
            formatToUse = timebaseReference.timeDisplayFormat;
        } else {
            alert("ThioUtils getTimecodeString_FromTimeObject Error - timebaseReference parameter was not one of the expected types.")
            throw("ThioUtils getTimecodeString_FromTimeObject Error - timebaseReference parameter was not one of the expected types.")
        }

        var frameRateTimeObj = ThioUtils.ticksToTimeObject(frameRateTicks);

        return timeObj.getFormatted(frameRateTimeObj, formatToUse).toString();
    };

    /**
     * Gets a FrameRate type object for the given sequence, like to be used with TickTime
     * @param {Sequence=} sequence The sequence to get the FrameRate object for, or if not provided the active sequence
     * @returns {FrameRate} A FrameRate object representing the sequence's frame rate.
     */
    pub.getFrameRateObj_FromSequence = function(sequence) {
        var sequenceToUse = ThioUtils.checkOrGetActiveSequence(sequence);
        var sequenceFrameRate = new FrameRate();
        sequenceFrameRate.ticksPerFrame = Number(sequenceToUse.timebase);

        return sequenceFrameRate;
    };

    /**
     * Converts a timecode string to a Time object based on the sequence's frame rate and display format.
     * @param {String} timecodeString 
     * @param {Sequence=} sequence The sequence the timecode is used in, or the active sequence if not provided. Needed to ensure accurate format conversion.
     * @returns {Time|null} Returns time object if success, or null if fail.
     */
    pub.timecodeStringToTimeObj = function(timecodeString, sequence) {
        var timeObj = new Time()

        // A lot can go wrong like because of a malformed timecode, so just use a try/catch
        try {
            var sequenceTouse = ThioUtils.checkOrGetActiveSequence(sequence)

            var frameRateObj = ThioUtils.time.getFrameRateObj_FromSequence(sequenceTouse)

            var timeDisplay = new TimeDisplay();
            timeDisplay.type = sequenceTouse.projectItem.timeDisplayFormat;

            var currTime = TickTime.timecodeToTime(timecodeString, frameRateObj, timeDisplay)

            timeObj.ticks = currTime.ticks
        } catch (e) {
            $.writeln(e)
            return null
        }

        if (timeObj instanceof Time) {
            return timeObj
        } else { // Not sure what would cause it to get here but just in case.
            return null
        }
    }

    /**
     * Convert frames to ticks based on the sequence's frame rate.
     * @param {Number} frames
     * @param {Sequence=} sequence Sequence to use
     * @returns {Number} The equivalent number of ticks for the given number of frames.
     */
    pub.framesToTicks = function (frames, sequence) {
        if (typeof sequence === 'undefined' || sequence === undefined || sequence === null) {
            sequence = ThioUtils.checkOrGetActiveSequence(sequence)
        } else if (!(sequence instanceof Sequence)) {
            alert("ThioUtils framesToTicks error: 'sequence' parameter appears to be the wrong type. Must be Sequence type.")
            throw ("ThioUtils framesToTicks error: 'sequence' parameter appears to be the wrong type. Must be Sequence type.")
        }

        var frameRateTicks = sequence.timebase;
        return Number(frames) * Number(frameRateTicks);
    };

    /**
     * Given a specific timeline position in ticks, this calculates the corresponding position relative to within the given clip object's source
     * @param {TrackItem} clipObject
     * @param {Number|string} timelineTicks
     * @returns
     */
    pub.ConvertTimelineTicksToSourceTicks = function (clipObject, timelineTicks) {
        var timelineTicksNumber = Number(timelineTicks);
        var clipStartTicks = Number(clipObject.start.ticks);
        var clipInternalStartTicks = Number(clipObject.inPoint.ticks);
        var timelineTicksOffset_FromClipStart = timelineTicksNumber - clipStartTicks;
        return clipInternalStartTicks + timelineTicksOffset_FromClipStart;
    };

    /**
     * Given a specific timeline time, this calculates the corresponding position relative to within the given clip object's source.
     * @param {TrackItem} clipObject 
     * @param {Time} timelineTime 
     * @returns {Time} A Time object representing the position within the source media of the clip.
     */
    pub.ConvertTimelineTimetoSourceTime = function (clipObject, timelineTime) {
        var newTicks = ThioUtils.ConvertTimelineTicksToSourceTicks(clipObject, timelineTime.ticks);
        return ThioUtils.ticksToTimeObject(newTicks);
    }

    /**
     * Given a specific source time in ticks, this calculates the corresponding position on the timeline for the given clip object.
     * @param {TrackItem} clipObject 
     * @param {Time} sourceTime 
     */
    pub.ConvertSourceTimeToTimelineTime = function (clipObject, sourceTime) {
        var sourceTicksNumber = Number(sourceTime.ticks);
        var clipStartTicks = Number(clipObject.start.ticks);
        var clipInternalStartTicks = Number(clipObject.inPoint.ticks);
        var sourceTicksOffset_FromClipStart = sourceTicksNumber - clipInternalStartTicks;
        return ThioUtils.ticksToTimeObject(clipStartTicks + sourceTicksOffset_FromClipStart);
    };

    /**
     * Adds two Time objects together and returns a new Time object representing the sum.
     * @param {Time} timeObj1 
     * @param {Time} timeObj2 
     * @returns {Time} A new Time object representing the sum of the two input Time objects.
     */
    pub.addTime = function (timeObj1, timeObj2) {
        var totalTicks = Number(timeObj1.ticks) + Number(timeObj2.ticks);
        return ThioUtils.ticksToTimeObject(totalTicks);
    };

    /**
     * Subtracts the second Time object from the first and returns a new Time object representing the difference.
     * @param {Time} timeObj1
     * @param {Time} timeObj2
     * @return {Time} A new Time object representing the difference between the two input Time objects.
     */
    pub.subtractTime = function(timeObj1, timeObj2) {
        var totalTicks = Number(timeObj1.ticks) - Number(timeObj2.ticks);
        return ThioUtils.ticksToTimeObject(totalTicks);
    }

    /**
     *  Gathers information about the currently selected clips using the QE DOM. Returns an array of custom objects each containing details about the corresponding QE clip object.
     * @returns {ThioUtils.ClipInfoQE[]|null} An array of objects containing information about each selected clip, or null if no clips selected or no active sequence.
     */
    pub.getSelectedClipInfoQE = function () {
        var activeSequence = app.project.activeSequence;
        if (!activeSequence) {
            alert("No active sequence found.");
            return null;
        }

        // Get selected clips from vanilla API
        var selectedVanillaClipObjects = activeSequence.getSelection();
        if (!selectedVanillaClipObjects.length) {
            alert("No clips selected in the active sequence.");
            return null;
        }
        return ThioUtils.getClipInfoQE(selectedVanillaClipObjects);
    };


    /**
     * Gathers information about the inputted clips using the QE DOM. Returns an array of custom objects each containing details about the corresponding QE clip object.
     * @param {TrackItem|TrackItemCollection|TrackItem[]} vanillaClips Specify a collection or array of vanilla clip objects to get info for.
     * @param {QESequence|null=} qeSequence Optional: The QE sequence the clips are in. Defaults to the active sequence.
     * @returns {ThioUtils.ClipInfoQE[]} An array of objects containing information about each selected clip, or null if no clips selected or no active sequence.
     */
    pub.getClipInfoQE = function (vanillaClips, qeSequence) {
        if (typeof qeSequence === 'undefined' || qeSequence === undefined || qeSequence === null) {
            qeSequence = qe.project.getActiveSequence();
        }

        var clipInfo = [];
        var outputString = "";
        var clipCount = 0;

        var vanillaClipsArray = ThioUtils.convertToArray(vanillaClips); // For some reason doing this.convertToArray doesn't work here? I forget why but this has happened before. But it's better to use ThioUtils. instead anyway

        // Process each selected vanilla clip
        for (var i = 0; i < vanillaClipsArray.length; i++) {
            var vanillaClip = vanillaClipsArray[i];

            var trackIndex = vanillaClip.parentTrackIndex;
            // Get the corresponding track in QE
            if (vanillaClip.mediaType === "Video") {
                var trackItem = qeSequence.getVideoTrackAt(trackIndex);
            } else if (vanillaClip.mediaType === "Audio") {
                var trackItem = qeSequence.getAudioTrackAt(trackIndex);
            }
            else {
                alert("Skipping Unknown Media Type: " + vanillaClip.mediaType);
                continue;
            }

            // Search through items in this track to find matching clip by start time
            for (var j = 0; j < trackItem.numItems; j++) {
                var qeClipObject = trackItem.getItemAt(j);

                // Skip if this item is null or undefined (empty space)
                if (!qeClipObject) continue;

                // Match based on start time in ticks
                if (qeClipObject.start.ticks === vanillaClip.start.ticks) {
                    clipCount++;

                    // Stores the info to be returned for each QE clip item in the list of selected items
                    var info = {
                        name: qeClipObject.name,
                        vanillaMediaType: vanillaClip.mediaType,
                        clipItemIndexQE: j,   // The QE Clip index in the track
                        trackIndex: trackIndex, // The track index in the sequence
                        startTicks: qeClipObject.start.ticks,
                        endTicks: qeClipObject.end.ticks,
                        vanillaNodeId: vanillaClip.nodeId,
                        fullQEClipObject: qeClipObject,
                        fullVanillaClipObject: vanillaClip
                    };

                    clipInfo.push(info);

                    outputString += "Clip " + clipCount + ":\n";
                    outputString += "Name: " + info.name + "\n";
                    outputString += "Start (Ticks): " + info.startTicks + " ticks\n";
                    outputString += "End (Ticks): " + info.endTicks + " ticks\n\n";
                }
            }
        }

        //alert(outputString);
        return clipInfo;
    };

    /**
     * Given a collection or array of vanilla clip objects, retrieves the corresponding QE clip objects and returns them in an array.
     * @param {TrackItem|TrackItemCollection|TrackItem[]} vanillaClips 
     * @returns 
     */
    pub.getQEClipsArrayFromVanillaClips = function(vanillaClips) {
        // Enable QE DOM
        app.enableQE();
        var qeClips = [];
        var vanillaClipsArray = ThioUtils.convertToArray(vanillaClips);

        for (var i = 0; i < vanillaClipsArray.length; i++) {
            var qeClip = ThioUtils.getQEClipFromVanillaClip(vanillaClipsArray[i]);
            if (qeClip) {
                qeClips.push(qeClip);
            }
        }
        return qeClips;
    };

    /**
     * For a given vanilla clip object, retrieves the corresponding QE clip object from the active sequence.
     * @param {TrackItem} vanillaClip
     * @returns {QETrackItem|null} The corresponding QE clip object if found, or null if not found.
     */
    pub.getQEClipFromVanillaClip = function (vanillaClip) {
        var qeSequence = qe.project.getActiveSequence();
        var trackIndex = vanillaClip.parentTrackIndex;
        var trackItem = null;

        if (vanillaClip.mediaType === "Video") {
            trackItem = qeSequence.getVideoTrackAt(trackIndex);
        } else if (vanillaClip.mediaType === "Audio") {
            trackItem = qeSequence.getAudioTrackAt(trackIndex);
        } else {
            alert("Skipping Unknown Media Type: " + vanillaClip.mediaType);
            return null;
        }

        // Search through items in this track to find matching clip by start time
        for (var j = 0; j < trackItem.numItems; j++) {
            var qeClipObject = trackItem.getItemAt(j);

            // Skip if this item is null or undefined (empty space)
            if (!qeClipObject) continue;

            // Match based on start time in ticks
            if (qeClipObject.start.ticks === vanillaClip.start.ticks) {
                return qeClipObject;
            }
        }
        return null;
    };

    /**
     * Gathers information about the currently selected clips using the vanilla (non-QE) DOM.
     * Returns an array of custom objects with details like start/end ticks, internal in/out points, track, and node ID.
     * @returns {Array<ThioUtils.ClipInfoVanilla>|null} An array of objects containing information about each selected clip, or undefined if no clips selected or no active sequence.
     */
    pub.getSelectedClipInfoVanilla = function () {
        var activeSequence = app.project.activeSequence;
        if (!activeSequence) {
            alert("No active sequence found.");
            return null;
        }
        var selectedClips = activeSequence.getSelection();
        if (!selectedClips.length) {
            alert("No clips selected in the active sequence.");
            return null;
        }
        var clipInfo = [];
        var outputString = "";
        for (var i = 0; i < selectedClips.length; i++) {
            var clip = selectedClips[i];
            clipInfo.push({
                name: clip.name,
                startTicks: clip.start.ticks,                // Start time in ticks relative to the timeline
                endTicks: clip.end.ticks,                    // End time in ticks relative to the timeline
                internalClipStartTicks: clip.inPoint.ticks,  // In point in ticks relative to the clip
                internalClipEndTicks: clip.outPoint.ticks,   // Out point in ticks relative to the clip
                trackIndex: clip.parentTrackIndex,
                nodeId: clip.nodeId,
                fullClipObject: clip
            });
            outputString += "Clip " + (i + 1) + ":\n";
            outputString += "Name: " + clip.name + "\n";
            outputString += "In Point: " + clip.start.ticks + " ticks\n";
            outputString += "Out Point: " + clip.end.ticks + " ticks\n";
            outputString += "Internal In Point: " + clip.inPoint.ticks + " ticks\n";
            outputString += "Internal Out Point: " + clip.outPoint.ticks + " ticks\n";
            outputString += "Node ID: " + clip.nodeId + "\n";
            outputString += "Track Index: " + clip.parentTrackIndex + "\n\n";

        }
        //alert(outputString); // Display the formatted string in an alert
        return clipInfo;
    };

    /**
     * Converts a collection of items (like TrackItem collections) or array-like object into a standard JavaScript array. Or just an object to put into an array.
     * @template T
     * @param {T | T[] | Collection<T>} obj A collection of items, such as a TrackItem collection or an array-like object.
     * @returns {T[]} An array containing the items from the collection.
     */
    pub.convertToArray = function (obj) {
        if (typeof obj === 'undefined' || obj === undefined || obj === null) { return [] }
        if (Array.isArray(obj)) { return obj; }

        /** Cast to any to avoid TypeScript issues with property access 
         * @type {any} 
         */
        var anyObj = obj;

        // If it's not an array-like object or appears to be a single object, just return an array with just it inside
        if (typeof obj === 'string' || (anyObj.length === undefined && anyObj.numItems === undefined)) {
            return [/** @type {T} */ (obj)]; // Use JSDoc to say we're returning an array with the same internal type
        }

        var array = [];
        var count = anyObj.numItems !== undefined ? anyObj.numItems : anyObj.length;
        for (var i = 0; i < count; i++) {
            array.push(anyObj[i]);
        }
        return array;
    };

    /**
     * Check if an array of integers contains a specific integer
     * @param {Number[]} a
     * @param {Number} b
     * @returns {boolean} True if the array contains the integer, false otherwise.
     */
    pub.doesIntArrayAContainIntB = function (a, b) {
        // If a has no length, return false immediately
        if (a.length === 0) {
            return false;
        }

        // Convert to array if not already and possible
        var arr;
        if (!Array.isArray(a)) {
            arr = ThioUtils.convertToArray(a);
        } else {
            arr = a;
        }

        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === b) {
                return true;
            }
        }
        return false;
    }


    /**
     * Checks if an array of TrackItems (clips) contains a specific TrackItem (clip).
     * @param {TrackItem[]|TrackItemCollection} a
     * @param {TrackItem} b
     * @return {boolean} True if the array contains the track item, false otherwise.
     */
    pub.doesAContainTrackB = function (a, b) {
        // We have to compare by using start and end ticks and track index because this stupid language can't do object comparison
        // If either isn't an array already, convert it to one

        /** @type {TrackItem[]} */
        var arr = [];
        if (!Array.isArray(b)) {
            arr = ThioUtils.convertToArray(a);
        }

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].start.ticks === b.start.ticks && arr[i].end.ticks === b.end.ticks && arr[i].parentTrackIndex === b.parentTrackIndex) {
                return true;
            }
        }
        return false
    };

    /**
     * Checks if two track items (clips) are the same based on their properties.
     * @param { TrackItem } trackA
     * @param { TrackItem } trackB
     * @return { boolean } True if the clips are the same, false otherwise.
     */
    pub.isClipASameAsClipB = function (trackA, trackB) {
        if (
            trackA.start.ticks === trackB.start.ticks
            && trackA.end.ticks === trackB.end.ticks
            && trackA.parentTrackIndex === trackB.parentTrackIndex
            && trackA.nodeId === trackB.nodeId
            && trackA.mediaType === trackB.mediaType
            && trackA.type === trackB.type
            && trackA.inPoint.ticks === trackB.inPoint.ticks
            && trackA.outPoint.ticks === trackB.outPoint.ticks
        ) {
            return true;
        }
        return false;
    };

    /**
     * Checks if the active sequence duration in ticks is longer than javascript's MAX_SAFE_INTEGER and issues a warning if so.
     * @param {Sequence} sequence
     * @returns {void}
     */
    pub.checkWarnDuration = function (sequence) {
        // If no sequence is passed, use the active sequence
        if (typeof sequence === 'undefined' || sequence === undefined || sequence === null) {
            sequence = app.project.activeSequence;
        }

        if (!sequence) {
            alert("No active sequence found.");
            return;
        }

        var durationTicks = Number(sequence.end); // Sequence.end is already in ticks, not a time object
        if (durationTicks > ThioUtils.MAX_SAFE_INTEGER) {
            alert("Warning: The active sequence duration exceeds JavaScript's MAX_SAFE_INTEGER. Some operations may not work as expected.");
        }
    };

    /**
     * Unselects any clips currently selected for a sequence.
     * @param {Sequence|null=} sequenceToClear Optional: The sequence to clear selections from. If not provided, will use the active sequence.
     * @returns 
     */
    pub.clearSelections = function (sequenceToClear) {
        var seqToClear = ThioUtils.checkOrGetActiveSequence(sequenceToClear);
        if (seqToClear === null) { return; }
        
        var selections = seqToClear.getSelection();
        for (var i = 0; i < selections.length; i++) {
            selections[i].setSelected(false, false); // Deselect each item
        }
    };

    // region Transitions
    // ------------ Transitions Functions ------------

    /**
     * @typedef {Object} QEVideoTransition
     * @property {string} [name] - The name of the video transition (optional)
     * @property {Function} hasOwnProperty
     */

    /**
     * Adds a specified transition to both ends of a clip, with a specified duration
     * @param {string} transitionName
     * @param {Number} transitionDurationFrames Number of frames for the duration of the transitions
     * @param {TrackItem|TrackItemCollection|TrackItem[]} trackItems Optional: The track item / clip object(s). If not provided, will apply to any selected items.
     * @param {Boolean=} atStart Optional: Whether to apply the transition at the start of the clip. Defaults to true.
     * @param {Boolean=} atEnd Optional: Whether to apply the transition at the end of the clip. Defaults to true.
     */
    pub.addTransitionOnEnds = function (transitionName, transitionDurationFrames, trackItems, atStart, atEnd) {
        var trackItemArray = [];

        // Prepare track items array to apply to
        if (typeof trackItems === 'undefined' || trackItems === undefined || trackItems === null) {
            trackItemArray = ThioUtils.convertToArray(app.project.activeSequence.getSelection())
        } else {
            // If there's just one it will still be put into array by itself
            trackItemArray = ThioUtils.convertToArray(trackItems)
        }

        // Validate the array has items
        if (!trackItemArray || trackItemArray.length <= 0) {
            alert("Error in addTransitionOnEnds: No clips to add transitions to.");
            return;
        }

        // Default values for whether to add to start and end
        if (typeof atStart === 'undefined' || atStart === undefined || atStart === null) {
            atStart = true
        }
        if (typeof atEnd === 'undefined' || atEnd === undefined || atEnd === null) {
            atEnd = true
        }

        // Validate the transition. Even if it doesn't exist, will still return an object, though with an empty "name" string property we can use to check for validity.
        /** @type {QEVideoTransition} */
        var transitionObj = qe.project.getVideoTransitionByName(transitionName);

        if (!transitionObj.hasOwnProperty("name") || transitionObj.name === "" || typeof transitionObj.name !== "string") {
            alert("Error in addTransitionOnEnds: Transition provided does not appear to exist.");
        }

        for (var i = 0; i < trackItemArray.length; i++) {
            var item = trackItemArray[i];

            var trackQEObj = ThioUtils.getQEClipFromVanillaClip(item);
            if (trackQEObj) {
                var transitionDurationString = "0:" + transitionDurationFrames.toString(); // Format as "0:XX" for seconds and frames
                
                if (atStart){
                    trackQEObj.addTransition(transitionObj, true, transitionDurationString, "0:00", 0, true, true)
                }
                if (atEnd) {
                    trackQEObj.addTransition(transitionObj, false, transitionDurationString, "0:00", 1.0, true, true)
                }
                
            } else {
                $.writeln("Track item index " + i + " could not get QE object");
            }
        }
    };

    /**
     * 
     * @param {TrackItemCollection|TrackItem[]|TrackItem} clips
     * @param {boolean} includeAudioTracks 
     * @param {boolean} includeVideoTracks 
     * @param {QESequence|null=} qeSequence Optional: The QE sequence the clips are in. Defaults to the active sequence. If null is passed, the QE cache is refreshed and the clips' sequence is looked up instead.
     * @returns {Array<ThioUtils.ClipTransitionInfo>} Array of clip transition information objects
     */
    pub.getTransitionsForSelectedClips = function (clips, includeAudioTracks, includeVideoTracks, qeSequence) {
        var clipsArray = ThioUtils.convertToArray(clips);

        if (typeof qeSequence === 'undefined' || qeSequence === undefined) {
            qeSequence = qe.project.getActiveSequence();
        } else if (qeSequence === null) {
            // A QE sequence was provided but is null, so the QE DOM probably needs a refresh to see it
            alert("Warning: The provided QE sequence was null. Your script might need to use qe.flushCache() if you are trying to reference a QE Sequence added after the script first loads. It will be automatically detected now but will be slower.")
            qe.project.flushCache()
            var sequence = ThioUtils.getSequenceFromClip(clipsArray[0]) // Assumes they're on the same sequence
            if (sequence !== null) {
                qeSequence = ThioUtils.getQESequenceFromVanilla(sequence)
            }
        }

        var qeClipsArray = ThioUtils.clips.getClipInfoQE(clipsArray, qeSequence);

        var clipTransitionInfo = [];

        // Process each clip from the selected clip info
        for (var i = 0; i < qeClipsArray.length; i++) {
            var qeClip = qeClipsArray[i];

            if (!includeAudioTracks && qeClip.fullVanillaClipObject.mediaType === "Audio") continue;
            if (!includeVideoTracks && qeClip.fullVanillaClipObject.mediaType === "Video") continue;

            var trackItem = null;
            if (qeClip.fullVanillaClipObject.mediaType === "Video") {
                trackItem = qeSequence.getVideoTrackAt(qeClip.trackIndex);
            }
            else if (qeClip.fullVanillaClipObject.mediaType === "Audio") {
                trackItem = qeSequence.getAudioTrackAt(qeClip.trackIndex);
            } else {
                alert("Unknown media type for clip: " + qeClip.name);
                continue;
            }

            // Initialize transitions as null
            var leftTransition = null;
            var rightTransition = null;

            // Process transitions on the track
            for (var j = 0; j < trackItem.numTransitions; j++) {
                var transition = trackItem.getTransitionAt(j);

                // Skip if transition is null, undefined, or type "Empty"
                if (!transition || transition.type === "Empty") continue;

                // Convert all values to numbers for comparison
                var transStartTicks = Number(transition.start.ticks);
                var transEndTicks = Number(transition.end.ticks);
                var clipStartTicks = Number(qeClip.startTicks);
                var clipEndTicks = Number(qeClip.endTicks);

                // Calculate actual transition boundaries considering alignment
                var transitionDurationTicks = transEndTicks - transStartTicks;
                var alignmentOffset = transitionDurationTicks * Number(transition.alignment);
                var effectiveStart = ThioUtils.ticksToTimeObject(transStartTicks + alignmentOffset);
                var effectiveEnd = ThioUtils.ticksToTimeObject(Number(effectiveStart.ticks) + transitionDurationTicks);

                // Calculate the internal start and end relative to the clip's internal timecode
                var internalStart = ThioUtils.ConvertTimelineTimetoSourceTime(qeClip.fullVanillaClipObject, ThioUtils.ticksToTimeObject(transStartTicks));
                var internalEnd = ThioUtils.ConvertTimelineTimetoSourceTime(qeClip.fullVanillaClipObject, ThioUtils.ticksToTimeObject(transEndTicks));

                // Check if this is a left transition for this clip
                // Either starts exactly at clip start (first clip case)
                // Or ends near the clip start (transition between clips)
                if (transStartTicks === clipStartTicks ||
                    (Math.abs(transEndTicks - clipStartTicks) < transitionDurationTicks)) {
                    leftTransition = {
                        name: transition.name,
                        timelineStart: ThioUtils.ticksToTimeObject(transStartTicks),
                        timelineEnd: ThioUtils.ticksToTimeObject(transEndTicks),
                        duration: ThioUtils.ticksToTimeObject(transitionDurationTicks),
                        alignment: transition.alignment,
                        timelineEffectiveStart: effectiveStart,
                        timelineEffectiveEnd: effectiveEnd,
                        fullTransitionObject: transition,
                        internalStart: internalStart,
                        internalEnd: internalEnd
                    };
                }

                // Check if this is a right transition for this clip
                // Either ends exactly at clip end (last clip case)
                // Or starts near the clip end (transition between clips)
                if (transEndTicks === clipEndTicks ||
                    (Math.abs(transStartTicks - clipEndTicks) < transitionDurationTicks)) {
                    rightTransition = {
                        name: transition.name,
                        timelineStart: ThioUtils.ticksToTimeObject(transStartTicks),
                        timelineEnd: ThioUtils.ticksToTimeObject(transEndTicks),
                        duration: ThioUtils.ticksToTimeObject(transitionDurationTicks),
                        alignment: transition.alignment,
                        timelineEffectiveStart: effectiveStart,
                        timelineEffectiveEnd: effectiveEnd,
                        fullTransitionObject: transition,
                        internalStart: internalStart,
                        internalEnd: internalEnd
                    };
                }
            }

            // Create combined info object
            var combinedInfo = {
                clipInfo: qeClip,
                transitions: {
                    left: leftTransition,
                    right: rightTransition
                }
            };

            clipTransitionInfo.push(combinedInfo);
        }

        return clipTransitionInfo;
    }

    /**
     * Gets a clip's timeline range with the transition-covered portions excluded (the ranges where the clip is cross faded with
     * a neighbor). Much faster than pulling the same information out of getTransitionsForSelectedClips(), which has to look up
     * the QE clip objects (scanning every item on the track), convert timeline times to source times, and build Time objects for
     * every transition it finds. Here only a track's transition list is read, and the scan stops as soon as both a head and a
     * tail transition have been found.
     *
     * Alignment is handled implicitly: the range is only ever clamped inward against the clip's own boundaries, so whether the
     * transition is centered, starts at the cut, or ends at the cut, only the part actually sitting on top of this clip is removed.
     *
     * @overload
     * @param {TrackItem} clip The clip to get the range of.
     * @param {Sequence=} [sequence] Optional: The sequence the clip is in. If not provided, the active sequence is used. Reads transitions through the vanilla API only, which is the fastest path.
     * @returns {ThioUtils.ClipTimelineRangeNoTransitions|null} The clip's transition-excluded timeline range, or null if the clip or its track couldn't be used.
     *
     * @overload
     * @param {TrackItem} clip The clip to get the range of.
     * @param {QESequence} sequence The QE sequence the clip is in. Reads transitions through the QE DOM instead, which is slower, so prefer passing the vanilla sequence when you have one.
     * @returns {ThioUtils.ClipTimelineRangeNoTransitions|null} The clip's transition-excluded timeline range, or null if the clip or its track couldn't be used.
     *
     * @param {TrackItem} clip
     * @param {Sequence|QESequence=} sequence
     * @returns {ThioUtils.ClipTimelineRangeNoTransitions|null}
     */
    pub.getClipTimelineRange_WithoutTransitions = function (clip, sequence) {
        if (typeof clip === 'undefined' || clip === undefined || clip === null) {
            alert("Error - getClipTimelineRange_WithoutTransitions: No provided clip.");
            return null;
        }

        // ---------- Overload checking ------------
        if (checkIfSequenceIsQE(sequence)) {
            return getClipTimelineRangeQE(clip, sequence);
        }
        return getClipTimelineRangeVanilla(clip, sequence);
    };

    /**
     * Internal: QE DOM based implementation of getClipTimelineRange_WithoutTransitions(), used when a QE sequence is given.
     * @param {TrackItem} clip
     * @param {QESequence|Sequence=} qeSequence
     * @returns {ThioUtils.ClipTimelineRangeNoTransitions|null}
     */
    function getClipTimelineRangeQE(clip, qeSequence) {
        var resolvedQESequence = checkOrGetQESequenceForRange(qeSequence);
        if (resolvedQESequence === null) {
            return null;
        }

        var qeTrack = getQETrackForClip(clip, resolvedQESequence);
        if (qeTrack === null) {
            return null;
        }

        return calculateRangeWithoutTransitions(clip, qeTrack);
    }

    /**
     * Same as ThioUtils.transitions.getClipTimelineRange_WithoutTransitions() but for multiple clips at once. The sequence is
     * only resolved once, and each track is only looked at once no matter how many of the clips sit on it.
     *
     * @overload
     * @param {TrackItemCollection|TrackItem[]|TrackItem} clips
     * @param {boolean=} [includeAudioTracks] Optional: Whether to include clips on audio tracks. Default = true
     * @param {boolean=} [includeVideoTracks] Optional: Whether to include clips on video tracks. Default = true
     * @param {Sequence=} [sequence] Optional: The sequence the clips are in. If not provided, the active sequence is used. Reads transitions through the vanilla API only, which is the fastest path.
     * @returns {ThioUtils.ClipTimelineRangeNoTransitions[]} Array of transition-excluded timeline ranges, in the same order as the clips given (minus any skipped by the media type filters).
     *
     * @overload
     * @param {TrackItemCollection|TrackItem[]|TrackItem} clips
     * @param {boolean} includeAudioTracks Whether to include clips on audio tracks.
     * @param {boolean} includeVideoTracks Whether to include clips on video tracks.
     * @param {QESequence} sequence The QE sequence the clips are in. Reads transitions through the QE DOM instead, which is slower, so prefer passing the vanilla sequence when you have one.
     * @returns {ThioUtils.ClipTimelineRangeNoTransitions[]} Array of transition-excluded timeline ranges, in the same order as the clips given (minus any skipped by the media type filters).
     *
     * @param {TrackItemCollection|TrackItem[]|TrackItem} clips
     * @param {boolean=} includeAudioTracks
     * @param {boolean=} includeVideoTracks
     * @param {Sequence|QESequence=} sequence
     * @returns {ThioUtils.ClipTimelineRangeNoTransitions[]}
     */
    pub.getClipTimelineRanges_WithoutTransitions = function (clips, includeAudioTracks, includeVideoTracks, sequence) {
        // ---------- Overload checking ------------
        if (checkIfSequenceIsQE(sequence)) {
            return getClipTimelineRangesQE(clips, includeAudioTracks, includeVideoTracks, sequence);
        }
        return getClipTimelineRangesVanilla(clips, includeAudioTracks, includeVideoTracks, sequence);
    };

    /**
     * Internal: QE DOM based implementation of getClipTimelineRanges_WithoutTransitions(), used when a QE sequence is given.
     * @param {TrackItemCollection|TrackItem[]|TrackItem} clips
     * @param {boolean=} includeAudioTracks
     * @param {boolean=} includeVideoTracks
     * @param {QESequence|Sequence=} qeSequence
     * @returns {ThioUtils.ClipTimelineRangeNoTransitions[]}
     */
    function getClipTimelineRangesQE(clips, includeAudioTracks, includeVideoTracks, qeSequence) {
        if (typeof includeAudioTracks === 'undefined' || includeAudioTracks === undefined || includeAudioTracks === null) {
            includeAudioTracks = true;
        }
        if (typeof includeVideoTracks === 'undefined' || includeVideoTracks === undefined || includeVideoTracks === null) {
            includeVideoTracks = true;
        }

        /**@type {ThioUtils.ClipTimelineRangeNoTransitions[]}*/ var ranges = [];

        var clipsArray = ThioUtils.convertToArray(clips);
        if (!clipsArray || clipsArray.length <= 0) {
            return ranges;
        }

        var resolvedQESequence = checkOrGetQESequenceForRange(qeSequence);
        if (resolvedQESequence === null) {
            return ranges;
        }

        // Cache tracks by media type and index so a track is only fetched once no matter how many clips sit on it
        /**@type {Object.<string, QETrack|null>}*/ var trackCache = {};

        for (var i = 0; i < clipsArray.length; i++) {
            var currentClip = clipsArray[i];
            if (!currentClip) continue;

            if (!includeAudioTracks && currentClip.mediaType === "Audio") continue;
            if (!includeVideoTracks && currentClip.mediaType === "Video") continue;

            var cacheKey = currentClip.mediaType + ":" + currentClip.parentTrackIndex;
            var qeTrack = trackCache.hasOwnProperty(cacheKey) ? trackCache[cacheKey] : null;
            if (qeTrack === null) {
                qeTrack = getQETrackForClip(currentClip, resolvedQESequence);
                trackCache[cacheKey] = qeTrack;
            }
            if (qeTrack === null) continue;

            var range = calculateRangeWithoutTransitions(currentClip, qeTrack);
            if (range !== null) {
                ranges.push(range);
            }
        }

        return ranges;
    }

    /**
     * Internal: Whether the given sequence argument is a QE sequence rather than a vanilla one. QE objects have no constructor
     * to test against, so anything that isn't a vanilla Sequence is taken to be one.
     * @param {Sequence|QESequence|null|undefined=} sequenceToCheck
     * @returns {boolean} False if nothing was provided, since the vanilla path is the default
     */
    function checkIfSequenceIsQE(sequenceToCheck) {
        if (typeof sequenceToCheck === 'undefined' || sequenceToCheck === undefined || sequenceToCheck === null) {
            return false;
        }
        return (sequenceToCheck instanceof Sequence === false);
    }

    /**
     * Internal: Resolves the sequence argument used by the transition-excluded range functions. Accepts a QE sequence, a vanilla
     * sequence, or nothing at all (in which case the active sequence is used).
     * @param {QESequence|Sequence|null|undefined=} sequenceToCheck
     * @returns {QESequence|null}
     */
    function checkOrGetQESequenceForRange(sequenceToCheck) {       
        if (typeof sequenceToCheck === 'undefined' || sequenceToCheck === undefined || sequenceToCheck === null) {
            var activeQESequence = qe.project.getActiveSequence();
            if (!activeQESequence) {
                alert("Error - getClipTimelineRange_WithoutTransitions: No active sequence, and no sequence was provided.");
                return null;
            }
            return activeQESequence;
        }

        // Allow passing in a vanilla Sequence for convenience, converting it to the QE equivalent
        if (sequenceToCheck instanceof Sequence === true) {
            var convertedSequence = ThioUtils.getQESequenceFromVanilla(sequenceToCheck);

            // If it wasn't found, the QE DOM may be stale (such as for a sequence created after the script loaded), so refresh and retry
            if (!convertedSequence) {
                qe.project.flushCache();
                convertedSequence = ThioUtils.getQESequenceFromVanilla(sequenceToCheck);
            }
            if (!convertedSequence) {
                alert("Error - getClipTimelineRange_WithoutTransitions: Could not find the QE sequence for the provided sequence.");
                return null;
            }
            return convertedSequence;
        }

        return sequenceToCheck;
    }

    /**
     * Internal: Gets the QE track a given vanilla clip sits on.
     * @param {TrackItem} clip
     * @param {QESequence} qeSequence
     * @returns {QETrack|null}
     */
    function getQETrackForClip(clip, qeSequence) {
        if (clip.mediaType === "Video") {
            return qeSequence.getVideoTrackAt(clip.parentTrackIndex);
        } else if (clip.mediaType === "Audio") {
            return qeSequence.getAudioTrackAt(clip.parentTrackIndex);
        }

        alert("Unknown media type for clip: " + clip.name);
        return null;
    }

    /**
     * Custom object for the ticks-only result of the transition scan, for internal use where Time objects would just be converted back to numbers.
     * @typedef {Object} ClipTimelineRangeTicksNoTransitions
     * @property {number} startTicks - Timeline start in ticks, pushed later if a transition covers the head of the clip
     * @property {number} endTicks - Timeline end in ticks, pulled earlier if a transition covers the tail of the clip
     * @property {number} originalStartTicks - The clip's unmodified timeline start in ticks
     * @property {number} originalEndTicks - The clip's unmodified timeline end in ticks
     * @property {boolean} fullyCovered - True if transitions cover the entire clip, in which case startTicks and endTicks are equal
     */

    /**
     * Internal: Does the actual transition scan for a single clip, in plain numbers only. No Time objects are created here, so
     * callers that only need to compare times can use this directly instead of the Time object version.
     * @param {TrackItem} clip
     * @param {QETrack} qeTrack The QE track the clip is on
     * @returns {ClipTimelineRangeTicksNoTransitions}
     */
    function calculateRangeTicksWithoutTransitions(clip, qeTrack) {
        var clipStartTicks = Number(clip.start.ticks);
        var clipEndTicks = Number(clip.end.ticks);

        var newStartTicks = clipStartTicks;
        var newEndTicks = clipEndTicks;
        var foundHead = false;
        var foundTail = false;

        var numTransitions = qeTrack.numTransitions;
        for (var i = 0; i < numTransitions; i++) {
            var transition = qeTrack.getTransitionAt(i);

            // Skip if transition is null, undefined, or type "Empty"
            if (!transition || transition.type === "Empty") continue;

            var transStartTicks = Number(transition.start.ticks);
            var transEndTicks = Number(transition.end.ticks);

            // Ignore transitions that don't sit on top of this clip at all. Note that a transition touching a clip boundary from
            // the outside (such as one starting exactly at this clip's end) covers the neighboring clip, not this one.
            if (transEndTicks <= clipStartTicks || transStartTicks >= clipEndTicks) continue;

            if (transStartTicks <= clipStartTicks) {
                // Covers the head of the clip, so the usable range starts where the transition ends
                if (transEndTicks > newStartTicks) {
                    newStartTicks = transEndTicks;
                    foundHead = true;
                }
            } else if (transEndTicks >= clipEndTicks) {
                // Covers the tail of the clip, so the usable range ends where the transition starts
                if (transStartTicks < newEndTicks) {
                    newEndTicks = transStartTicks;
                    foundTail = true;
                }
            }
            // Anything else would be a transition sitting entirely within the clip, which shouldn't normally happen, so it's left alone

            // Nothing further in the list can affect the result once both ends have been trimmed
            if (foundHead && foundTail) break;
        }

        // Clamp so the trimmed values can never cross each other or the clip's own boundaries
        if (newStartTicks > clipEndTicks) newStartTicks = clipEndTicks;
        if (newEndTicks < clipStartTicks) newEndTicks = clipStartTicks;
        var fullyCovered = (newStartTicks >= newEndTicks);
        if (fullyCovered) newEndTicks = newStartTicks;

        return {
            startTicks: newStartTicks,
            endTicks: newEndTicks,
            originalStartTicks: clipStartTicks,
            originalEndTicks: clipEndTicks,
            fullyCovered: fullyCovered
        };
    }

    /**
     * Internal: Wraps calculateRangeTicksWithoutTransitions() into the Time object based result the public functions return.
     * @param {TrackItem} clip
     * @param {QETrack} qeTrack The QE track the clip is on
     * @returns {ThioUtils.ClipTimelineRangeNoTransitions}
     */
    function calculateRangeWithoutTransitions(clip, qeTrack) {
        return makeRangeObjectFromTicks(clip, calculateRangeTicksWithoutTransitions(clip, qeTrack));
    }

    // ---------------------------------------------------------------------------------------------------------------------
    // Vanilla API versions of the transition-excluded range functions. Same results as the QE versions above, but a track's
    // transitions are also exposed on the regular API (activeSeq.videoTracks[n].transitions is a TrackItemCollection whose
    // items have the same start/end Time objects), so these never touch the QE DOM at all. That makes them faster still, and
    // means they don't depend on app.enableQE() or on the QE cache being flushed after the timeline changes.
    // ---------------------------------------------------------------------------------------------------------------------

    /**
     * Internal: Vanilla API only implementation of getClipTimelineRange_WithoutTransitions(). The default path, since it's the
     * fastest one.
     * @param {TrackItem} clip
     * @param {Sequence|QESequence=} sequence
     * @returns {ThioUtils.ClipTimelineRangeNoTransitions|null}
     */
    function getClipTimelineRangeVanilla(clip, sequence) {
        var resolvedSequence = checkOrGetVanillaSequenceForRange(sequence);
        if (resolvedSequence === null) {
            return null;
        }

        var track = getVanillaTrackForClip(clip, resolvedSequence);
        if (track === null) {
            return null;
        }

        var rangeTicks = calculateRangeTicksWithoutTransitions_FromTicksList(
            Number(clip.start.ticks),
            Number(clip.end.ticks),
            getTransitionTicksForTrack(track)
        );

        return makeRangeObjectFromTicks(clip, rangeTicks);
    }

    /**
     * Internal: Vanilla API only implementation of getClipTimelineRanges_WithoutTransitions(). Each track's transition times are
     * only read once no matter how many of the clips sit on it.
     * @param {TrackItemCollection|TrackItem[]|TrackItem} clips
     * @param {boolean=} includeAudioTracks
     * @param {boolean=} includeVideoTracks
     * @param {Sequence|QESequence=} sequence
     * @returns {ThioUtils.ClipTimelineRangeNoTransitions[]}
     */
    function getClipTimelineRangesVanilla(clips, includeAudioTracks, includeVideoTracks, sequence) {
        if (typeof includeAudioTracks === 'undefined' || includeAudioTracks === undefined || includeAudioTracks === null) {
            includeAudioTracks = true;
        }
        if (typeof includeVideoTracks === 'undefined' || includeVideoTracks === undefined || includeVideoTracks === null) {
            includeVideoTracks = true;
        }

        /**@type {ThioUtils.ClipTimelineRangeNoTransitions[]}*/ var ranges = [];

        var clipsArray = ThioUtils.convertToArray(clips);
        if (!clipsArray || clipsArray.length <= 0) {
            return ranges;
        }

        var resolvedSequence = checkOrGetVanillaSequenceForRange(sequence);
        if (resolvedSequence === null) {
            return ranges;
        }

        // Cache each track's transition times by media type and index, so a track's transitions are only read from the API once
        /**@type {Object.<string, Number[]|null>}*/ var transitionTicksCache = {};

        for (var i = 0; i < clipsArray.length; i++) {
            var currentClip = clipsArray[i];
            if (!currentClip) continue;

            if (!includeAudioTracks && currentClip.mediaType === "Audio") continue;
            if (!includeVideoTracks && currentClip.mediaType === "Video") continue;

            var cacheKey = currentClip.mediaType + ":" + currentClip.parentTrackIndex;
            if (!transitionTicksCache.hasOwnProperty(cacheKey)) {
                var track = getVanillaTrackForClip(currentClip, resolvedSequence);
                transitionTicksCache[cacheKey] = (track === null) ? null : getTransitionTicksForTrack(track);
            }

            var transitionTicks = transitionTicksCache[cacheKey];
            if (transitionTicks === null) continue;

            var rangeTicks = calculateRangeTicksWithoutTransitions_FromTicksList(
                Number(currentClip.start.ticks),
                Number(currentClip.end.ticks),
                transitionTicks
            );

            ranges.push(makeRangeObjectFromTicks(currentClip, rangeTicks));
        }

        return ranges;
    }

    /**
     * Internal: Vanilla API only implementation of checkIfClipsShareTimeRange(). The default path, since it's the fastest one.
     * @param {TrackItem} clipA
     * @param {TrackItem} clipB
     * @param {Boolean=} ignoreTransitions
     * @param {Sequence|QESequence=} sequence
     * @returns {Boolean}
     */
    function checkIfClipsShareTimeRangeVanilla(clipA, clipB, ignoreTransitions, sequence) {
        var aStartTicks = Number(clipA.start.ticks);
        var aEndTicks   = Number(clipA.end.ticks);
        var bStartTicks = Number(clipB.start.ticks);
        var bEndTicks   = Number(clipB.end.ticks);

        if (typeof ignoreTransitions === 'undefined' || ignoreTransitions === undefined || ignoreTransitions === null) {
            ignoreTransitions = false;
        }

        // Excluding transitions can only ever shrink the ranges, so if the untrimmed ranges already don't overlap, there's no
        // point reading any transitions at all
        if (!(aStartTicks < bEndTicks && aEndTicks > bStartTicks)) {
            return false;
        }

        if (ignoreTransitions === true) {
            var resolvedSequence = checkOrGetVanillaSequenceForRange(sequence);
            if (resolvedSequence === null) return false;

            var aTrack = getVanillaTrackForClip(clipA, resolvedSequence);
            var bTrack = getVanillaTrackForClip(clipB, resolvedSequence);
            if (aTrack === null || bTrack === null) return false;

            var aRange = calculateRangeTicksWithoutTransitions_FromTicksList(aStartTicks, aEndTicks, getTransitionTicksForTrack(aTrack));
            var bRange = calculateRangeTicksWithoutTransitions_FromTicksList(bStartTicks, bEndTicks, getTransitionTicksForTrack(bTrack));

            // If either clip is entirely covered by its transitions there's no remaining range left to overlap
            if (aRange.fullyCovered || bRange.fullyCovered) {
                return false;
            }

            aStartTicks = aRange.startTicks;
            aEndTicks   = aRange.endTicks;
            bStartTicks = bRange.startTicks;
            bEndTicks   = bRange.endTicks;
        }

        // Check if the clips overlap in time
        return (aStartTicks < bEndTicks) && (aEndTicks > bStartTicks);
    }

    // Remembers the most recent QE to vanilla sequence conversion, since the range functions tend to be called in a loop with the
    // same sequence, and the conversion has to scan every sequence in the project
    /**@type {string|null}*/ var lastQESequenceGuid = null;
    /**@type {Sequence|null}*/ var lastVanillaSequenceForGuid = null;

    /**
     * Internal: Resolves the sequence argument used by the vanilla transition-excluded range functions. Accepts a vanilla
     * sequence, a QE sequence, or nothing at all (in which case the active sequence is used).
     * @param {Sequence|QESequence|null|undefined=} sequenceToCheck
     * @returns {Sequence|null}
     */
    function checkOrGetVanillaSequenceForRange(sequenceToCheck) {
        if (typeof sequenceToCheck === 'undefined' || sequenceToCheck === undefined || sequenceToCheck === null) {
            var activeSequence = app.project.activeSequence;
            if (!activeSequence) {
                alert("Error - getClipTimelineRange_WithoutTransitions: No active sequence, and no sequence was provided.");
                return null;
            }
            return activeSequence;
        }

        if (sequenceToCheck instanceof Sequence === true) {
            return sequenceToCheck;
        }

        // Otherwise assume a QE sequence was passed in, and convert it to the vanilla equivalent for convenience
        var qeSequenceGuid = sequenceToCheck.guid;

        // Reuse the last conversion if it was for this same sequence and the cached object is still valid
        if (qeSequenceGuid && qeSequenceGuid === lastQESequenceGuid && lastVanillaSequenceForGuid) {
            try {
                if (lastVanillaSequenceForGuid.sequenceID === qeSequenceGuid) {
                    return lastVanillaSequenceForGuid;
                }
            } catch (e) {
                // The cached sequence object went stale (such as the sequence being closed), so fall through and look it up again
            }
        }

        var convertedSequence = ThioUtils.getVanillaSequenceFromQE(sequenceToCheck);
        if (!convertedSequence) {
            alert("Error - getClipTimelineRange_WithoutTransitions: Could not find the vanilla sequence for the provided sequence.");
            return null;
        }

        lastQESequenceGuid = qeSequenceGuid;
        lastVanillaSequenceForGuid = convertedSequence;

        return convertedSequence;
    }

    /**
     * Internal: Gets the vanilla track a given clip sits on.
     * @param {TrackItem} clip
     * @param {Sequence} sequence
     * @returns {Track|null}
     */
    function getVanillaTrackForClip(clip, sequence) {
        var trackIndex = clip.parentTrackIndex;

        if (clip.mediaType === "Video") {
            return (trackIndex < sequence.videoTracks.numTracks) ? sequence.videoTracks[trackIndex] : null;
        } else if (clip.mediaType === "Audio") {
            return (trackIndex < sequence.audioTracks.numTracks) ? sequence.audioTracks[trackIndex] : null;
        }

        alert("Unknown media type for clip: " + clip.name);
        return null;
    }

    /**
     * Internal: Reads every transition time on a track into a flat array of numbers, as [start0, end0, start1, end1, ...].
     * Flat numbers rather than objects because this is the only part that actually has to cross into the Premiere API, so the
     * result is worth caching and cheap to scan repeatedly.
     * @param {Track} vanillaTrack
     * @returns {Number[]} Pairs of start/end ticks, one pair per transition on the track
     */
    function getTransitionTicksForTrack(vanillaTrack) {
        /**@type {Number[]}*/ var ticksList = [];
        if (!vanillaTrack) return ticksList;

        var trackTransitions = vanillaTrack.transitions;
        if (!trackTransitions) return ticksList;

        for (var i = 0; i < trackTransitions.numItems; i++) {
            var transition = trackTransitions[i];
            if (!transition) continue;

            ticksList.push(Number(transition.start.ticks));
            ticksList.push(Number(transition.end.ticks));
        }

        return ticksList;
    }

    /**
     * Internal: The actual trimming rules, working off an already gathered list of transition times so it can be reused for
     * every clip on a track. Plain numbers only, no Time objects and no API calls.
     * @param {Number} clipStartTicks
     * @param {Number} clipEndTicks
     * @param {Number[]} transitionTicksList Flat start/end tick pairs, as returned by getTransitionTicksForTrack()
     * @returns {ClipTimelineRangeTicksNoTransitions}
     */
    function calculateRangeTicksWithoutTransitions_FromTicksList(clipStartTicks, clipEndTicks, transitionTicksList) {
        var newStartTicks = clipStartTicks;
        var newEndTicks = clipEndTicks;
        var foundHead = false;
        var foundTail = false;

        for (var i = 0; i < transitionTicksList.length; i += 2) {
            var transStartTicks = transitionTicksList[i];
            var transEndTicks = transitionTicksList[i + 1];

            // Ignore transitions that don't sit on top of this clip at all. Note that a transition touching a clip boundary from
            // the outside (such as one starting exactly at this clip's end) covers the neighboring clip, not this one.
            if (transEndTicks <= clipStartTicks || transStartTicks >= clipEndTicks) continue;

            if (transStartTicks <= clipStartTicks) {
                // Covers the head of the clip, so the usable range starts where the transition ends
                if (transEndTicks > newStartTicks) {
                    newStartTicks = transEndTicks;
                    foundHead = true;
                }
            } else if (transEndTicks >= clipEndTicks) {
                // Covers the tail of the clip, so the usable range ends where the transition starts
                if (transStartTicks < newEndTicks) {
                    newEndTicks = transStartTicks;
                    foundTail = true;
                }
            }
            // Anything else would be a transition sitting entirely within the clip, which shouldn't normally happen, so it's left alone

            // Nothing further in the list can affect the result once both ends have been trimmed
            if (foundHead && foundTail) break;
        }

        // Clamp so the trimmed values can never cross each other or the clip's own boundaries
        if (newStartTicks > clipEndTicks) newStartTicks = clipEndTicks;
        if (newEndTicks < clipStartTicks) newEndTicks = clipStartTicks;
        var fullyCovered = (newStartTicks >= newEndTicks);
        if (fullyCovered) newEndTicks = newStartTicks;

        return {
            startTicks: newStartTicks,
            endTicks: newEndTicks,
            originalStartTicks: clipStartTicks,
            originalEndTicks: clipEndTicks,
            fullyCovered: fullyCovered
        };
    }

    /**
     * Internal: Builds the Time object based result the public range functions return, out of a ticks-only result.
     * @param {TrackItem} clip
     * @param {ClipTimelineRangeTicksNoTransitions} rangeTicks
     * @returns {ThioUtils.ClipTimelineRangeNoTransitions}
     */
    function makeRangeObjectFromTicks(clip, rangeTicks) {
        return {
            start: ThioUtils.ticksToTimeObject(rangeTicks.startTicks),
            end: ThioUtils.ticksToTimeObject(rangeTicks.endTicks),
            originalStart: clip.start,
            originalEnd: clip.end,
            trimmedStart: (rangeTicks.startTicks !== rangeTicks.originalStartTicks),
            trimmedEnd: (rangeTicks.endTicks !== rangeTicks.originalEndTicks),
            fullyCovered: rangeTicks.fullyCovered,
            clip: clip
        };
    }

    /**
     * @typedef {Object} Range
     * @property {Time} start
     * @property {Time} end
     */
    /**
     * Gets the clip's source time in, but accounting for footage used by transitions at the start or end, such as a cross fade
     * @param {TrackItem} clip 
     * @param {boolean=} includeLinkedClips Optional: Whether to count linked clips (audio for video and vice-versa). Default = false
     * @returns {Range}
     */
    pub.getClipSourceRange_WithTransitions = function(clip, includeLinkedClips) {
        if (typeof clip === 'undefined' || clip === undefined || clip === null) {
            alert("Error - getClipSourceRange_WithTransitions: No provided clip.")
            return
        }

        if (typeof includeLinkedClips === 'undefined' || includeLinkedClips === undefined || includeLinkedClips === null) {
            includeLinkedClips = false
        }

        var clipToCheckArray = ThioUtils.convertToArray(clip)
        if (includeLinkedClips) {
            var linkedItems = clip.getLinkedItems()

            for (var i = 0; i < linkedItems.length; i++) {
                var item = linkedItems[i];
                clipToCheckArray.push(item)
            }
        }

        // We've already controlled which clips (audio/video linked etc) will get passed in so just tell it to return all media types
        var clipTransitions = ThioUtils.transitions.getTransitionsForSelectedClips(clipToCheckArray, true, true)

        // Get the earliest start time
        var earliestSourceStart = ThioUtils.ConvertTimelineTimetoSourceTime(clip, clip.start).seconds;
        var latestSourceEnd = ThioUtils.ConvertTimelineTimetoSourceTime(clip, clip.end).seconds;

        for (var i = 0; i < clipTransitions.length; i++) {
            var leftTransition = clipTransitions[i].transitions.left;
            var rightTransition = clipTransitions[i].transitions.right;

            if (leftTransition !== null && leftTransition.internalStart.seconds < earliestSourceStart) {
                earliestSourceStart = leftTransition.internalStart.seconds;
            }

            if (rightTransition !== null && rightTransition.internalEnd.seconds > latestSourceEnd) {
                latestSourceEnd = rightTransition.internalEnd.seconds;
            }
        }

        var returnRange = {
            start: ThioUtils.secondsToTimeObject(earliestSourceStart),
            end: ThioUtils.secondsToTimeObject(latestSourceEnd)
        }

        return returnRange
    }

    // region Check Or Get
    // ------------ Check Or Get Functions -----------

    /**
     * If a sequence is provided, it returns it. If not, it returns the active sequence
     * @param {Sequence|null|undefined=} sequenceToCheck 
     * @returns {Sequence|null} The provided sequence or the active sequence, or null if no active sequence.
     */
    pub.checkOrGetActiveSequence = function (sequenceToCheck) {
        if (sequenceToCheck instanceof Sequence === true) {
            return sequenceToCheck;
        } else {
            return app.project.activeSequence // Can be null if no active sequence, so we return it as is
        }
    };

    /**
     * If the input is a TrackItem, TrackItemCollection, or array of TrackItems, it returns it as is. Otherwise get the selected clips from the active sequence.
     * @param {TrackItemCollection|TrackItem|Array<TrackItem>|null|undefined=} clipsToCheck 
     * @returns {TrackItemCollection|Array<TrackItem>|TrackItem|null}
     */
    pub.checkOrGetSelectedClips = function (clipsToCheck) {
        if (typeof clipsToCheck === 'undefined' || clipsToCheck === undefined || clipsToCheck === null) {
            return app.project.activeSequence.getSelection();
        } else if (clipsToCheck instanceof TrackItem === true) {
            return clipsToCheck;
        } else if (Array.isArray(clipsToCheck) === true) {
            return clipsToCheck;
        } else {
            return null;
        }
    };

    /**
     * 
     * @param {Time|Number|string=} time If given, returns a time object equivalent of the value (Time object, seconds, or ticks). Otherwise, returns current playhead position Time.
     */
    pub.checkOrGetCurrentTime = function(time) {
        // If it's not null
        if (typeof time !== 'undefined' && time != null && time != undefined) {
            return ThioUtils.makeTimeObjUniversal(time)
        } else {
            return app.project.activeSequence.getPlayerPosition()
        }
    }

    /**
     * Returns the provided project item if given, otherwise returns the selected project items in the project panel. If none are selected, returns null.
     * @param {ProjectItem=} projectItem 
     * @returns {ProjectItem[]|ProjectItemCollection|null} If a project item is provided, returns it. Otherwise, returns array of selected project items in the project panel. If none are selected, returns null.
     */
    pub.checkOrGetSelectedProjectItem = function (projectItem) {
        // If no project item is provided, get the first selected item in the project panel
        if (typeof projectItem === 'undefined' || projectItem === undefined || projectItem === null) {

            var selectedItems = app.getCurrentProjectViewSelection()

            if (typeof selectedItems === 'undefined' || selectedItems === undefined || selectedItems === null) {
                return null
            } else {
                return selectedItems;
            }
        } else {
            return ThioUtils.convertToArray(projectItem); // Return the provided project item as an array
        }
    }

    //region Project
    // ------------------ Project ------------------

    /**
     * Returns the absolute path to the parent folder of the current .prproj file as a string.
     * @returns {string|null} The folder path, or null if no saved project is open.
     */
    pub.getProjectFolderPath = function () {
        if (!app.project || !app.project.path || app.project.path === '') {
            return null;
        }
        return (new File(app.project.path)).parent.fsName;
    };

    /**
     * Get the name of the project file without the .prproj extension
     * @returns {string}
     */
    pub.getProjectName =function() {
        var projectFileName = app.project.name;
        var stemName = projectFileName.replace(/\.prproj$/, "");
        return stemName;
    }

    /**
     * Retrieves a bin from the project items panel. Can also find a bin within another bin if provided, otherwise searches root.
     * @param {string} binName The name of the bin
     * @param {ProjectItem=} rootToSearch 
     * @returns {ProjectItem|null} Returns the bin with the specified name, or null if not found.
     */
    pub.getBinByName = function(binName, rootToSearch) {
        var currentProject = app.project;
        if (typeof rootToSearch === 'undefined' || rootToSearch === undefined || rootToSearch === null) {
            rootToSearch = currentProject.rootItem; // Default to the root item if no root is provided
        }

        for (var i = 0; i < rootToSearch.children.length; i++) {
            var item = rootToSearch.children[i];
            if (item.type === ProjectItemType.BIN && item.name === binName) {
                return item;
            }
        }
        return null; // Return null if the bin is not found
    }

    /**
     * Get a bin object by specifying its location in the project panel using path-like syntax (use forward slashes to separate the level).
     * @param {string} binPath The path to the bin, using forward slashes to separate levels (e.g. "Whatever Bin/Sub Bin 1/Sub Bin 2").
     * @param {ProjectItem=} binRelativeStart Optional: A bin object to start in, making binPath relative. If not provided, starts at the project root.
     * @returns {ProjectItem|null} Returns the bin object at the specified path, or null if not found.
     */
    pub.getBinByPath = function(binPath, binRelativeStart) {

        if (typeof binRelativeStart === 'undefined' || binRelativeStart === undefined || binRelativeStart === null) {
            binRelativeStart = app.project.rootItem
        }

        if (binPath === '') { return binRelativeStart; }

        // If the bin path contains backslashes, replace with forward slash
        binPath = binPath.replace(/\\/g, "/");

        var pathParts = binPath.split("/");
        var currentBin = binRelativeStart;
        for (var i = 0; i < pathParts.length; i++) {
            var part = pathParts[i];
            var foundBin = ThioUtils.getBinByName(part, currentBin);
            if (foundBin) {
                currentBin = foundBin;
            } else {
                $.writeln("getBinByPath: Bin not found at path part: " + part);
                return null;
            }
        }
        return currentBin;
    }

    /**
     * 
     * @param {ProjectItem} projectItem 
     * @returns {ProjectItem|null} Returns the parent bin of the project item, or null if not found.
     */
    pub.getItemParentBin =function(projectItem) {
        if (typeof projectItem === 'undefined' || projectItem === undefined || projectItem === null || /**@type {any}*/ (projectItem) === 'null') {
            alert("getItemParentBin Error: No provided project item parameter.");
            return null;
        }

        var treePath = projectItem.treePath;

        // The tree path starts with \WhateverProjectName.prproj\ and ends with the project item's full display name.
        // To get the parent bin, we need to remove the project name and the item name from the tree path.
        var pathParts = treePath.split("\\");
        if (pathParts.length < 3) {
            $.writeln("getItemParentBin: Invalid tree path for project item: " + treePath);
            return null;
        }
        // Remove the project name and the item name
        pathParts.pop(); // Remove item name
        pathParts.shift(); // Remove empty string before first slash
        pathParts.shift(); // Remove project name

        var parentBinPath = pathParts.join("\\");
        return ThioUtils.getBinByPath(parentBinPath, app.project.rootItem);

    }

    /**
     * Finds an item within the project panel and returns the project item object, using path-like syntax to specify the item's location
     * @param {string} itemPath The path to the item, using forward slashes to separate levels (e.g. "Whatever Bin/Sub Bin 1/Item Name").
     * @param {ProjectItem=} binRelativeStart Optional: A bin object to start in, making itemPath relative. If not provided, starts at the project root.
     * @return {ProjectItem[]|null} Returns a list of matching item objects at the specified path. Empty array if not found
     */
    pub.getItemByPath = function (itemPath, binRelativeStart) {
        if (typeof binRelativeStart === 'undefined' || binRelativeStart === undefined || binRelativeStart === null) {
            binRelativeStart = app.project.rootItem
        }

        // Get the last item of the path. This will be the item to find. Anything before it is the path
        var pathParts = itemPath.split("/");
        var itemName = pathParts.pop();
        var binPath = pathParts.join("/");
        var binToSearch = ThioUtils.getBinByPath(binPath, binRelativeStart);
        if (!binToSearch) {
            $.writeln("getProjectItemByPath: Bin path not found: " + binPath);
            return null
        }

        if (typeof itemName !== 'undefined' && itemName != null && itemName != undefined) {
            return ThioUtils.getItemInBinByName(binToSearch, itemName);
        } else {
            $.writeln("getProjectItemByPath: Item name is empty or undefined.");
            return null
        }
    }

    /**
     * Gets the label color index of the given item in the project panel. May not necessarily match the color of a clip in the timeline.
     * The actual color is set by the user so we can't really return names.
     * @param {ProjectItem} item The provided project item. If null, uses the selected
     * @return {Number|null} If found returns the index number. If error or no item provided, returns null.
     */
    pub.getProjectItemLabelColorIndex = function(item) {
        // Get selected project item in panel
        if (typeof item === 'undefined' || item === undefined || item === null) {
            return null
        }

        var metadataString = item.getProjectMetadata() // Returns a string of XML metadata

        // Parse the XML string to find the label color index
        var labelColorIndex = null;
        try {
            var xmlDoc = new XML(metadataString);
            var descendants = xmlDoc.descendants();
            var labelValue = "";

            /** @type {any} */
            var d = descendants;
            for (var i = 0; i < d.length(); i++) {
                if (d[i].localName() === "Column.PropertyText.Label") {
                    labelValue = d[i].toString();
                    break;
                }
            }

            if (labelValue !== "") {
                // split "BE.Prefs.LabelColors.3" and take the "3"
                var parts = labelValue.split(".");
                labelColorIndex = Number(parts[parts.length - 1]);
            }
        } catch (e) {
            $.writeln("Error parsing Project Metadata XML: " + e);
        }

        return labelColorIndex;
    }

    /**
     * Changes the label color of a project item(s) in the project panel.
     * NOTE: This apparently will not change the color of the clip when dragged into the timeline, which will be the same as before.
     * @param {ProjectItem|ProjectItem[]|ProjectItemCollection} item 
     * @param {Number} newColorIndex 
     */
    pub.setProjectItemLabelColor = function(item, newColorIndex) {
        if (typeof item === 'undefined' || item === undefined || item === null) {
            alert("changeProjectItemLabelColor: No project item provided.");
            return;
        }

        // Convert to array if not already
        var itemsArray = ThioUtils.convertToArray(item)
        var failedItems = []

        for (var i = 0; i < itemsArray.length; i++) {

            var currentItem = itemsArray[i];

            if (currentItem) {
                // Get current metadata
                var metadataString = currentItem.getProjectMetadata()

                // We need to re-create the XML and replace the label color index in the metadata string, then set it back to the project item
                try {
                    var xmlDoc = new XML(metadataString);
                    var descendants = xmlDoc.descendants();

                    /** @type {any} */
                    var d = descendants;
                    for (var j = 0; j < d.length(); j++) {
                        if (d[j].localName() === "Column.PropertyText.Label") {
                            // labelValue = d[i].toString()
                            d[j] = "BE.Prefs.LabelColors." + newColorIndex.toString(); // Change the label color index
                            break;
                        }
                    }
                } catch (e) {
                    $.writeln("Error parsing Project Metadata XML: " + e);
                    failedItems.push(currentItem);
                    continue;
                }

                // Serialize the XML back to string and set it back to the project item
                try {
                    var updatedMetadataString = xmlDoc.toXMLString();
                    currentItem.setProjectMetadata(updatedMetadataString, ["Column.PropertyText.Label"]);
                } catch (e) {
                    $.writeln("Error setting Project Metadata XML: " + e);
                    failedItems.push(currentItem);
                    continue;
                }
            }
        }
    }

    /**
     * Finds an item within a provided bin and returns the project item object.
     * @param {ProjectItem|null} binObj The bin object, or null to search the root (not in a bin). Or use `app.project.rootItem` directly
     * @param {string} itemName 
     * @param {boolean=} searchSubBins Optional: If true, also searches recursively within any sub-bins. Defaults to false.
     * @param {number|ProjectItemType=} onlyItemType Optional: If provided, only matches items of this type. Use a ProjectItemType constant, such as ProjectItemType.CLIP
     * @returns {ProjectItem[]} Returns the items with the specified name. Empty array if none found.
     */
    pub.getItemInBinByName = function(binObj, itemName, searchSubBins, onlyItemType) {
        /** @type {ProjectItem[]} */
        var foundItems = []

        if (typeof searchSubBins === 'undefined' || searchSubBins === undefined || searchSubBins === null) {
            searchSubBins = false;
        }

        if (typeof onlyItemType === 'undefined' || onlyItemType === undefined || onlyItemType === null) {
            onlyItemType = null
        }

        if (typeof binObj === 'undefined' || binObj === undefined || binObj === null) {
            binObj = app.project.rootItem;
        } else if (binObj.type != ProjectItemType.BIN && binObj.type != ProjectItemType.ROOT) {
            alert("getItemInBinByName Error: Provided object does not appear to be a bin.");
            return foundItems
        }

        if (typeof itemName === 'undefined' || itemName === undefined || itemName === null || (typeof itemName === 'string' && itemName === '')) {
            alert("getItemInBinByName Error: itemName must be provided and not be an empty string.");
            return foundItems
        }

        for (var i = 0; i < binObj.children.numItems; i++) {
            var item = binObj.children[i];
            if (item.name === itemName) {
                // Only if it's the desired type
                if (onlyItemType === null || onlyItemType === item.type) {
                    foundItems.push(item);
                }
            }
            // A matching sub-bin is still added above, then also searched within
            if (searchSubBins && item.type === ProjectItemType.BIN) {
                var subItems = ThioUtils.getItemInBinByName(item, itemName, true, onlyItemType);
                for (var j = 0; j < subItems.length; j++) {
                    if (onlyItemType === null || onlyItemType === subItems[j].type) {
                        foundItems.push(subItems[j]);
                    }
                }
            }
        }

        return foundItems
    }

    /**
     * Checks if a particular project item with a name already exists. If not adds an incremented number to the name until it is. Returns the first available name.
     * @param {string} desiredItemName The desired name to check for existing duplicates.
     * @param {ProjectItemType|number=} itemType Optional: Only count it as a taken name if the other matching item is the same type as this.
     * @param {ProjectItem|string=} binToCheckWithin Optional: Only check for names within a certain bin. Can be provided as a bin path or bin object. Default is root bin and all sub bins unless checkSubBins is false.
     * @param {Boolean=} checkSubBins Optional: Whether to check sub-bins in addition to the given binToCheckWithin. (If binToCheckWithin is not provided, checks everywhere.)
     * @param {string=} separateStr Optional: Goes between the original file name and the incremented number (Exmaple: _ for "Whatever_1"). Default: A space
     * @returns {string}
     */
    pub.getFirstAvailableProjectItemName = function (desiredItemName, itemType, binToCheckWithin, checkSubBins, separateStr) {

        if (typeof itemType === 'undefined' || itemType === undefined || itemType === null) {
            itemType = null
        }

        if (typeof checkSubBins === 'undefined' || checkSubBins === undefined || checkSubBins === null) {
            checkSubBins = true
        }

        if (typeof separateStr === 'undefined' || separateStr === undefined || separateStr === null) {
            separateStr = " "
        }

        // Determine the bin to check within
        if (typeof binToCheckWithin === 'undefined' || binToCheckWithin === undefined || binToCheckWithin === null) {
            binToCheckWithin = app.project.rootItem
        } else if (binToCheckWithin instanceof ProjectItem) {
            if (binToCheckWithin.type != ProjectItemType.BIN && binToCheckWithin.type != ProjectItemType.ROOT) {
                alert("ThioUtils getFirstAvailableProjectItemName Error: Provided binToCheckWithin does not appear to have a supported ProjectItemType. Should be either a BIN or ROOT.");
                return;
            }
            // Leave it as is
        } else if (typeof binToCheckWithin === 'string') {
            if (binToCheckWithin === "") {
                alert("ThioUtils getFirstAvailableProjectItemName Warning: Empty string provided for binToCheckWithin. Searching from root path. If this is intended, you can just leave the parameter undefined.")
                binToCheckWithin = app.project.rootItem;
            } else {
                var foundBinPath = ThioUtils.getBinByPath(binToCheckWithin)
                if (foundBinPath === null) {
                    alert("ThioUtils getFirstAvailableProjectItemName Error: Could not find a bin at the provided path: " + binToCheckWithin);
                    return
                } else {
                    binToCheckWithin = foundBinPath
                }
            }
        }

        var baseName = desiredItemName;
        var index = 2; // Starting Index
        // See if any items are found with the name
        while (ThioUtils.getItemInBinByName(binToCheckWithin, desiredItemName, checkSubBins, itemType).length > 0) {
            // If so, increment the name
            desiredItemName = baseName + separateStr + index;
            index++;
        }

        return desiredItemName;
    }

    // region Markers
    // ------------------ Markers ------------------

    /**
     * Gets the marker color string from a marker color number / Index
     * @param {Number} colorNum
     * @returns {string} The marker color string corresponding to the provided color number.
     */
    pub.getMarkerColorString_fromNumber = function(colorNum) {
        // Marker color must be represented as the index of the color in the marker panel
        switch (colorNum) {
            case 0:
                return "Green";
            case 1:
                return "Red";
            case 2:
                return "Purple";
            case 3:
                return "Orange";
            case 4:
                return "Yellow";
            case 5:
                return "White";
            case 6:
                return "Blue";
            case 7:
                return "Cyan";
            default:
                return "Unknown";
        }
    }

    /**
     * Gets the marker color string from a Marker object
     * @param {Marker} marker
     * @returns {string} 
     */
    pub.getMarkerColorString = function(marker) {
        var markerColorIndex = marker.getColorByIndex() 
        return ThioUtils.getMarkerColorString_fromNumber(markerColorIndex);
    }

    /**
     * Gets the name of the name of the marker which takes up the most time within the specified time range in the sequence
     * @param {Time|Number|string} start The start time of the range
     * @param {Time|Number|string} end The end time of the range
     * @param {Sequence=} sequence Optional: The sequence to use. If not provided, will use the active sequence. 
     * @returns {Marker|null} The name of the predominant marker, or null if none found.
     */
    pub.getPredominantMarker_ForTimeRange = function(start, end, sequence) {
        var startTime = ThioUtils.makeTimeObjUniversal(start)
        var endTime = ThioUtils.makeTimeObjUniversal(end)
        var currSequence = ThioUtils.checkOrGetActiveSequence(sequence)

        if (typeof currSequence === 'undefined' || currSequence === undefined || currSequence === null) {
            return null
        }

        // Get the markers within the in out region
        if (currSequence.markers.numMarkers > 0) {
            var markers = currSequence.markers
            var maxMarker = null // The marker that encompasses the largest percentage of the time range
            var maxMarkerPercent = -1 // The precentage of the time range that maxMarker takes up

            for (var i = 0; i < markers.numMarkers; i++) {
                var marker = markers[i]
                var markerStartTime = marker.start
                var markerEndTime = marker.end

                // Check if any part of the marker is within the in-out range. 
                if (markerEndTime.seconds > markerStartTime.seconds) { // Only count markers that have a duration

                    if (markerEndTime.seconds > startTime.seconds && markerStartTime.seconds < endTime.seconds) {
                        // Calculate the overlap duration
                        var overlapStart = Math.max(markerStartTime.seconds, startTime.seconds)
                        var overlapEnd = Math.min(markerEndTime.seconds, endTime.seconds)
                        var overlapDuration = overlapEnd - overlapStart
                        var inOutDuration = endTime.seconds - startTime.seconds
                        var overlapPercent = overlapDuration / inOutDuration
                        // Check if this marker has the highest overlap percentage
                        if (overlapPercent > maxMarkerPercent) {
                            maxMarkerPercent = overlapPercent;
                            maxMarker = marker
                        }
                    }

                }
            }

            // If an elegible marker was found
            if (maxMarker !== null) {
                return maxMarker
            } else {
                return null
            }
        }

        return null // Fallback return
    }

    /**
     * Gets all markers at a specific time in the timeline.
     * @param {Time|Number|string=} time Optional: The specific timeline time to check the markers. If not specified, uses the current playhead time.
     * @param {Sequence=} sequence Optional: The sequence to use. If not provided, will use the active sequence.
     * @returns {Marker[]|null} An array of markers found at the current time. May be empty if none were found. Null if problem.
     */
    pub.getMarkersAtTime = function(time, sequence) {
        var timeToCheck = ThioUtils.checkOrGetCurrentTime(time)
        var sequenceToCheck = ThioUtils.checkOrGetActiveSequence(sequence)
        var foundMarkers = []

        if (typeof sequenceToCheck === 'undefined' || sequenceToCheck === undefined || sequenceToCheck === null) {
            return null
        }

        if (sequenceToCheck.markers.numMarkers > 0) {
            var sequenceMarkers = sequenceToCheck.markers

            for (var i = 0; i < sequenceMarkers.numMarkers; i++) {
                var marker = sequenceMarkers[i]
                var markerStartTime = marker.start
                var markerEndTime = marker.end

                // If it's a point marker without duration, just check if it's equal. Use ticks instead of seconds because of weird javascript rounding.
                if (markerEndTime.ticks === markerStartTime.ticks && markerStartTime.ticks === timeToCheck.ticks) {
                    foundMarkers.push(marker)
                // If it has a duration, check if the time is within the start and end times
                } else if (timeToCheck.seconds <= markerEndTime.seconds && timeToCheck.seconds >= markerStartTime.seconds) {
                    foundMarkers.push(marker)
                }
            }
        }
        return foundMarkers
    }

    // region Utility
    // ------------------ Utility ------------------ 
    /**
     * Gets the first available file name path in a folder by appending an incrementing number if the desired file name already exists.
     *
     * @overload
     * @param {File} desiredFileName File object for the desired file location.
     * @param {undefined} [folderPath] Not used in this overload; the folder is taken from the File object.
     * @return {string} The full file path of the first available file name
     *
     * @overload
     * @param {string} desiredFileName The desired file name with extension (not an absolute path).
     * @param {string} folderPath The folder path to check within, since desiredFileName is not a File object.
     * @return {string} The full file path of the first available file name
     *
     * @param {string|File} desiredFileName
     * @param {string=} folderPath
     * @return {string}
     */
    pub.getFirstAvailableFileNamePath = function (desiredFileName, folderPath) {
        var fileExt;
        var fileNameStem;
        var outputPath;

        if (desiredFileName instanceof File) {
            var strName = desiredFileName.displayName
            var lastDotIndex = strName.lastIndexOf(".")
            fileNameStem = strName.substring(0, lastDotIndex)
            fileExt = strName.substring(lastDotIndex + 1)

            folderPath = desiredFileName.parent.fsName;
            outputPath = desiredFileName.fsName;
        } else {
            // Get the file name's stem by splitting off the extension
            var lastDotIndex = desiredFileName.lastIndexOf(".")
            fileNameStem = desiredFileName.substring(0, lastDotIndex)
            fileExt = desiredFileName.substring(lastDotIndex + 1)
            outputPath = folderPath + "\\" + desiredFileName
        }

        // Check if the file already exists and check whether to rename it or not
        if (new File(outputPath).exists) {
            // Ask the user if they want to overwrite the existing file
            var counter = 2
            var baseOutputPath = folderPath + "\\" + fileNameStem;

            // Check for existing files and modify the output path if necessary
            while (new File(outputPath).exists) {
                outputPath = baseOutputPath + "_" + counter + "." + fileExt;
                counter++
            }
        }
        return outputPath
    }

    /**
     * Separate the file name stem and extension for a file.
     * @param {File} file 
     * @returns {ThioUtils.FileNameParts} 
     */
    pub.getFileNameStemAndExtension = function(file) {
        var fileExt;
        var fileNameStem;

        var strName = file.displayName
        var lastDotIndex = strName.lastIndexOf(".")
        fileNameStem = strName.substring(0, lastDotIndex)
        fileExt = strName.substring(lastDotIndex + 1)

        return {
            stem: fileNameStem,
            extension: fileExt
        }
    }

    /**
     * Equivalent of startsWith
     * @param {string} str The string to check
     * @param {string} prefix The prefix to look for
     * @param {boolean=} [caseSensitive=false] Whether the check should be case sensitive (default: false)
     * @return {boolean} True if str starts with prefix, false otherwise.
     */
    pub.startsWith = function (str, prefix, caseSensitive) {
        if (typeof caseSensitive === 'undefined' || caseSensitive === undefined || caseSensitive === null) {
            caseSensitive = false;
        }
        
        if (caseSensitive) {
            return str.slice(0, prefix.length) === prefix;
        } else {
            return str.toLowerCase().slice(0, prefix.length) === prefix.toLowerCase();
        }
    };

    /**
     * 
     * @param {string} str The string to search within
     * @param {string} substring The string to search for in the string
     * @param {boolean=} caseSensitive Whether the search should be case sensitive (default: false)
     */
    pub.containsStr = function(str, substring, caseSensitive) {
        if (typeof caseSensitive === 'undefined' || caseSensitive === undefined || caseSensitive === null) {
            caseSensitive = false;
        }

        if (caseSensitive) {
            return str.indexOf(substring) !== -1;
        } else {
            return str.toLowerCase().indexOf(substring.toLowerCase()) !== -1;
        }
    };

    /**
     * Gets the file name of the original script that called a chain of scripts.
     * @returns {string|null} The file name of the calling script, or "unknown" if it can't be determined.
     */
    pub.getCallingFile = function() {
        try {
            var stack = $.stack;
            var lines = stack.split('\n');

            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                // Look for .jsx files, excluding eval contexts
                if (line.indexOf('.jsx') !== -1 && line.indexOf('eval') === -1) {
                    // Updated regex to handle brackets and extract just the filename
                    var match = line.match(/\[?([^\\\/\[\]]+\.jsx)\]?/);
                    if (match && match[1]) {
                        return match[1];
                    }
                }
            }
            return null;
        } catch (e) {
            $.writeln("Error: " + e);
            return null
        }
    };

    /**
     * Checks if the current script is being called from another script by comparing the calling file to this file.
     * @param {string} filePath MUST pass in $.fileName.
     */
    pub.isScriptCalledFromAnotherScript = function(filePath) {
        var initialScriptName = ThioUtils.getCallingFile();
        var checkedFileName = ThioUtils.pathToFileName(filePath);
        var result = (initialScriptName !== null && initialScriptName !== checkedFileName);
        return result;
    }

    /**
     * Takes a path and just returns the file name part
     * @param {string} path 
     * @return {string} The file name extracted from the path
     */
    pub.pathToFileName = function (path) {
        // Replace all backslashes with forward slashes first, then split
        var normalizedPath = path.replace(/\\/g, '/');
        var parts = normalizedPath.split('/');
        return parts[parts.length - 1];
    };

    /**
     * The maximum safe integer in JavaScript (2^53 - 1).
     * Re-defined here for compatibility with older ExtendScript (ES3/ES5) environments.
     * @type {number}
     */
    pub.MAX_SAFE_INTEGER = 9007199254740991

    /**
     * Displays a simple alert message to confirm that ThioUtils.jsx is successfully included and accessible.
     * @returns {void}
     */
        pub.testUtilsAlert = function () {
        alert("Hello from inside Thio (ThioUtils.jsx)!");
    };

    /**
     * Checks if a variable is null, undefined, or an empty string.
     * @param {any|null|undefined} variable 
     * @returns {boolean}
     */
    pub.isNullOrEmptyStr = function(variable) {
        if (typeof variable === 'undefined' || variable === undefined || variable === null || (typeof variable === 'string' && variable === '')) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if a variable is null or undefined.
     * @param {any|null|undefined} variable 
     * @returns {boolean}
     */
    pub.isNullOrUndefined = function(variable) {
        if (typeof variable === 'undefined' || variable === undefined || variable === null) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if a variable is undefined.
     * @param {any|null|undefined} variable 
     * @returns {boolean}
     */
    pub.isUndefined = function(variable) {
        if (typeof variable === 'undefined' || variable === undefined) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if a variable is defined (not null or undefined).
     * @param {any|null|undefined} variable 
     * @returns {boolean}
     */
    pub.isDefined = function(variable) {
        return !ThioUtils.isUndefined(variable);
    }

    /**
     * Write a line to Premiere's Events panel (Window > Events), which also shows a toast at the bottom right.
     * @param {string} message  Text to show.
     * @param {"info"|"warn"|"warning"|"error"|string=} [level]  "info" (default), "warn"/"warning", or "error".
     * @param {string} [prefix] Prepended to the message, e.g. "[Audit] ". The Events panel is shared with Premiere and other panels, so tagging your lines makes them findable.  
     * @param {boolean=} [echo]  Whether to also print to debug console. Default true.
     * @returns {string} The text that was sent.
     */
    pub.logEvent = function(message, level, prefix, echo) {
        if (typeof prefix === 'undefined' || prefix === undefined || prefix === null || prefix === 'null' || prefix === '') {
            prefix = ""
        }

        if (typeof echo === 'undefined' || echo === undefined || echo === null) {
            echo = true
        }

        var text = prefix + message;
        var type = "info";

        if (typeof level === 'undefined' || level === undefined || level === null || level === 'null' || level === '') {
            type = "info";
        } else {
            level = level.toLowerCase();

            if (level === "warn" || level === "warning") {
                type = "warning";
            } else if (level === "info") {
                type = "info"
            } else if (level === "error") {
                type = "error";
            }
        }

        try {
            app.setSDKEventMessage(text, type);
        } catch (e) {
            $.writeln("Error sending event log: \n" + e)
        }

        if (echo !== false) {
            $.writeln(text);
        }

        return text;
    };

    // region ThioUtils.dll
    // ================================ Functions That Utilize ThioUtils.dll ================================

    /**
     * @returns {boolean} True if ThioUtils is loaded, false otherwise.
     */
    pub.isThioUtilsLibLoaded = function () {
        // Check if the ThioUtils library is loaded and available
        return (typeof ThioUtilsLib !== 'undefined' && ThioUtilsLib !== null);
    };

    /**
     * @returns {void}
     */
    pub.unloadThioUtilsLib = function () {
        if (typeof ThioUtilsLib !== 'undefined' && ThioUtilsLib != null && ThioUtilsLib != undefined) {
            ThioUtilsLib.unload()
        }
    };

    /**
     * Plays a system error sound if the external ThioUtils library is loaded, or shows an alert otherwise.
     * Useful for notifying the user of errors or important events without interrupting with an alert box.
     * @param {string|null} fallbackAlertMessage
     */
    pub.playErrorBeep = function (fallbackAlertMessage) {
        // If the message fallback wasn't provided at all, use a placeholder message. If it's null, pass along null.
        if (typeof fallbackAlertMessage === 'undefined' || fallbackAlertMessage === undefined) {
            fallbackAlertMessage = "An error occurred while running the script. Error was not specified.";
        }

        ThioUtils.playSystemSoundID(0x00000010, fallbackAlertMessage);
    };

    /**
     * Plays a system success/OK sound if the external ThioUtils library is loaded, or shows an alert otherwise.
     * @param {string|null=} fallbackAlertMessage 
     */
    pub.playSuccessBeep = function (fallbackAlertMessage) {
        if (typeof fallbackAlertMessage === 'undefined' || fallbackAlertMessage === undefined || fallbackAlertMessage === null ||  (typeof fallbackAlertMessage === 'string' && fallbackAlertMessage === '')) {
            fallbackAlertMessage = null;
        }
        ThioUtils.playSystemSoundID(0x00000000, fallbackAlertMessage);
    };

    /**
     * Plays a system sound if the external ThioUtils library is loaded, or shows an alert otherwise.
     * Useful for notifying the user of errors or important events without interrupting with an alert box.
     * @param {number} id 
     * @param {string|null=} fallbackAlertMessage 
     */
    pub.playSystemSoundID = function(id, fallbackAlertMessage) {
        if (ThioUtils.isThioUtilsLibLoaded()) {
            // 0x00000000 = Default OK
            // 0x00000010 = Default Error
            // It supports any that are defined here but many are the same:
            // https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messagebeep
            ThioUtilsLib.systemBeep(id);
        } else if (typeof fallbackAlertMessage === 'undefined' || fallbackAlertMessage === undefined || fallbackAlertMessage === null || (typeof fallbackAlertMessage === 'string' && fallbackAlertMessage === '')) {
            // Don't show an alert if no fallback message was provided
        } else {
            alert(fallbackAlertMessage);
        }
    };

    /**
     * Play a system sound by name if the external ThioUtils library is loaded, or shows an alert otherwise.
     * @param {string} aliasOrFilename The sound alias or filename to play. Common aliases include "SystemAsterisk", "SystemExclamation", "SystemHand", "SystemQuestion", etc.
     *                                 Or a file name within the windows media directory.
     * @param {string=} fallbackAlertMessage Optional: If provided, will show an alert with this message if ThioUtilsLib is not loaded.
     */
    pub.playSystemSound = function(aliasOrFilename, fallbackAlertMessage) {
        if (ThioUtils.startsWith(aliasOrFilename, "C:\\Windows\\Media\\")) {
            // It's a full path, trim it off. It needs to be the media path anyway but expects just the relative path
            aliasOrFilename = aliasOrFilename.replace("C:\\Windows\\Media\\", "");
        }

        if (ThioUtils.isThioUtilsLibLoaded()) {
            ThioUtilsLib.playSoundAlias(aliasOrFilename);
        } else if (typeof fallbackAlertMessage === 'undefined' || fallbackAlertMessage === undefined || fallbackAlertMessage === null || (typeof fallbackAlertMessage === 'string' && fallbackAlertMessage === '')) {
            // Don't show an alert if no fallback message was provided
        } else {
            alert(fallbackAlertMessage);
        }
    };

    /**
     * Copy the given text to the clipboard using the ThioUtils library if available.
     * @param {string} text
     */
    pub.copyToClipboard = function (text) {
        if (ThioUtils.isThioUtilsLibLoaded()) {
            var copyResult = ThioUtilsLib.copyTextToClipboard(text);
            if (copyResult === 0) {
                return true; // Return true if copy was successful
            }
        } else {
            $.writeln("ThioUtils.dll not loaded. Can't use copyToClipboard function.");
            alert("ThioUtils.dll not loaded. Can't use copyToClipboard function. Please ensure ThioUtils.jsx is included and ThioUtils.dll is available.");
        }

        return false; // Return false if copy failed or ThioUtils is not loaded
    };

    /**
     * Get the text from the clipboard.
     * @returns {string|null}
     */
    pub.getClipboardText = function() {

        if (ThioUtils.isThioUtilsLibLoaded()) {
            var textToReturn = ThioUtilsLib.getClipboardText();
            return textToReturn
        } else {
            $.writeln("ThioUtils.dll not loaded. Can't use copyToClipboard function.");
            alert("ThioUtils.dll not loaded. Can't use copyToClipboard function. Please ensure ThioUtils.jsx is included and ThioUtils.dll is available.");
        }
        return null
    }

    // region Categories
    // -----------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------- Categories --------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------
    // Subcategories through which functions can also optionally be accessed, such as ThioUtils.checks.whatever

    /**
     * @namespace checks
     * @memberof ThioUtils
     * @description Functions for checking various conditions and states
     */
    pub.checks = {
        checkIfAnyClipsInTimeRangeOnTrack: pub.checkIfAnyClipsInTimeRangeOnTrack,
        checkIfPlayheadIsInClip: pub.checkIfPlayheadIsInClip,
        checkWarnDuration: pub.checkWarnDuration,
        doesIntArrayAContainIntB: pub.doesIntArrayAContainIntB,
        doesAContainTrackB: pub.doesAContainTrackB,
        isClipASameAsClipB: pub.isClipASameAsClipB,
        checkIfClipsShareTimeRange: pub.checkIfClipsShareTimeRange,
    };

    /**
     * @namespace cog
     * @memberof ThioUtils
     * @description Functions for automatically getting the active/selected objects unless provided
     */
    pub.cog = {
        checkOrGetActiveSequence: pub.checkOrGetActiveSequence,
        checkOrGetSelectedClips: pub.checkOrGetSelectedClips,
        checkOrGetCurrentTime: pub.checkOrGetCurrentTime,
        checkOrGetSelectedProjectItem: pub.checkOrGetSelectedProjectItem
    };

    /**
     * @namespace project
     * @memberof ThioUtils
     * @description Related to general project items including the project panel.
     */
    pub.project = {
        getBinByName: pub.getBinByName,
        getBinByPath: pub.getBinByPath,
        getItemParentBin: pub.getItemParentBin,
        getItemInBinByName: pub.getItemInBinByName,
        getItemByPath: pub.getItemByPath,
        getProjectItemLabelColorIndex: pub.getProjectItemLabelColorIndex,
        setProjectItemLabelColor: pub.setProjectItemLabelColor,
        getFirstAvailableProjectItemName: pub.getFirstAvailableProjectItemName,
        getProjectFolderPath: pub.getProjectFolderPath,
        getProjectName: pub.getProjectName,
    };

    /**
     * @namespace time
     * @memberof ThioUtils
     * @description Functions for working with time, ticks, and timecode
     */
    pub.time = {
        ticksToSeconds: pub.ticksToSeconds,
        ticksToTimeObject: pub.ticksToTimeObject,
        secondsToTimeObject: pub.secondsToTimeObject,
        makeTimeObjUniversal: pub.makeTimeObjUniversal,
        singleFrameTimeObject: pub.singleFrameTimeObject,
        convertTimeObjectToNearestFrame: pub.convertTimeObjectToNearestFrame,
        getTimecodeString_FromTimeObject: pub.getTimecodeString_FromTimeObject,
        framesToTicks: pub.framesToTicks,
        ConvertTimelineTicksToSourceTicks: pub.ConvertTimelineTicksToSourceTicks,
        ConvertTimelineTimetoSourceTime: pub.ConvertTimelineTimetoSourceTime,
        ConvertSourceTimeToTimelineTime: pub.ConvertSourceTimeToTimelineTime,
        addTime: pub.addTime,
        subtractTime: pub.subtractTime,
        getFrameRateObj_FromSequence: pub.getFrameRateObj_FromSequence,
        timecodeStringToTimeObj: pub.timecodeStringToTimeObj,
    };

    /**
     * @namespace clips
     * @memberof ThioUtils
     * @description Functions for working with clips and track items
     */
    pub.clips = {
        getTopTrackItemAtPlayhead: pub.getTopTrackItemAtPlayhead,
        getFirstAvailableTrackIndex: pub.getFirstAvailableTrackIndex,
        GetAllVideoClipsUnderPlayhead_AsObjectArray: pub.GetAllVideoClipsUnderPlayhead_AsObjectArray,
        GetSelectedVideoClips: pub.GetSelectedVideoClips,
        getSelectedClipInfoQE: pub.getSelectedClipInfoQE,
        getSelectedClipInfoVanilla: pub.getSelectedClipInfoVanilla,
        getQEClipFromVanillaClip: pub.getQEClipFromVanillaClip,
        getSortedClipsArray: pub.getSortedClipsArray,
        getIntrinsicMediaType: pub.getIntrinsicMediaType,
        getAllClipsInSequence: pub.getAllClipsInSequence,
        getQEClipsArrayFromVanillaClips: pub.getQEClipsArrayFromVanillaClips,
        getClipInfoQE: pub.getClipInfoQE
    };

    /**
     * @namespace edit
     * @memberof ThioUtils
     * @description Functions for editing operations
     */
    pub.edit = {
        fillFrameWithClip: pub.fillFrameWithClip,
        moveClips: pub.moveClips,
        trimClipStart: pub.trimClipStart,
        trimClipEnd: pub.trimClipEnd,
        removeMotionKeyframes: pub.removeMotionKeyframes,
        getOrUpdateMogrtText: pub.getOrUpdateMogrtText,
        rippleDeleteEmptySpaceOnTrack: pub.rippleDeleteEmptySpaceOnTrack
    }

    /**
     * @namespace effects
     * @memberof ThioUtils
     * @description Functions for working with effects and components
     */
    pub.effects = {
        GetEffectComponent: pub.GetEffectComponent,
        getEffectComponentCollection: pub.getEffectComponentCollection,
        GetEffectComponentArray: pub.GetEffectComponentArray,
        GetEffectComponentPropertyArray: pub.GetEffectComponentPropertyArray,
        GetEffectComponentProperty: pub.GetEffectComponentProperty,
        GetEffectComponentAndProperty: pub.GetEffectComponentAndProperty,
        checkHasEffectComponentInstance: pub.checkHasEffectComponentInstance
    };

    /**
     * @namespace transitions
     * @memberof ThioUtils
     * @description Functions for working with clip transitions
     */
    pub.transitions = {
        addTransitionOnEnds: pub.addTransitionOnEnds,
        getTransitionsForSelectedClips: pub.getTransitionsForSelectedClips,
        getClipSourceRange_WithTransitions: pub.getClipSourceRange_WithTransitions,
        getClipTimelineRange_WithoutTransitions: pub.getClipTimelineRange_WithoutTransitions,
        getClipTimelineRanges_WithoutTransitions: pub.getClipTimelineRanges_WithoutTransitions
    }

    /**
     * @namespace sequences
     * @memberof ThioUtils
     * @description Functions for working with sequences
     */
    pub.sequences = {
        getAllQESequencesInProject: pub.getAllQESequencesInProject,
        getSelectedSequencesArray: pub.getSelectedSequencesArray,
        getQESequenceFromVanilla: pub.getQESequenceFromVanilla,
        getVanillaSequenceFromQE: pub.getVanillaSequenceFromQE,
        getSelectedSequencesQE: pub.getSelectedSequencesQE,
        clearSelections: pub.clearSelections,
        getSequenceFromProjectItem: pub.getSequenceFromProjectItem,
        getSequenceFromClip: pub.getSequenceFromClip,
        lockAllTracksInSequence: pub.lockAllTracksInSequence,
        unlockAllTracksInSequence: pub.unlockAllTracksInSequence,
        setTargetedTracksFromSelectedClips: pub.setTargetedTracksFromSelectedClips,
        getTrackIndexesWithSelectedClips: pub.getTrackIndexesWithSelectedClips,
        makeSequenceCopy: pub.makeSequenceCopy,
        getLatestClipEndTimeInSequence: pub.getLatestClipEndTimeInSequence,
    }

    /**
     * @namespace markers
     * @memberof ThioUtils
     * @description Functions for working with markers
     */
    pub.markers =  {
        getMarkerColorString_fromNumber: pub.getMarkerColorString_fromNumber,
        getMarkerColorString: pub.getMarkerColorString,
        getPredominantMarker_ForTimeRange: pub.getPredominantMarker_ForTimeRange,
        getMarkersAtTime: pub.getMarkersAtTime,
    }

    /**
     * @namespace util
     * @memberof ThioUtils
     * @description Utility functions
     */
    pub.util = {
        convertToArray: pub.convertToArray,
        getResolutionFromProjectItem: pub.getResolutionFromProjectItem,
        getCurrentScriptDirectory: pub.getCurrentScriptDirectory,
        joinPath: pub.joinPath,
        relativeToFullPath: pub.relativeToFullPath,
        getFirstAvailableFileNamePath: pub.getFirstAvailableFileNamePath,
        getFileNameStemAndExtension: pub.getFileNameStemAndExtension,
        startsWith: pub.startsWith,
        containsStr: pub.containsStr,
        getCallingFile: pub.getCallingFile,
        pathToFileName: pub.pathToFileName,
        isNullOrEmptyStr: pub.isNullOrEmptyStr,
        isNullOrUndefined: pub.isNullOrUndefined,
        isUndefined: pub.isUndefined,
        isDefined: pub.isDefined,
        logEvent: pub.logEvent,
    };

    /**
     * @namespace system
     * @memberof ThioUtils
     * @description System-level functions
     */
    pub.system = {
        isThioUtilsLibLoaded: pub.isThioUtilsLibLoaded,
        unloadThioUtilsLib: pub.unloadThioUtilsLib,
        playErrorBeep: pub.playErrorBeep,
        playSuccessBeep: pub.playSuccessBeep,
        playSystemSoundID: pub.playSystemSoundID,
        playSystemSound: pub.playSystemSound,
        copyToClipboard: pub.copyToClipboard,
        getClipboardText: pub.getClipboardText
    };

    // /**
    //  * @namespace alias
    //  * @memberof ThioUtils
    //  * @description Commonly or semi-commonly used used deep referenced objects that are easy to forget.
    //  */
    // pub.alias = {

    // }

   
    // --------------------------------------------------------------------------------------------
    // Return the public API object, making it available as 'ThioUtils'
    return pub; 


})(); // Execute the IIFE to create the ThioUtils object
