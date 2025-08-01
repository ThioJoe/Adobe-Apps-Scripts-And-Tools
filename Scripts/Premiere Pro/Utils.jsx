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

try { eval("#include '" + relativeToFullPath("ThioUtilsLib.jsx") + "'"); }
catch (e) {
    try { var oErr1 = e; eval("#include '" + relativeToFullPath("includes/ThioUtilsLib.jsx") + "'"); }
    catch (e) {
        // Try in "include" folder
        try { var oErr2 = e; eval("#include '" + relativeToFullPath("include/ThioUtilsLib.jsx") + "'"); }
        catch (e) {
            try { var oErr3 = e; eval("#include '" + relativeToFullPath("../ThioUtilsLib.jsx") + "'"); }
            catch (e) { var oErr4 = e; eval("#include '" + relativeToFullPath("../includes/ThioUtilsLib.jsx") + "'"); 
                var errorString = + "\n\nFull Errors: \n" + oErr1 + "\n" + oErr2 + "\n" + e;
                $.writeln("Could not find or load ThioUtilsLib.jsx. Looked in same folder, and looked in any 'includes' and 'include' folders. ThioUtils.dll functionality will not be available");
                $.writeln(errorString);
            }
        }
    }
}

// -------------------------------------------------------

app.enableQE();

var ThioUtils = {
    /**
     * Converts a collection of items (like TrackItem collections) into a standard JavaScript array.
     * @template T
     * @param {object|Array<T>} collection A collection of items, such as a TrackItem collection or an array-like object.
     * @returns {Array<T>} An array containing the items from the collection.
     */
    collectionToArray: function (collection) {
        // Takes in an object which has multiple items, and returns an array of the items
        var objects = []
        for (var i = 0; i < collection.numItems; i++) {
            objects.push(collection[i])
        }
        return objects;
    },

    // Returns the directory of the current running script as a File object.
    // Useful for referencing other scripts or resources relative to this script's location.
    getCurrentScriptDirectory: function () {
        return getCurrentScriptDirectory();
    },

    // Joins multiple path segments into a single path string separated by '/'.
    /** @type {(...args: string[]) => string} */
    joinPath: joinPath,

    // Given a relative path, returns a full path by joining it with the directory of the current script.
    /** @type {(relativePath: string) => string} */
    relativeToFullPath: relativeToFullPath,


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
    getTopTrackItemAtPlayhead: function (returnAsObject) {
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
    },

    /**
     * Gets the video resolution from a clip's project item metadata.
     * @param {TrackItem|ProjectItem} targetItem The clip on the timeline to inspect.
     * @returns {{x: number, y: number} | null} An object containing the x and y resolution, or null if it cannot be determined.
     */
    getResolutionFromProjectItem: function (targetItem) {
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
    },


    /**
     * Returns an array of clip/track objects that have video clips intersecting the current playhead position.
     * @returns {TrackItem[]} An array of TrackItems (clips) that are under the playhead position in the active sequence.
     */
    GetAllVideoClipsUnderPlayhead_AsObjectArray: function () {
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
    },

    /**
     * Retrieves the current playhead position, relative to the timeline, as a tick value.
     * @returns {Number} The current playhead position in ticks.
     */
    GetPlayheadPosition_WithinTimeline_AsTicks: function () {
        // var seq = app.project.activeSequence;
        return Number(app.project.activeSequence.getPlayerPosition().ticks);
    },

    /**
     * Retrieves an array of currently selected video clips from the active sequence.
     * Filters out any non-video items and alerts if no video clips are selected.
     * @returns {TrackItem[]} An array of selected video clips in the active sequence.
     */
    GetSelectedVideoClips: function () {
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
    },

    /**
     * Gets all the sequences in the current project as an array of QESequence objects
     * @returns {QESequence[]}
     */
    getAllQESequencesInProject: function () {
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
    },

    /**
     * Gets an array of selected sequences from the Project panel view
     * @returns {Sequence[]}
     */
    getSelectedSequencesArray: function () {
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
    },

    /**
     * Gets the corresponding QESequence object for a given regular Sequence object
     * @param {Sequence} vanillaSequence
     * @returns {QESequence|null}
     */
    getQESequenceFromVanilla: function(vanillaSequence) {
        var allQESequences = ThioUtils.getAllQESequencesInProject();
        for (var i = 0; i < allQESequences.length; i++) {
            var qeSequence = allQESequences[i];
            if (qeSequence.guid === vanillaSequence.sequenceID) {
                return qeSequence;
            }
        }
        return null; // Return null if no match is found
    },

    /**
     * Gets the corresponding regular Sequence object for a given QESequence object
     * @param {QESequence} qeSequence
     * @returns {Sequence|null}
     */
    getVanillaSequenceFromQE: function(qeSequence) {
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
    },

    /** 
     * Gets the selected sequences in the project panel as QESequence objects
     * @returns {QESequence[]}
    */
    getSelectedSequencesQE: function() {
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
    },

    /**
     * Retrieves a specific effect component from a clip object by its display name.
     * @param {TrackItem} clipObj The clip object to search within.
     * @param {string} componentName The display name of the component (effect) to find.
     * @returns {Component|null} The component object if found, otherwise null.
     */
    GetClipEffectComponent_AsObject: function (clipObj, componentName) {
        // Find specified component
        var component = null;
        for (var i = 0; i < clipObj.components.numItems; i++) {
            if (clipObj.components[i].displayName.toLowerCase() === componentName.toLowerCase()) {
                component = clipObj.components[i];
                break;
            }
        }
        return component;
    },

    // Get a specific property from a component, or all of them. Returns an array of property objects
    /**
     * Retrieves an array of property objects from a specific effect component.
     * @param {Component} component The effect component to retrieve properties from.
     * @param {string} propertyName The display name of the property to retrieve (optional).
     * @returns {ComponentParam[]} An single-item array with the property matching the specified name, or all properties if no name is specified.
     */
    GetEffectComponentPropertyArray: function (component, propertyName) {
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
    },

    /**
     * Calculates the current position of the playhead, relative to within a selected clip's source media, as ticks.
     * This requires exactly one selected clip and checks if the playhead is within it.
     * @param {Boolean} useAudioTrack If true, the selected clip must be audio; otherwise, it must be video.
     * @returns {Number|null} The playhead position in ticks relative to the source media of the selected clip, or null if conditions are not met.
     */
    GetPlayheadPosition_WithinSource_AsTicks: function (useAudioTrack) {
        var selectedClipsRaw = app.project.activeSequence.getSelection();
        var selectedClips = [];

        // Filter out clips that are not of the correct type
        for (var i = 0; i < selectedClipsRaw.length; i++) {
            if ((!useAudioTrack && selectedClipsRaw[i].mediaType === "Video") || (useAudioTrack && selectedClipsRaw[i].mediaType === "Audio")) {
                selectedClips.push(selectedClipsRaw[i]);
            }
        }

        var playheadTimelinePositionTicks = Number(app.project.activeSequence.getPlayerPosition().ticks);
        if (!selectedClips.length || selectedClips.length > 1) {
            alert("You must select exactly 1 clip in the timeline to use this function.");
            return;
        }

        // Ensure the playhead is within the selected clip
        var selectedClip = selectedClips[0];
        if (playheadTimelinePositionTicks < Number(selectedClip.start.ticks) || playheadTimelinePositionTicks > Number(selectedClip.end.ticks)) {
            alert("The playhead is not within the selected clip.");
            return;
        }

        return this.ConvertTimelineTicksToSourceTicks(selectedClip, playheadTimelinePositionTicks);
    },

    /**
     * Trims the start of a clip without moving the remaining part of the clip.
     * @param {TrackItem} clip 
     * @param {Number} trimSeconds The number of seconds to trim from the start of the clip. A negative value will extend the clip earlier.
     */
    trimClipStart: function (clip, trimSeconds) {
        var sequenceFrameRate = new FrameRate();
        sequenceFrameRate.ticksPerFrame = Number(app.project.activeSequence.timebase); // Set the current frame rate to the sequence timebase

        var sourceFPS = clip.projectItem.getFootageInterpretation().frameRate; // Get the source frame rate from the clip's project item
        var sourceFrameRate = FrameRate.createWithValue(sourceFPS); // Create a FrameRate object with the source frame rate

        var inPointTimeObj = clip.inPoint;
        inPointTimeObj.seconds += trimSeconds; // Shift the inpoint back by the specified amount
        var newInPointTickTime = TickTime.createWithSeconds(inPointTimeObj.seconds); // Create a new TickTime object with the updated inpoint seconds
        newInPointTickTime = newInPointTickTime.alignToNearestFrame(sourceFrameRate); // Align to the nearest frame based on the source frame rate
        inPointTimeObj.ticks = newInPointTickTime.ticks; // Update the inpoint seconds to the aligned time

        clip.inPoint = inPointTimeObj; // Set the new inpoint

        var startTimeObj = clip.start;
        startTimeObj.seconds += trimSeconds; // Shift the start time back by the specified amount
        var startTimeTickTime = TickTime.createWithSeconds(startTimeObj.seconds); // Create a new TickTime object with the updated start time seconds
        startTimeTickTime = startTimeTickTime.alignToNearestFrame(sequenceFrameRate); // Align to the nearest frame based on the current frame rate
        startTimeObj.ticks = startTimeTickTime.ticks; // Update the start time seconds to the aligned time

        clip.start = startTimeObj; // Set the new start time
    },

    /**
     * Trims the end of a clip without moving the remaining part of the clip.
     * @param {TrackItem} clip 
     * @param {Number} trimSeconds The number of seconds to trim from the end of the clip. A negative value will extend the clip further.
     */
    trimClipEnd: function (clip, trimSeconds) {
        var sequenceFrameRate = new FrameRate();
        sequenceFrameRate.ticksPerFrame = Number(app.project.activeSequence.timebase); // Set the current frame rate to the sequence timebase

        var sourceFPS = clip.projectItem.getFootageInterpretation().frameRate; // Get the source frame rate from the clip's project item
        var sourceFrameRate = FrameRate.createWithValue(sourceFPS); // Create a FrameRate object with the source frame rate

        var outPointTimeObj = clip.outPoint;
        outPointTimeObj.seconds -= trimSeconds; // Shift the outpoint forward by the specified amount
        var newOutPointTickTime = TickTime.createWithSeconds(outPointTimeObj.seconds); // Create a new TickTime object with the updated outpoint seconds
        newOutPointTickTime = newOutPointTickTime.alignToNearestFrame(sourceFrameRate); // Align to the nearest frame based on the source frame rate
        outPointTimeObj.ticks = newOutPointTickTime.ticks; // Update the outpoint seconds to the aligned time

        clip.outPoint = outPointTimeObj; // Set the new outpoint

        var endTimeObj = clip.end;
        endTimeObj.seconds -= trimSeconds; // Shift the end time forward by the specified amount
        var endTimeTickTime = TickTime.createWithSeconds(endTimeObj.seconds); // Create a new TickTime object with the updated end time seconds
        endTimeTickTime = endTimeTickTime.alignToNearestFrame(sequenceFrameRate); // Align to the nearest frame based on the current frame rate
        endTimeObj.ticks = endTimeTickTime.ticks; // Update the end time seconds to the aligned time

        clip.end = endTimeObj; // Set the new end time
    },

    /**
     * Ripple deletes all empty items from a specified track in the active sequence. 
     * The ripple delete will shift all tracks, like a normal ripple delete.
     * @param {Number} trackIndex The index of the track to delete empty items from.
     * @param {("audio"|"video")} trackType Whether the track is audio or video.
     */
     rippleDeleteEmptySpaceOnTrack: function (trackIndex, trackType) {
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
                if (vidItem.type === "Empty") {
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
    },

    /**
     * Check if there are any clips on the timeline in a time range on a specified video track.
     * @param {Time} startTimeObj
     * @param {Time} endTimeObj
     * @param {Number} trackIndex
     * @param {"video"|"audio"} mediaType
     * @returns {Boolean|TrackItem} Return the clip if one is in the range, otherwise false.
     */
    checkIfAnyClipsInTimeRangeOnTrack: function (startTimeObj, endTimeObj, trackIndex, mediaType) {
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
            if (clip.start.ticks < endTimeObj.ticks && clip.end.ticks > startTimeObj.ticks) {
                return clip; // There is a clip in the range
            }
        }

        return false; // No clips in the range
    },

    /**
     * Check if the current playhead position is within the time range of a given clip object on the timeline.
     * @param {TrackItem} clipObject The clip object to check against.
     * @return {Boolean} True if the playhead is within the clip's time range, false otherwise.
     */
    checkIfPlayheadIsInClip: function (clipObject) {
        var activeSeq = app.project.activeSequence;
        if (!activeSeq) return false;

        var playheadPositionTicks = Number(activeSeq.getPlayerPosition().ticks);
        var clipStartTicks = Number(clipObject.start.ticks);
        var clipEndTicks = Number(clipObject.end.ticks);

        // Check if the playhead is within the clip's time range
        if (playheadPositionTicks >= clipStartTicks && playheadPositionTicks <= clipEndTicks) {
            return true; // Playhead is within the clip's time range
        } else {
            return false; // Playhead is not within the clip's time range
        }
    },

    /**
     * Converts a given tick count to seconds based on a known TICKS_PER_SECOND value.
     * @param {Number|string} ticks
     * @returns {Number} The equivalent time in seconds.
     */
    ticksToSeconds: function (ticks) {
        var TICKS_PER_SECOND = 254016000000;
        return Number(ticks) / TICKS_PER_SECOND;
    },

    /**
     * Converts a given tick count to a Time object.
     * @param {Number|string} ticks The number of ticks to convert.
     * @returns {Time} A Time object with the seconds property set.
     */
    ticksToTimeObject: function (ticks) {
        var time = new Time();
        time.ticks = String(ticks);
        return time;
    },

    /**
     * Converts a given number of seconds to a Time object.
     * @param {Number} seconds The number of seconds to convert.
     * @return {Time} A Time object with the seconds property set.
     */
    secondsToTimeObject: function (seconds) {
        var time = new Time();
        time.seconds = seconds;
        return time;
    },

    /**
     * Creates a Time object representing a single frame duration based on the sequence's timebase.
     * @param {Sequence} sequence The sequence object to get the timebase from.
     * @return {Time} A Time object representing the duration of a single frame in seconds.
     */
    singleFrameTimeObject: function (sequence) {
        var time = new Time();
        // Sequence.timebase is the number of ticks per frame
        time.ticks = sequence.timebase
        return time;
    },

    /**
     * Updates a Time object to the nearest frame based on the sequence's timebase
     * @param {Sequence} sequence Sequence object to get the timebase from.
     * @param {Time} timeObj The Time object to round to the nearest frame.
     * @returns {Time} Updated time object rounded to the nearest frame.
     */
    convertTimeObjectToNearestFrame: function (sequence, timeObj) {
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
    },

    /**
     * Takes in an array of TrackItems (clips) and returns a new array sorted by their start ticks.
     * @param {TrackItem[]|TrackItemCollection} clips
     * @returns {TrackItem[]} An array of TrackItems sorted by their start ticks.
     */
    getSortedClipsArray: function (clips) {
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
    },

    /**
     * Convert a time object to a formatted string based on the sequence's frame rate and display format.
     * @param {Time} timeObj
     * @returns {string} A formatted timecode string representing the time object.
     */
    getTimecodeString_FromTimeObject: function (timeObj) {
        var frameRateTicks = app.project.activeSequence.timebase;
        var frameRateTimeObj = this.ticksToTimeObject(frameRateTicks);
        var videoDisplayFormat = app.project.activeSequence.getSettings().videoDisplayFormat;
        return timeObj.getFormatted(frameRateTimeObj, videoDisplayFormat).toString();
    },

    /**
     * Convert frames to ticks based on the sequence's frame rate.
     * @param {Number} frames
     * @returns {Number} The equivalent number of ticks for the given number of frames.
     */
    framesToTicks: function (frames) {
        var frameRateTicks = app.project.activeSequence.timebase;
        return Number(frames) * Number(frameRateTicks);
    },

    /**
     * Given a specific timeline position in ticks, this calculates the corresponding position relative to within the given clip object's source
     * @param {TrackItem} clipObject
     * @param {Number|string} timelineTicks
     * @returns
     */
    ConvertTimelineTicksToSourceTicks: function (clipObject, timelineTicks) {
        var timelineTicksNumber = Number(timelineTicks);
        var clipStartTicks = Number(clipObject.start.ticks);
        var clipInternalStartTicks = Number(clipObject.inPoint.ticks);
        var timelineTicksOffset_FromClipStart = timelineTicksNumber - clipStartTicks;
        return clipInternalStartTicks + timelineTicksOffset_FromClipStart;
    },

    /**
     * Gathers information about the currently selected clips using the QE DOM. Returns an array of custom objects each containing details about the corresponding QE clip object.
     * @returns {Array} An array of objects containing information about each selected clip.
     */
    getSelectedClipInfoQE: function () {
        // Enable QE DOM
        app.enableQE();

        var activeSequence = app.project.activeSequence;
        if (!activeSequence) {
            alert("No active sequence found.");
            return;
        }

        // Get selected clips from vanilla API
        var selectedVanillaClipObjects = activeSequence.getSelection();
        if (!selectedVanillaClipObjects.length) {
            alert("No clips selected in the active sequence.");
            return;
        }

        var qeSequence = qe.project.getActiveSequence();
        var clipInfo = [];
        var outputString = "";
        var clipCount = 0;

        // Process each selected vanilla clip
        for (var i = 0; i < selectedVanillaClipObjects.length; i++) {
            var vanillaClip = selectedVanillaClipObjects[i];

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
    },

    /**
     * For a given vanilla clip object, retrieves the corresponding QE clip object from the active sequence.
     * @param {TrackItem} vanillaClip
     * @returns {QETrackItem} The corresponding QE clip object if found, or null if not found.
     */
    getQEClipFromVanillaClip: function (vanillaClip) {
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
    },

    /**
     * Gathers information about the currently selected clips using the vanilla (non-QE) DOM.
     * Returns an array of custom objects with details like start/end ticks, internal in/out points, track, and node ID.
     * @returns {Array} An array of objects containing information about each selected clip.
     */
    getSelectedClipInfoVanilla: function () {
        var activeSequence = app.project.activeSequence;
        if (!activeSequence) {
            alert("No active sequence found.");
            return;
        }
        var selectedClips = activeSequence.getSelection();
        if (!selectedClips.length) {
            alert("No clips selected in the active sequence.");
            return;
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
    },
    /**
     * Converts an array-like object (such as a TrackItem collection) to a standard JavaScript array.
     * @param {*} obj
     * @returns {Array} An array containing the elements of the object.
     */
    convertToArray: function (obj) {
        var array = [];
        for (var i = 0; i < obj.length; i++) {
            array.push(obj[i]);
        }
        // var array = [obj];
        return array;
    },

    /**
     * Check if an array of integers contains a specific integer
     * @param {Number[]} a
     * @param {Number} b
     * @returns {boolean} True if the array contains the integer, false otherwise.
     */
    doesIntArrayAContainIntB: function (a, b) {
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
    },


    /**
     * Checks if an array of TrackItems (clips) contains a specific TrackItem (clip).
     * @param {TrackItem[]|TrackItemCollection} a
     * @param {TrackItem} b
     * @return {boolean} True if the array contains the track item, false otherwise.
     */
    doesAContainTrackB: function (a, b) {
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
    },

    /**
     * Checks if two track items (clips) are the same based on their properties.
     * @param { TrackItem } trackA
     * @param { TrackItem } trackB
     * @return { boolean } True if the clips are the same, false otherwise.
     */
    isClipASameAsClipB: function (trackA, trackB) {
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
    },

    /**
     * Checks if the active sequence duration in ticks is longer than javascript's MAX_SAFE_INTEGER and issues a warning if so.
     * @param {Sequence} sequence
     * @returns {void}
     */
    checkWarnDuration: function (sequence) {
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
    },

    /**
     * The maximum safe integer in JavaScript (2^53 - 1).
     * Re-defined here for compatibility with older ExtendScript (ES3/ES5) environments.
     * @type {number}
     */
    MAX_SAFE_INTEGER: $.global.MAX_SAFE_INTEGER,

    /**
     * Displays a simple alert message to confirm that ThioUtils.jsx is successfully included and accessible.
     * @returns {void}
     */
    testUtilsAlert: function () {
        alert("Hello from inside Thio (ThioUtils.jsx)!");
    },

    // ================================ Functions That Utilize ThioUtils.dll ================================

    /**
     * @returns {boolean} True if ThioUtils is loaded, false otherwise.
     */
    isThioUtilsLibLoaded: function () {
        // Check if the ThioUtils library is loaded and available
        return (typeof ThioUtilsLib !== 'undefined' && ThioUtilsLib !== null);
    },

    /**
     * Plays a system beep sound if the external ThioUtils library is loaded, or shows an alert otherwise.
     * Useful for notifying the user of errors or important events without interrupting with an alert box.
     * @param {string} fallbackAlertMessage
     */
    playErrorBeep: function (fallbackAlertMessage) {
        if (this.isThioUtilsLibLoaded()) {
            // 0x00000000 = Default OK
            // 0x00000010 = Default Error
            // It supports any that are defined here but many are the same:
            // https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messagebeep
            ThioUtilsLib.systemBeep(0);
        } else {
            alert(fallbackAlertMessage);
        }
    },


    /**
     * Copy the given text to the clipboard using the ThioUtils library if available.
     * @param {string} text
     */
    copyToClipboard: function (text) {
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
    }
};