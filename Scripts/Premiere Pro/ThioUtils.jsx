// ThioUtils.jsx - Utility functions for Premiere Pro Extendscript
// Updated - 12/5/25
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
// function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }
// try { eval("#include '" + relativeToFullPath("ThioUtils.jsx") + "'"); }
// catch(e) {
//     try { var e1=e; eval("#include '" + relativeToFullPath("includes/ThioUtils.jsx") + "'"); } // Check Utils folder
//     catch(e) { var e2=e; try { eval("#include '" + relativeToFullPath("../ThioUtils.jsx") + "'"); } // Check parent directory
//     catch (e) { var e3=e; try { eval("#include '" + relativeToFullPath("../includes/ThioUtils.jsx") + "'"); } // Check parent includes folder
//     catch (e) { var e4=e; alert("Could not find ThioUtils.jsx in current dir, includes folder, or parent dir." + "\n\nAll Attempt Errors: \n"+e1+"\n"+e2+"\n"+e2+"\n"+e3+"\n"+e4); } // Return optional here, if you're within a main() function
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
        $.writeln("Error including ThioUtilsLib.jsx. " + e.toString());
        alert("Error -- Found ThioUtilsLib.jsx but failed to load it. Some functionality will not be available. \n\nError Message:\n" + e.toString());
    }
}
// Required - es5-shim.js
var incEs5Shim = includeFile("es5-shim.js", true, "You can find this file in the Scripts/include folder of my repo (https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools). Put the file next to the ThioUtils.jsx script or in a folder called 'includes' or 'include'.")
if (incEs5Shim !== null) {
    try {
        eval(incEs5Shim);
    } catch (e) {
        $.writeln("Error including es5-shim.js. " + e.toString());
        alert("Error -- Found ThioUtilsLib.jsx but failed to load it. Some functionality will not be available. \n\nError Message:\n" + e.toString());
    }
}

// -------------------------------------------------------

app.enableQE();

var ThioUtils = (function () {
    // ======================== Public API Object ========================
    var pub = {}; // Public object

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
        var topTrackItem = null;
        var highestTrackIndex = -1;

        if (typeof returnAsObject === 'undefined' || returnAsObject === undefined || returnAsObject === null) {
            returnAsObject = false; // Default to returning the track index
        }

        // Make a dictionary with clips and their corresponding track index
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
     * @returns {Number|null}
     */
    pub.getFirstAvailableTrackIndex = function(startTime, endTime, minTrackIndex) {
        var seq = app.project.activeSequence;
        var targetStart, targetEnd;
        
        if (typeof minTrackIndex === 'undefined' || minTrackIndex === undefined || minTrackIndex === null) {
            minTrackIndex = 0;
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
            return;
        }

        var originalNumTracks = seq.videoTracks.numTracks;
        for (var i = minTrackIndex; i < seq.videoTracks.numTracks; i++) {
            if (seq.videoTracks[i].isLocked()) {
                continue; // Consider locked tracks not available
            }

            if (this.checkIfAnyClipsInTimeRangeOnTrack(targetStart, targetEnd, i, "video") === false) {
                return i; // Return the first available track index
            }
        }
        // If no available track found, add one with the QE DOM
        var QESeq = this.getQESequenceFromVanilla(seq)
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
            $.writeln("Error processing projectItem metadata: " + e.toString());
        }
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
            $.writeln("Error processing projectItem metadata: " + e.toString());
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
            return;
        }

        return selectedClips;
    };

    /**
     * Gets all the sequences in the current project as an array of QESequence objects
     * @returns {QESequence[]}
     */
    pub.getAllQESequencesInProject = function () {
        // Get the items in the bin, and if any of them are also bins, recursively get the rest
        /**
         * @param {Number} numBins 
         * @returns {QEProjectItemContainer[]}
         */
        function getBins(numBins) {
            var binArray = [];
            for (var i = 0; i < numBins; i++) {
                var currBin = qe.project.getBinAt(i);
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
            var binArray = [];
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
            for (var i = 0; i < numSeq; i++) {
                try {
                    var seq = binObj.getSequenceAt(i);
                    seqArray.push(seq);
                } catch (ex) {
                    $.writeln("Error getting sequence #" + i)
                }
            }
            return seqArray;
        }

        // -------------------------------------------------

        qe.project.flushCache(); // Needed to update current number of bins and such
        var numSeq = qe.project.numSequences;
        var numBins = qe.project.numBins;

        // First try and get all the sequences using getSequenceAt in the root
        var QESequenceArray = [];
        for (var i = 0; i < numSeq; i++) {
            try {
                var seq = qe.project.getSequenceAt(i);
                QESequenceArray.push(seq);
            } catch(ex) {
                $.writeln("Error getting sequence #" + i)
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
     * @returns {QESequence|null}
     */
    pub.getQESequenceFromVanilla = function(vanillaSequence) {
        var allQESequences = ThioUtils.getAllQESequencesInProject();
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
     * Retrieves all the components of a given clip
     * @param {TrackItem} clipObj The clip object to retrieve components from.
     * @param {string=} effectName Optional: The name of a specific effect to filter by.
     * @param {boolean=} filterExact Optional: If true, will only match effects that fully match the effectName variable (not case sensitive), otherwise will match any that contain the string.
     * @returns {Component[]} An array of Component objects representing all components of the clip.
     */
    pub.GetEffectComponentArray = function(clipObj, effectName, filterExact) {
        var filterBy = "";
        if (typeof effectName !== 'undefined' && effectName != null && effectName != undefined && effectName != "") {
            filterBy = effectName.toLowerCase();
        }
        if (typeof filterExact === 'undefined' || filterExact === undefined || filterExact === null) {
            filterExact = false;
        }      

        // If no components just return empty right away
        var componentArray = [];
        if (!clipObj || !clipObj.components || clipObj.components.length === 0) {
            return componentArray
        }
        
        for (var i = 0; i < clipObj.components.numItems; i++) {
            var currClip = clipObj.components[i];

            // Apply a filter if there is one
            if (filterBy !== "") {
                if (filterExact === true && currClip.displayName.toLowerCase() === filterBy.toLowerCase()) {
                    componentArray.push(currClip);
                } else if (filterExact === false && ThioUtils.containsStr(currClip.displayName, filterBy, false)) {
                    componentArray.push(currClip);
                }
            // No filter, get them all
            } else {
                componentArray.push(currClip);
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
        var component = this.GetEffectComponent(clipObj, effectName);
        if (!component) {
            alert("Effect '" + effectName + "' not found on the selected clip.");
            return null;
        }

        // Get the property from the component
        var properties = this.GetEffectComponentPropertyArray(component, effectPropertyName);
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
        var components = this.GetEffectComponentArray(clipObj)

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
     * @return {{ComponentObj: ComponentParam, text: string}|null} Returns an object with the updated Component property and the new text value, or null if there was an error.
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
                currentValueObj = JSON.parse(currentValue);
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
                textProperty.setValue(JSON.stringify(currentValueObj), 1);
            }

            return { ComponentObj: textProperty, text: currentValueObj.textEditValue }

        } catch (e) {
            {alert("Error: " + e.message);}
            $.writeln("Error in process: " + e.message); // Debug
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

                    var motionProperties = ThioUtils.GetEffectComponentPropertyArray(component, null);
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
    pub.GetPlayheadPosition_WithinSource_AsTicks = function (arg1, arg2, arg3) {
        var clip;
        var useAudioTrack;
        var noAlertsOnError;
        var playheadTimelinePositionTicks = null;

        // ---------- Overload checking ------------
        if (typeof arg1 === 'object' && arg1 !== null && typeof arg1.mediaType !== 'undefined') {
            // Signature: (clip, useAudioTrack, noAlertsOnError)
            clip = arg1;
            noAlertsOnError = arg3;
            // Handle whether they provided the playhead position or not
            if (typeof arg2 === 'undefined' || arg2 === undefined || arg2 === null) {
                playheadTimelinePositionTicks = null;
            } else {
                playheadTimelinePositionTicks = arg2;
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

        return this.ConvertTimelineTicksToSourceTicks(selectedClip, playheadTimelinePositionTicks);
    };


    /**
     * Trims the start of a clip without moving the remaining part of the clip.
     * @param {TrackItem} clip 
     * @param {Number} trimSeconds The number of seconds to trim from the start of the clip. A negative value will extend the clip earlier.
     */
    pub.trimClipStart = function (clip, trimSeconds) {
        var sequenceFrameRate = new FrameRate();
        sequenceFrameRate.ticksPerFrame = Number(app.project.activeSequence.timebase); // Set the current frame rate to the sequence timebase

        var sourceFPS = clip.projectItem.getFootageInterpretation().frameRate; // Get the source frame rate from the clip's project item
        var sourceFrameRate = FrameRate.createWithValue(sourceFPS); // Create a FrameRate object with the source frame rate

        var inPointTimeObj = clip.inPoint;
        inPointTimeObj.seconds += trimSeconds; // Shift the inpoint back by the specified amount
        var newInPointTickTime = TickTime.createWithSeconds(inPointTimeObj.seconds); // Create a new TickTime object with the updated inpoint seconds
        newInPointTickTime = newInPointTickTime.alignToNearestFrame(sourceFrameRate); // Align to the nearest frame based on the source frame rate, because we're working within the clip
        inPointTimeObj.ticks = newInPointTickTime.ticks; // Update the inpoint seconds to the aligned time

        clip.inPoint = inPointTimeObj; // Set the new inpoint

        var startTimeObj = clip.start;
        startTimeObj.seconds += trimSeconds; // Shift the start time back by the specified amount
        var startTimeTickTime = TickTime.createWithSeconds(startTimeObj.seconds); // Create a new TickTime object with the updated start time seconds
        startTimeTickTime = startTimeTickTime.alignToNearestFrame(sequenceFrameRate); // Align to the nearest frame based on the sequence frame rate, because we're working within the sequence timeline
        startTimeObj.ticks = startTimeTickTime.ticks; // Update the start time seconds to the aligned time

        clip.start = startTimeObj; // Set the new start time
    };

    /**
     * Trims the end of a clip without moving the remaining part of the clip.
     * @param {TrackItem} clip 
     * @param {Number} trimSeconds The number of seconds to trim from the end of the clip. A negative value will extend the clip further.
     */
    pub.trimClipEnd = function (clip, trimSeconds) {
        var sequenceFrameRate = new FrameRate();
        sequenceFrameRate.ticksPerFrame = Number(app.project.activeSequence.timebase); // Set the current frame rate to the sequence timebase

        var sourceFPS = clip.projectItem.getFootageInterpretation().frameRate; // Get the source frame rate from the clip's project item
        var sourceFrameRate = FrameRate.createWithValue(sourceFPS); // Create a FrameRate object with the source frame rate

        var outPointTimeObj = clip.outPoint;
        outPointTimeObj.seconds -= trimSeconds; // Shift the outpoint forward by the specified amount
        var newOutPointTickTime = TickTime.createWithSeconds(outPointTimeObj.seconds); // Create a new TickTime object with the updated outpoint seconds
        newOutPointTickTime = newOutPointTickTime.alignToNearestFrame(sourceFrameRate); // Align to the nearest frame based on the source frame rate, because we're working within the clip
        outPointTimeObj.ticks = newOutPointTickTime.ticks; // Update the outpoint seconds to the aligned time

        clip.outPoint = outPointTimeObj; // Set the new outpoint

        var endTimeObj = clip.end;
        endTimeObj.seconds -= trimSeconds; // Shift the end time forward by the specified amount
        var endTimeTickTime = TickTime.createWithSeconds(endTimeObj.seconds); // Create a new TickTime object with the updated end time seconds
        endTimeTickTime = endTimeTickTime.alignToNearestFrame(sequenceFrameRate); // Align to the nearest frame based on the sequence frame rate, because we're working within the sequence timeline
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
            var scaleProp = motionComponent.properties.getParamForDisplayName("Scale");
            var positionProp = motionComponent.properties.getParamForDisplayName("Position");
            var anchorProp = motionComponent.properties.getParamForDisplayName("Anchor Point");

            var posValue = positionProp.getValue();
            var anchorValue = anchorProp.getValue();

            // Scale as needed to fill the frame
            var res = ThioUtils.getResolutionFromProjectItem(clipsArray[i]);
            // Get current sequence resolution
            var seq = parentSequence;
            var width = seq.frameSizeHorizontal;
            var height = seq.frameSizeVertical;

            if (res.x === -1 || res.y === -1) {
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
     */
    pub.AutoSpeedScaleExpand = function(clip, pixelVelocity, useExistingKeyframes, accountForCrop, silent) {
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

        // If not set to use existing keyframes use clip duration. Also if time varying is disabled.
        if (!useExistingKeyframes || !scaleProp.isTimeVarying()) {
            clipDurationSeconds = clip.duration.seconds;
            useExistingKeyframes = false; // Set to false in case we got here because isTimeVarying is false
        } else {
            var keyTimes = scaleProp.getKeys();
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
                return;
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
            scaleProp.setValueAtKey(keyTimes[0], startScale, true);
            scaleProp.setValueAtKey(keyTimes[1], endScale, true);
        } else {
            // Clear any existing keyframes by disabling and re-enabling time varying
            scaleProp.setTimeVarying(false);
            scaleProp.setTimeVarying(true);

            // SET THE TWO KEYFRAMES
            // --- Start Keyframes ---
            scaleProp.addKey(clip.inPoint);
            scaleProp.setValueAtKey(clip.inPoint, startScale, true);

            // --- End Keyframes ---
            // Create time object for time at a single frame prior to endpoint because otherwise if we line up the playhead to the keyframe it won't show the clip in the preview
            var endTimeObjToUse = new Time()
            endTimeObjToUse.ticks = (Number(clip.outPoint.ticks) - Number(ThioUtils.singleFrameTimeObject(sequence).ticks)).toString()

            scaleProp.addKey(endTimeObjToUse);
            scaleProp.setValueAtKey(endTimeObjToUse, endScale, true);
        }
    };


    /**
     * Check if there are any clips on the timeline in a time range on a specified video track.
     * @param {Time} startTimeObj
     * @param {Time} endTimeObj
     * @param {Number} trackIndex
     * @param {"video"|"audio"} mediaType
     * @returns {Boolean|TrackItem} Return the clip if one is in the range, otherwise false.
     */
    pub.checkIfAnyClipsInTimeRangeOnTrack = function (startTimeObj, endTimeObj, trackIndex, mediaType) {
        var activeSeq = app.project.activeSequence;
        if (!activeSeq) return false;
        if (mediaType !== "video" && mediaType !== "audio") {
            alert("Invalid media type specified. Use 'video' or 'audio'.");
            return false;
        }

        var trackObj = null;

        if (mediaType === "video") {
            trackObj = activeSeq.videoTracks[trackIndex];
            if (!trackObj) return false;
        } else if (mediaType === "audio") {
            trackObj = activeSeq.audioTracks[trackIndex];
            if (!trackObj) return false;
        }

        for (var i = 0; i < trackObj.clips.numItems; i++) {
            var clip = trackObj.clips[i];
            // Handle case where start and end are the same (point-in-time check)
            if (startTimeObj.ticks === endTimeObj.ticks) {
                // Check if the point is within the clip (inclusive of start, exclusive of end)
                if (Number(clip.start.ticks) <= Number(startTimeObj.ticks) && Number(clip.end.ticks) > Number(startTimeObj.ticks)) {
                    return clip;
                }
            } else {
                // Range overlap logic
                if (Number(clip.start.ticks) < Number(endTimeObj.ticks) && Number(clip.end.ticks) > Number(startTimeObj.ticks)) {
                    return clip;
                }
            }
        }

        return false; // No clips in the range
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
        var roundedTime = this.ticksToTimeObject(currentTicks);
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
            sortedClips = this.convertToArray(clips);
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
     * @returns {string} A formatted timecode string representing the time object.
     */
    pub.getTimecodeString_FromTimeObject = function (timeObj) {
        var frameRateTicks = app.project.activeSequence.timebase;
        var frameRateTimeObj = this.ticksToTimeObject(frameRateTicks);
        var videoDisplayFormat = app.project.activeSequence.getSettings().videoDisplayFormat;
        return timeObj.getFormatted(frameRateTimeObj, videoDisplayFormat).toString();
    };

    /**
     * Convert frames to ticks based on the sequence's frame rate.
     * @param {Number} frames
     * @returns {Number} The equivalent number of ticks for the given number of frames.
     */
    pub.framesToTicks = function (frames) {
        var frameRateTicks = app.project.activeSequence.timebase;
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
        var newTicks = this.ConvertTimelineTicksToSourceTicks(clipObject, timelineTime.ticks);
        return this.ticksToTimeObject(newTicks);
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
        return this.ticksToTimeObject(clipStartTicks + sourceTicksOffset_FromClipStart);
    };

    /**
     * Adds two Time objects together and returns a new Time object representing the sum.
     * @param {Time} timeObj1 
     * @param {Time} timeObj2 
     * @returns {Time} A new Time object representing the sum of the two input Time objects.
     */
    pub.addTime = function (timeObj1, timeObj2) {
        var totalTicks = Number(timeObj1.ticks) + Number(timeObj2.ticks);
        return this.ticksToTimeObject(totalTicks);
    };

    /**
     * Subtracts the second Time object from the first and returns a new Time object representing the difference.
     * @param {Time} timeObj1
     * @param {Time} timeObj2
     * @return {Time} A new Time object representing the difference between the two input Time objects.
     */
    pub.subtractTime = function(timeObj1, timeObj2) {
        var totalTicks = Number(timeObj1.ticks) - Number(timeObj2.ticks);
        return this.ticksToTimeObject(totalTicks);
    }

    /**
     * Custom object for holding info about QE TrackItems.
     * @typedef {Object} ClipInfoQE
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
     * @typedef {Object} ClipInfoVanilla
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
     *  Gathers information about the currently selected clips using the QE DOM. Returns an array of custom objects each containing details about the corresponding QE clip object.
     * @returns {ClipInfoQE[]|null} An array of objects containing information about each selected clip, or null if no clips selected or no active sequence.
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
        return this.getClipInfoQE(selectedVanillaClipObjects);
    };


    /**
     * Gathers information about the inputted clips using the QE DOM. Returns an array of custom objects each containing details about the corresponding QE clip object.
     * @param {TrackItem|TrackItemCollection|TrackItem[]} vanillaClips Specify a collection or array of vanilla clip objects to get info for.
     * @returns {ClipInfoQE[]} An array of objects containing information about each selected clip, or null if no clips selected or no active sequence.
     */
    pub.getClipInfoQE = function (vanillaClips) {
        var qeSequence = qe.project.getActiveSequence();
        var clipInfo = [];
        var outputString = "";
        var clipCount = 0;

        var vanillaClipsArray = ThioUtils.convertToArray(vanillaClips); // For some reason doing this.convertToArray doesn't work here? I forget why but this has happened before.

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
        var vanillaClipsArray = this.convertToArray(vanillaClips);

        for (var i = 0; i < vanillaClipsArray.length; i++) {
            var qeClip = this.getQEClipFromVanillaClip(vanillaClipsArray[i]);
            if (qeClip) {
                qeClips.push(qeClip);
            }
        }
        return qeClips;
    };

    /**
     * For a given vanilla clip object, retrieves the corresponding QE clip object from the active sequence.
     * @param {TrackItem} vanillaClip
     * @returns {QETrackItem} The corresponding QE clip object if found, or null if not found.
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
     * @returns {Array<ClipInfoVanilla>|null} An array of objects containing information about each selected clip, or undefined if no clips selected or no active sequence.
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
        if (obj == null) { return []; }
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
            arr = this.convertToArray(a);
        } else {
            arr = a;
        }

        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === b) {
                return true;
            }
        }
        return false;
    };


    /**
     * Checks if an array of TrackItems (clips) contains a specific TrackItem (clip).
     * @param {TrackItem[]|TrackItemCollection} a
     * @param {TrackItem} b
     * @return {boolean} True if the array contains the track item, false otherwise.
     */
    pub.doesAContainTrackB = function (a, b) {
        // We have to compare by using start and end ticks and track index because this stupid language can't do object comparison
        // If either isn't an array already, convert it to one

        var arr;
        if (!Array.isArray(b)) {
            arr = this.convertToArray(a);
        }

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].start.ticks === b.start.ticks && arr[i].end.ticks === b.end.ticks && arr[i].parentTrackIndex === b.parentTrackIndex) {
                return true;
            }
        }
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
        if (durationTicks > this.MAX_SAFE_INTEGER) {
            alert("Warning: The active sequence duration exceeds JavaScript's MAX_SAFE_INTEGER. Some operations may not work as expected.");
        }
    };

    /**
     * Unselects any clips currently selected for a sequence.
     * @param {Sequence|null=} sequenceToClear Optional: The sequence to clear selections from. If not provided, will use the active sequence.
     * @returns 
     */
    pub.clearSelections = function (sequenceToClear) {
        var seqToClear = this.checkOrGetActiveSequence(sequenceToClear);
        if (seqToClear === null) { return; }
        
        var selections = seqToClear.getSelection();
        for (var i = 0; i < selections.length; i++) {
            selections[i].setSelected(false, false); // Deselect each item
        }
    };

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
     */
    pub.addTransitionToBothEnds = function (transitionName, transitionDurationFrames, trackItems) {
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
            alert("Error in addTransitionToBothEnds: No clips to add transitions to.");
            return null;
        }

        // Validate the transition. Even if it doesn't exist, will still return an object, though with an empty "name" string property we can use to check for validity.
        /** @type {QEVideoTransition} */
        var transitionObj = qe.project.getVideoTransitionByName(transitionName);

        if (!transitionObj.hasOwnProperty("name") || transitionObj.name === "" || typeof transitionObj.name !== "string") {
            alert("Error in addTransitionToBothEnds: Transition provided does not appear to exist.");
        }

        for (var i = 0; i < trackItemArray.length; i++) {
            var item = trackItemArray[i];

            var trackQEObj = ThioUtils.getQEClipFromVanillaClip(item);
            if (trackQEObj) {
                var transitionDurationString = "0:" + transitionDurationFrames.toString(); // Format as "0:XX" for seconds and frames
                trackQEObj.addTransition(transitionObj, true, transitionDurationString, "0:00", 0, true, true);
                trackQEObj.addTransition(transitionObj, false, transitionDurationString, "0:00", 1.0, true, true);
            } else {
                $.writeln("Track item index " + i + " could not get QE object");
            }
        }
    };

    /**
     * @typedef {Object} TransitionData
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
     * @typedef {Object} TransitionPair
     * @property {TransitionData|null} left - Left transition data or null if none exists
     * @property {TransitionData|null} right - Right transition data or null if none exists
     */

    /**
     * @typedef {Object} ClipTransitionInfo
     * @property {ClipInfoQE} clipInfo - Clip information from ThioUtils.getSelectedClipInfoQE()
     * @property {TransitionPair} transitions - Object containing left and right transition data
     */

    /**
     * 
     * @param {TrackItemCollection|TrackItem[]|TrackItem} clips
     * @param {boolean} includeAudioTracks 
     * @param {boolean} includeVideoTracks 
     * @returns {Array<ClipTransitionInfo>} Array of clip transition information objects
     */
    pub.getTransitionsForSelectedClips = function(clips, includeAudioTracks, includeVideoTracks) {
        var clipsArray = ThioUtils.convertToArray(clips);
        var qeClipsArray = ThioUtils.clips.getClipInfoQE(clipsArray);
        var qeSequence = qe.project.getActiveSequence();
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
                        timelineStart: transition.start,
                        timelineEnd: transition.end,
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
                        timelineStart: transition.start,
                        timelineEnd: transition.end,
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
            return app.project.activeSequence;
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

    // ------------------ Project ------------------

    /**
     * Retrieves a bin from the project items panel. Can also find a bin within another bin if provided, otherwise searches root.
     * @param {string} binName 
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
     * Finds an item within a provided bin and returns the project item object.
     * @param {ProjectItem} binObj 
     * @param {string} itemName 
     * @returns {ProjectItem|null} Returns the item with the specified name, or null if not found.
     */
    pub.getItemInBinByName = function(binObj, itemName) {
        if (binObj.type != ProjectItemType.BIN) {
            alert("getItemInBinByName Error: Provided object does not appear to be a bin.");
            return null;
        }
        if (typeof itemName === 'undefined' || itemName === undefined || itemName === null || (typeof itemName === 'string' && itemName === '')) {
            alert("getItemInBinByName Error: itemName must be provided and not be an empty string.");
            return null;
        }

        for (var i = 0; i < binObj.children.numItems; i++) {
            var item = binObj.children[i];
            if (item.name === itemName) {
                return item;
            }
        }

        return null;
    }

    // ------------------ Utility ------------------

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
        var initialScriptName = this.getCallingFile();
        var checkedFileName = this.pathToFileName(filePath);
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
    pub.MAX_SAFE_INTEGER = $.global.MAX_SAFE_INTEGER;

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
        return !this.isUndefined(variable);
    }

    // ================================ Functions That Utilize ThioUtils.dll ================================

    /**
     * @returns {boolean} True if ThioUtils is loaded, false otherwise.
     */
    pub.isThioUtilsLibLoaded = function () {
        // Check if the ThioUtils library is loaded and available
        return (typeof ThioUtilsLib !== 'undefined' && ThioUtilsLib !== null);
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

        this.playSystemSoundID(0x00000010, fallbackAlertMessage);
    };

    /**
     * Plays a system success/OK sound if the external ThioUtils library is loaded, or shows an alert otherwise.
     * @param {string|null=} fallbackAlertMessage 
     */
    pub.playSuccessBeep = function (fallbackAlertMessage) {
        if (typeof fallbackAlertMessage === 'undefined' || fallbackAlertMessage === undefined || fallbackAlertMessage === null ||  (typeof fallbackAlertMessage === 'string' && fallbackAlertMessage === '')) {
            fallbackAlertMessage = null;
        }
        this.playSystemSoundID(0x00000000, fallbackAlertMessage);
    };

    /**
     * Plays a system sound if the external ThioUtils library is loaded, or shows an alert otherwise.
     * Useful for notifying the user of errors or important events without interrupting with an alert box.
     * @param {number} id 
     * @param {string|null=} fallbackAlertMessage 
     */
    pub.playSystemSoundID = function(id, fallbackAlertMessage) {
        if (this.isThioUtilsLibLoaded()) {
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
        if (this.isThioUtilsLibLoaded()) {
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
        if (this.isThioUtilsLibLoaded()) {
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
        isClipASameAsClipB: pub.isClipASameAsClipB
    };

    /**
     * @namespace cog
     * @memberof ThioUtils
     * @description Functions for automatically getting the active/selected objects unless provided
     */
    pub.cog = {
        checkOrGetActiveSequence: pub.checkOrGetActiveSequence,
        checkOrGetSelectedClips: pub.checkOrGetSelectedClips
    };

    /**
     * @namespace project
     * @memberof ThioUtils
     * @description Related to general project items including the project panel.
     */
    pub.project = {
        getBinByName: pub.getBinByName,
        getItemInBinByName: pub.getItemInBinByName
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
        singleFrameTimeObject: pub.singleFrameTimeObject,
        convertTimeObjectToNearestFrame: pub.convertTimeObjectToNearestFrame,
        getTimecodeString_FromTimeObject: pub.getTimecodeString_FromTimeObject,
        framesToTicks: pub.framesToTicks,
        ConvertTimelineTicksToSourceTicks: pub.ConvertTimelineTicksToSourceTicks,
        ConvertTimelineTimetoSourceTime: pub.ConvertTimelineTimetoSourceTime,
        ConvertSourceTimeToTimelineTime: pub.ConvertSourceTimeToTimelineTime,
        addTime: pub.addTime,
        subtractTime: pub.subtractTime
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
        addTransitionOnEnds: pub.addTransitionToBothEnds,
        getTransitionsForSelectedClips: pub.getTransitionsForSelectedClips
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
    };

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
        startsWith: pub.startsWith,
        containsStr: pub.containsStr,
        getCallingFile: pub.getCallingFile,
        pathToFileName: pub.pathToFileName,
        isNullOrEmptyStr: pub.isNullOrEmptyStr,
        isNullOrUndefined: pub.isNullOrUndefined,
        isUndefined: pub.isUndefined,
        isDefined: pub.isDefined
    };

    /**
     * @namespace system
     * @memberof ThioUtils
     * @description System-level functions
     */
    pub.system = {
        isThioUtilsLibLoaded: pub.isThioUtilsLibLoaded,
        playErrorBeep: pub.playErrorBeep,
        playSuccessBeep: pub.playSuccessBeep,
        playSystemSoundID: pub.playSystemSoundID,
        playSystemSound: pub.playSystemSound,
        copyToClipboard: pub.copyToClipboard
    };

   
    // --------------------------------------------------------------------------------------------
    // Return the public API object, making it available as 'ThioUtils'
    return pub; 


})(); // Execute the IIFE to create the ThioUtils object
