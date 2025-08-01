// Purpose:    This script is takes the selected clips, and evenly distributes their cuts between them.
//             This results in all selected clips being right next to each other and all the same length.
//
// How To use: 1. Select any number of clips as long as they are all on the same track, and there are no unselected clips between them
//             2. Run the script.
//
// Requires the "ThioUtils.jsx" file also from the repo to be in the same directory as this script, or in an "includes" folder in the same directory
//
// Author Repo: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools

// ---------------------- Include ThioUtils.jsx ----------------------
function getCurrentScriptDirectory() { return (new File($.fileName)).parent; }
function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }
function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }
try { eval("#include '" + relativeToFullPath("ThioUtils.jsx") + "'"); }
catch(e) {
    try { var oErr = e; eval("#include '" + relativeToFullPath("includes/ThioUtils.jsx") + "'"); }
    catch(e) { alert("Could not find ThioUtils.jsx in the same directory as the script or in an includes folder." + "\n\nFull Errors: \n" + oErr + "\n" + e); } // Return optional here, if you're within a main() function
}
// ---------------------------------------------------------------

// If true, the clips will effectively be purely trimmed/untrimmed to their new placements so the inPoint and Outpoint within the clips stay in place
// If false, the start point of the clips will be moved to the new position
var keepContentRelativeToTimeline = true;

function main() {
    var activeSequence = app.project.activeSequence;
    if (!activeSequence) { alert("No active sequence."); return; }

    // Use convertToArray to get a JS array, easier to work with
    var selectedClips = ThioUtils.convertToArray(activeSequence.getSelection());

    // ----------- START: Validation Block -----------
    if (selectedClips.length < 2) {
        alert("You must select at least 2 clips to evenly distribute.");
        return;
    }

    // Ensure all selected items are TrackItems (clips) and determine track type
    var firstTrackIndex = -1;
    var mediaType = null; // "Video" or "Audio"

    for (var i = 0; i < selectedClips.length; i++) {
        // Special case first clip: set the firstTrackIndex and mediaType
        if (firstTrackIndex === -1) {
            firstTrackIndex = selectedClips[i].parentTrackIndex;
            mediaType = selectedClips[i].mediaType; // "Video" or "Audio"
        } else {
            if (selectedClips[i].parentTrackIndex != firstTrackIndex || selectedClips[i].mediaType !== mediaType) {
                alert("You must select clips on the same track and of the same type (all Video or all Audio).");
                return;
            }
        }
    }

    // Sort the selected clips by start time
    selectedClips = ThioUtils.getSortedClipsArray(selectedClips);

    // Get the start point (seconds) of the first selected clip, and the end point (seconds) of the last selected clip, AFTER sorting to define the total span for validation purposes.
    var startPoint = selectedClips[0].start.seconds;
    var endPoint = selectedClips[selectedClips.length - 1].end.seconds;

    // Further validation now that we know the start and end points (in seconds) of the selection span.
    // Ensure that there are no unselected clips in between the selected clips.
    if (mediaType === "Video") {
        var trackMediaType = "videoTracks";
    } else if (mediaType === "Audio") {
        var trackMediaType = "audioTracks";
    } else {
        alert("Unsupported media type: " + mediaType + ". Only Video and Audio tracks are supported.");
        return;
    }

    var trackCollection = activeSequence[trackMediaType]; // e.g., activeSequence.videoTracks
    if (!trackCollection || firstTrackIndex >= trackCollection.numTracks) {
         alert("Error accessing track collection or invalid track index."); return;
    }
    var allClipsOnTrack = trackCollection[firstTrackIndex].clips;
    var allClipsOnTrackArray = ThioUtils.convertToArray(allClipsOnTrack);

    // Custom comparison function to check if a clip is in the selected array (more robust than indexOf)
    function isClipSelected(clipToCheck, selectedArray) {
        for (var j = 0; j < selectedArray.length; j++) {
             // Compare based on a unique property if available, e.g., clipID or check multiple properties
             // Comparing objects directly might fail. Let's use start ticks as a proxy (assuming no two clips start at the exact same tick).
             // A more robust method would involve clip IDs if accessible.
             if (clipToCheck.start.ticks === selectedArray[j].start.ticks && clipToCheck.end.ticks === selectedArray[j].end.ticks && clipToCheck.name === selectedArray[j].name ) {
                 return true;
             }
        }
        return false;
    }

    // Go through the clips on the track, and check if there are any clips that are within the min/max time span of the selection but are NOT themselves selected.
    for (var i = 0; i < allClipsOnTrackArray.length; i++) {
        var currentClipOnTrack = allClipsOnTrackArray[i];
        // Check if the clip *overlaps* or is *within* the time span defined by the selection's earliest start and latest end
        if (currentClipOnTrack.end.seconds > startPoint && currentClipOnTrack.start.seconds < endPoint) {
             // Now check if this overlapping/contained clip is actually one of the selected ones
            if (!ThioUtils.doesAContainTrackB(selectedClips, currentClipOnTrack)) {
                var infoAboutCurrentClip = "At least one unselected clip: " + currentClipOnTrack.name + "\n" +
                    "Start: " + currentClipOnTrack.start.seconds + "\n" +
                    "End: " + currentClipOnTrack.end.seconds + "\n";
                alert("There are unselected clips in between the selected clips. Please select all clips in between the selected clips." + "\n\n" + infoAboutCurrentClip);
                return;
            }
        }
    }
    // ----------- END: Validation Block (Adapted) -----------

    // ----------- START: Tick-Based Distribution Calculation -----------
    // Get overall boundaries IN TICKS using the sorted list
    var startTicksNum = Number(selectedClips[0].start.ticks);
    var endTicksNum = Number(selectedClips[selectedClips.length - 1].end.ticks);

    var totalTicks = endTicksNum - startTicksNum;
    if (totalTicks <= 0) {
        alert("Total duration of selection is zero or negative (Start: " + startTicksNum + ", End: " + endTicksNum + "). Cannot distribute.");
        return;
    }

    var numberOfClips = selectedClips.length;
    // Use BigInt for intermediate division if totalTicks can exceed Number.MAX_SAFE_INTEGER (~9e15)
    // Otherwise, standard numbers are fine. Let's assume standard numbers are okay for typical timelines.
    var ticksPerClipBase = Math.floor(totalTicks / numberOfClips);
    var remainingTicks = totalTicks % numberOfClips;
    // ----------- END: Tick-Based Distribution Calculation -----------


    // ----------- START: Apply Sequential Placement using Ticks -----------
    var currentTick = startTicksNum;

    for (var i = 0; i < numberOfClips; i++) {
        var currentClip = selectedClips[i]; // Use the sorted array
        var thisClipDurationTicks = ticksPerClipBase;
        // Distribute the remainder ticks to the first 'remainingTicks' clips
        if (i < remainingTicks) {
            thisClipDurationTicks++;
        }

        // Ensure duration is at least 1 tick if base is 0 but remainder covers this clip
        if (thisClipDurationTicks <= 0) {
             thisClipDurationTicks = 1; // Assign minimum possible duration (1 tick)
        }

        var clipEndTick = currentTick + thisClipDurationTicks;

        try {
            var newStartTime = ThioUtils.ticksToTimeObject(currentTick);
            var newEndTime = ThioUtils.ticksToTimeObject(clipEndTick);

            // Get the change in start time in ticks
            var startTimeChangeTicks = Number(newStartTime.ticks) - Number(currentClip.start.ticks);

            // Attempt to set end time first, then start time.
            // This order might matter if the clip duration changes. Test if reversed order works better.
            currentClip.end = newEndTime;
            currentClip.start = newStartTime;

            // If keepContentRelativeToTimeline is true, adjust the inPoint
            if (keepContentRelativeToTimeline) {
                var newInPointTicks = Number(currentClip.inPoint.ticks) + startTimeChangeTicks;
                var newInPointTime = ThioUtils.ticksToTimeObject(newInPointTicks);
                currentClip.inPoint = newInPointTime; // Set the inPoint to the new time
            }
            
        } catch (e) {
            alert("Error setting time for clip '" + currentClip.name + "'.\nAttempted StartTick: " + currentTick + ", Attempted EndTick: " + clipEndTick + "\nError: " + e.toString());
            break; // Stop processing if one clip fails
        }

        // Update the start tick for the next clip
        currentTick = clipEndTick;
    }
    // ----------- END: Apply Sequential Placement using Ticks -----------

} // ---------------------------------------------- End of main()


// Execute main function
main();