﻿// Examples of ways to Include:
//    #include './includes/Utils.jsx'
//    #include 'Utils.jsx'

// When using eval, it will use a working directory in the program files directory, so it is necessary to use the full path to the script.
//       ---- Compact robus example at top of a script ----
//
// function getCurrentScriptDirectory() { return (new File($.fileName)).parent; }
// function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }
// function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }
// try { eval("#include '" + relativeToFullPath("Utils.jsx") + "'"); }
// catch(e) {
//     try { eval("#include '" + relativeToFullPath("includes/Utils.jsx") + "'"); }
//     catch(e) { alert("Could not find Utils.jsx in the same directory as the script or in an includes folder."); } // Return optional here, if you're within a main() function
// }

// Random Notes:
//    To clear console in Extendscript Toolkit, can use app.clc();  Or this line for automatic each run, regardless of target app:
//      var bt=new BridgeTalk;bt.target='estoolkit-4.0';bt.body='app.clc()';bt.send(5);

// Author Repo: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools

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

function getCurrentScriptDirectory() { return (new File($.fileName)).parent; }
function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }
function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }

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

function GetSelectedVideoClipsUnderPlayhead_AsObject() {
    var allTracksAtPlayhead = GetAllVideoClipsUnderPlayhead_AsObjectArray();
}

function GetPlayheadPosition_WithinTimeline_AsTicks() {
    // var seq = app.project.activeSequence;
    return Number(app.project.activeSequence.getPlayerPosition().ticks);
}

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

function ticksToSeconds(ticks) {
    var TICKS_PER_SECOND = 254016000000;
    return Number(ticks) / TICKS_PER_SECOND;
}

function ticksToTimeObject(ticks) {
    var time = new Time();
    var seconds = Number(ticks) / 254016000000;
    time.seconds = seconds;
    return time;
}

function ConvertTimelineTicksToSourceTicks(clipObject, timelineTicks) {
    var timelineTicksNumber = Number(timelineTicks);
    var clipStartTicks = Number(clipObject.start.ticks);
    var clipInternalStartTicks = Number(clipObject.inPoint.ticks);
    var timelineTicksOffset_FromClipStart = timelineTicksNumber - clipStartTicks;
    return clipInternalStartTicks + timelineTicksOffset_FromClipStart;
}

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

// Play the system beep sound if the required library is loaded. Otherwise display an alert.
function playErrorBeep(fallbackAlertMessage) {
    if (typeof thioUtils !== 'undefined' && thioUtils !== null) {
        thioUtils.systemBeep();
    } else {
        alert(fallbackAlertMessage);
    }
}

// To verify utils was included correctly
function testUtilsAlert(){
    alert("Hello from inside Utils.jsx!");
}
