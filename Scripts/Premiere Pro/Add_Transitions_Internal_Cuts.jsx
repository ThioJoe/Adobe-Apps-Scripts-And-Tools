// Purpose: This script lets you add a transition between touching selected clips, but only on their "interior" ends, not the furthest left or right end of the set of clips
//          This is good if you want to have a different transition at the start and end of a set of clips, but not in between them
//
// How To use: Look at the bottom of the script for the variable settings
//
// Requires the "Utils.jsx" file also from the repo to be in the same directory as this script, or in an "includes" folder in the same directory
//
// Author Repo: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools

// ================================= Settings =================================

// Settings for the transition
var transitionName = "Cross Dissolve";
var alignment = 0.5; // Must be a number/decimal. Position relative to cut: 0 = start at cut, 0.5 = center at cut, 1 = end at cut

// Duration: Can be just number of frames like "30" for 30 frames, or timecode like "0:30" or "1:30" for 1 second 30 frames
//     > Can also be written like a decimal, but it's also interpreted like timecode apparently
//         > 1.50 is 1 second 50 frames, 1.5 is 1 second 5 frames, 0.5 is 0 seconds 5 frames, 0.50 is 0 seconds 50 frames
var durationString = "2:00";

// Settings to handle the ends of the leftmost and rightmost clips
var addTransitionOnEnds = true; // Set to true if you want to add the transition on the leftmost and rightmost clips as well
var transitionNameEnds = "Push"; // The name of the transition to use on the leftmost and rightmost clips
var durationStringEnds = "0:24"; // The duration of the transition to use on the leftmost and rightmost clips

// ============================================================================

// ---------------------- Include Utils.jsx ----------------------
function getCurrentScriptDirectory() { return (new File($.fileName)).parent; }
function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }
function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }
try { eval("#include '" + relativeToFullPath("Utils.jsx") + "'"); }
catch(e) {
    try { eval("#include '" + relativeToFullPath("includes/Utils.jsx") + "'"); }
    catch(e) { alert("Could not find Utils.jsx in the same directory as the script or in an includes folder."); } // Return optional here, if you're within a main() function
}
// ---------------------------------------------------------------

app.enableQE();

function addTransitionsBetweenClips(clipsQE, transitionName, durationString, alignmentValue, transitionNameEnds, durationStringEnds, addTransitionOnEnds) {
    var transitionToUse = qe.project.getVideoTransitionByName(transitionName);
    var endsTransitionToUse = qe.project.getVideoTransitionByName(transitionNameEnds);
    
    for (var i = 0; i < clipsQE.length; i++) {
        var clipQEDict = clipsQE[i];
        var clipQEObject = clipQEDict.fullQEClipObject;
        var clipQEIndex = clipQEDict.clipItemIndexQE;
        var trackIndex = clipQEDict.trackIndex;
        var trackItem = qe.project.getActiveSequence(0).getVideoTrackAt(trackIndex);
        var numItemsOnTrack = trackItem.numItems;
        
        // Check both sides for valid clips (Ensure it each cut is between two clips)
        var hasStartClip = false;
        var hasEndClip = false;
        
        if (clipQEIndex > 0) {
            var leftClipItem = trackItem.getItemAt(clipQEIndex - 1);
            hasStartClip = (leftClipItem && leftClipItem.type !== "Empty");
        }
        
        if (clipQEIndex < numItemsOnTrack - 1) {
            var rightClipItem = trackItem.getItemAt(clipQEIndex + 1);
            hasEndClip = (rightClipItem && rightClipItem.type !== "Empty");
        }
        
        // ------ Add transitions based on what was found ------

        // Add transition to the left side of the clip if applicable
        if (hasStartClip) { // There is a clip to the left of this one, use main middle transition
            clipQEObject.addTransition(transitionToUse, true, durationString, "0:00", alignmentValue, false, true);
        } else if (addTransitionOnEnds) { // No clip to the left, but we want to add a transition on the leftmost clip
            clipQEObject.addTransition(endsTransitionToUse, true, durationStringEnds, "0:00", 0, true, true);
        }

        // Add transition to the right side of the clip if applicable
        if (hasEndClip) { // There is a clip to the right of this one, use main middle transition
            clipQEObject.addTransition(transitionToUse, false, durationString, "0:00", alignmentValue, false, true);
        } else if (addTransitionOnEnds) { // No clip to the right, but we want to add a transition on the rightmost clip
            clipQEObject.addTransition(endsTransitionToUse, false, durationStringEnds, "0:00", 1.0, true, true);
        }

        // Info about addTransition:
        // addTransition(
        //     transition: object,       // Transition object from qe.project.getVideoTransitionByName(), such as .getVideoTransitionByName("Cross Dissolve")
        //     addToStart: boolean,      // true = add transition to start of clip and end of the clip, false = add to end of clip only
        //     inDurationString?: string,// Duration in frames ("30") or seconds+frames ("1:30") or seconds in decimal ("1.5")
        //     inOffsetString?: string,  // Offset timing - Seems non-functional, couldn't figure it out, but works when using "0:00"
        //     inAlignment?: number,     // Position relative to cut: 0 = start at cut, 0.5 = center at cut, 1 = end at cut
        //     inSingleSided?: boolean,  // Seems to force transition to only one side of the clip. Set to false if you'll want the transition to span across the cut
        //     inAlignToVideo?: boolean, // Purpose unknown - using either true/false seems to work
        // ): boolean;                   // Returns success/failure of adding transition
    }
}

// Get selected clips via QE DOM, not vanilla API. This function is in the included Utils.jsx file.
var selectedClips = getSelectedClipInfoQE();

// ---------------------- Run ----------------------
addTransitionsBetweenClips(selectedClips, transitionName, durationString, alignment, transitionNameEnds, durationStringEnds, addTransitionOnEnds);
