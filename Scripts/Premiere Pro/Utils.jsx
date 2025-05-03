// Examples of ways to Include:
//    #include './includes/Utils.jsx'
//    #include 'Utils.jsx'
//
// When using eval, it will use a working directory in the program files directory, so it is necessary to use the full path to the script.
//       ---- Compact robust example at top of a script ----
//
// ---------------------- Include Utils.jsx ----------------------
// function getCurrentScriptDirectory() { return (new File($.fileName)).parent; }
// function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }
// function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }
// try { eval("#include '" + relativeToFullPath("Utils.jsx") + "'"); }
// catch(e) {
//     try { var oErr = e; eval("#include '" + relativeToFullPath("includes/Utils.jsx") + "'"); }
//     catch(e) { alert("Could not find Utils.jsx in the same directory as the script or in an includes folder." + "\n\nFull Errors: \n" + oErr + "\n" + e); } // Return optional here, if you're within a main() function
// }
// ---------------------------------------------------------------
//
// Random Notes:
//    To clear console in Extendscript Toolkit, can use app.clc();  Or this line for automatic each run, regardless of target app:
//      var bt=new BridgeTalk;bt.target='estoolkit-4.0';bt.body='app.clc()';bt.send(5);
//
// Author Repo: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools

// Useful Objects:
// QE DOM is at: $.global.qe
//      Some functions at: $.global.qe.ea

// Loads the "Extendscript ThioUtils" .dll external library
var libFilename = "ThioUtils.dll";
var libPath = File($.fileName).parent.fsName + "/include/" + libFilename;
try {
    if (typeof thioUtils === 'undefined' || thioUtils === null || thioUtils === undefined) {
        var thioUtils = new ExternalObject("lib:" + libPath);
    }
} catch(e) {
    thioUtils = undefined;
    $.writeln("Error loading ThioUtils.dll: " + e);
}

app.enableQE();

function GetObjects(collection) {
    // Takes in an object which has multiple items, and returns an array of the items
    var objects = []
    for (var i = 0; i < collection.numItems; i++) {
        objects.push(collection[i])
    }
    return objects;
}

// Returns the directory of the current running script as a File object.
// Useful for referencing other scripts or resources relative to this script's location.
function getCurrentScriptDirectory() { return (new File($.fileName)).parent; }

// Joins multiple path segments into a single path string separated by '/'.
function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }

// Given a relative path, returns a full path by joining it with the directory of the current script.
function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }

// Determines which video clip is at the current playhead position on the highest numbered track.
// If returnAsObject is true, returns the clip object; if false, returns the track index or -1 if none found.
// Useful for placing an item on the track and ensuring you don't overwrite something there
function getTopTrackItemAtPlayhead(returnAsObject) {
    var seq = app.project.activeSequence;
    var currentTime = Number(seq.getPlayerPosition().ticks);
    var topTrackItem = null;
    var highestTrackIndex = -1;

    var videoTrackCount = seq.videoTracks;

    // Make a dictionary with clips and their corresponding track index
    var clipsDict = {};
    var indexesArray = []; // Use to easily get the max index later

    for (var i = 0; i < seq.videoTracks.numTracks; i++) {
        var track = seq.videoTracks[i];
        for (var j = 0; j < track.clips.numItems; j++) {
            var clip = null;
            clip = track.clips[j];
            var clipStart = Number(clip.start.ticks);
            var clipEnd =  Number(clip.end.ticks);

            if (currentTime >= clipStart && currentTime < clipEnd) {
                clipsDict[i] = clip;
                indexesArray.push(i);
            }
        }
    }

    // Get the largest key index number
    var highestTrackIndex = Math.max.apply(null, indexesArray);
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
}

function getResolutionFromProjectItem(targetClip) {
    var projectItem = targetClip.projectItem;
    var xRes = -1;
    var yRes = -1;

    try {
        var metadata = projectItem.getProjectMetadata(); // [cite: 425]

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
}


// Returns an array of clip/track objects that have video clips intersecting the current playhead position.
function GetAllVideoClipsUnderPlayhead_AsObjectArray() {
    var seq = app.project.activeSequence;
    var currentTime = Number(seq.getPlayerPosition().ticks);

    // Array to store the track objects
    var tracks = [];

    for (var i = 0; i < seq.videoTracks.numTracks; i++) {
        var track = seq.videoTracks[i];
        for (var j = 0; j < track.clips.numItems; j++) {
            var clip = null;
            clip = track.clips[j];
            var clipStart = Number(clip.start.ticks);
            var clipEnd =  Number(clip.end.ticks);

            if (currentTime >= clipStart && currentTime < clipEnd) {
                tracks.push(track);
            }
        }
    }
    return tracks;
}

// Retrieves the current playhead position, relative to the timeline, as a tick value.
function GetPlayheadPosition_WithinTimeline_AsTicks() {
    // var seq = app.project.activeSequence;
    return Number(app.project.activeSequence.getPlayerPosition().ticks);
}

// Retrieves an array of currently selected video clips from the active sequence.
// Filters out any non-video items and alerts if no video clips are selected.
function GetSelectedVideoClips(){
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
}

// Given a clip object and the name of a component (effect), returns the component object if found, otherwise returns null.
function GetClipEffectComponent_AsObject(clipObj, componentName) {
    // Find specified component
    var component = null;
    for (var i = 0; i < clipObj.components.numItems; i++) {
        if (clipObj.components[i].displayName.toLowerCase() === componentName.toLowerCase()) {
            component = clipObj.components[i];
            break;
        }
    }
    return component;
}

// Calculates the current position of the playhead, relative to within a selected clip's source media, as ticks.
// This requires exactly one selected clip and checks if the playhead is within it. 
// If useAudioTrack is true, the selected clip must be audio; otherwise, it must be video.
function GetPlayheadPosition_WithinSource_AsTicks(useAudioTrack) {
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

    return ConvertTimelineTicksToSourceTicks(selectedClip, playheadTimelinePositionTicks);
}

// Converts a given tick count to seconds based on a known TICKS_PER_SECOND value.
function ticksToSeconds(ticks) {
    var TICKS_PER_SECOND = 254016000000;
    return Number(ticks) / TICKS_PER_SECOND;
}

// Converts a given tick count into a Time object with its seconds property set.
// Useful where certain script methods require a time object as a parameter
function ticksToTimeObject(ticks) {
    var time = new Time();
    var seconds = Number(ticks) / 254016000000;
    time.seconds = seconds;
    return time;
}

function secondsToTimeObject(seconds) {
    var time = new Time();
    time.seconds = seconds;
    return time;
}

function singleFrameTimeObject(sequence) {
    var time = new Time();
    // Sequence.timebase is the number of ticks per frame
    var timebase = sequence.timebase;
    time.seconds = 1 / sequence.timebase;
    return time;
}

function convertTimeObjectToNearestFrame(sequence, timeObj) {
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
    var roundedTime = ticksToTimeObject(currentTicks);
    return roundedTime;
}

function getSortedClipsArray(clips) {
    var sortedClips = [];
    // If it's not already an array, convert it to one. Otherwise make a copy of it.
    if (!Array.isArray(clips)) {
        sortedClips = convertToArray(clips);
    } else {
        sortedClips = clips.slice(); // Make a copy of the array to avoid modifying the original
    }

    // Sort the clips based on their start ticks
    sortedClips.sort(function(a, b) {
        return Number(a.start.ticks) - Number(b.start.ticks);
    });

    return sortedClips;
}

// Convert a time object to a formatted string based on the sequence's frame rate and display format.
function getTimecodeString_FromTimeObject(timeObj) {
    var frameRateTicks = app.project.activeSequence.timebase;
    var frameRateTimeObj = ticksToTimeObject(frameRateTicks);
    var videoDisplayFormat = app.project.activeSequence.getSettings().videoDisplayFormat;
    return timeObj.getFormatted(frameRateTimeObj, videoDisplayFormat);
}

// Convert frames to ticks based on the sequence's frame rate.
function framesToTicks(frames) {
    var frameRateTicks = app.project.activeSequence.timebase;
    return frames * frameRateTicks;
}

// Given a specific timeline position in ticks, this calculates the corresponding position
// relative to within the given clip object's source
function ConvertTimelineTicksToSourceTicks(clipObject, timelineTicks) {
    var timelineTicksNumber = Number(timelineTicks);
    var clipStartTicks = Number(clipObject.start.ticks);
    var clipInternalStartTicks = Number(clipObject.inPoint.ticks);
    var timelineTicksOffset_FromClipStart = timelineTicksNumber - clipStartTicks;
    return clipInternalStartTicks + timelineTicksOffset_FromClipStart;
}

// Gathers information about the currently selected clips using the QE DOM.
// Returns an array of custom objects each containing details about the corresponding QE clip object.
function getSelectedClipInfoQE() {
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
    
    var qeSequence = qe.project.getActiveSequence(0);
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
                    vanillaMediaType : vanillaClip.mediaType,
                    clipItemIndexQE: j,   // The QE Clip index in the track
                    trackIndex: trackIndex, // The track index in the sequence
                    startTicks: qeClipObject.start.ticks,
                    endTicks: qeClipObject.end.ticks,
                    vanillaNodeId : vanillaClip.nodeId,
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
}

function getQEClipFromVanillaClip(vanillaClip) {
    var qeSequence = qe.project.getActiveSequence(0);
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
}



// Gathers information about the currently selected clips using the vanilla (non-QE) DOM.
// Returns an array of custom objects with details like start/end ticks, internal in/out points, track, and node ID.
function getSelectedClipInfoVanilla() {
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
}

function convertToArray(obj) {
    var array = [];
    for (var i = 0; i < obj.length; i++) {
        array.push(obj[i]);
    }
    // var array = [obj];
    return array;
}

// Check if an array of integers contains a specific integer
function doesIntArrayAContainIntB(a, b) {
    // If a has no length, return false immediately
    if (a.length === 0) {
        return false;
    }

    // Convert to array if not already and possible
    var arr;
    if (!Array.isArray(a)){
        arr = convertToArray(a);
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


function doesAContainTrackB(a, b) {
    // We have to compare by using start and end ticks and track index because this stupid language can't do object comparison
    // If either isn't an array already, convert it to one
    
    var arr;
    if (!Array.isArray(b)) {
        arr = convertToArray(a);
    }

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].start.ticks === b.start.ticks && arr[i].end.ticks === b.end.ticks && arr[i].parentTrackIndex === b.parentTrackIndex) {
            return true;
        }
    }
}

function isClipASameAsClipB(trackA, trackB) {
    if (
        trackA.start.ticks === trackB.start.ticks 
        && trackA.end.ticks === trackB.end.ticks
        && trackA.parentTrackIndex === trackB.parentTrackIndex
        && trackA.nodeId === trackB.nodeId
        && trackA.mediaType === trackB.mediaType
        && trackA.type === trackB.type
        && trackA.inPoint.ticks === trackB.inPoint.ticks
        && trackA.outPoint.ticks === trackB.outPoint.ticks
        ) 
    {
        return true;
    }
    return false;
}

// Plays a system beep sound if the external ThioUtils library is loaded, or shows an alert otherwise.
// Useful for notifying the user of errors or important events without interrupting with an alert box.
function playErrorBeep(fallbackAlertMessage) {
    if (typeof thioUtils !== 'undefined' && thioUtils !== null) {
        // 0x00000000 = Default OK
        // 0x00000010 = Default Error
        // It supports any that are defined here but many are the same:
        // https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messagebeep
        thioUtils.systemBeep(0);
    } else {
        alert(fallbackAlertMessage);
    }
}

// Checks if the active sequence duration in ticks is longer than javascript's MAX_SAFE_INTEGER and issues a warning if so.
function checkWarnDuration(sequence) {
    // If no sequence is passed, use the active sequence
    if (typeof sequence === 'undefined' || sequence === undefined || sequence === null) {
        sequence = app.project.activeSequence;
    }

    if (!sequence) {
        alert("No active sequence found.");
        return;
    }

    var durationTicks = sequence.end.ticks;
    if (durationTicks > Number.MAX_SAFE_INTEGER) {
        alert("Warning: The active sequence duration exceeds JavaScript's MAX_SAFE_INTEGER. Some operations may not work as expected.");
    }
}

// Displays a simple alert message to confirm that Utils.jsx is successfully included and accessible.
function testUtilsAlert(){
    alert("Hello from inside Utils.jsx!");
}
