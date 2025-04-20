// Purpose:    This script is takes the selected clips, and evenly distributes their cuts between them.
//             This results in all selected clips being right next to each other and all the same length.
//
// How To use: 1. Select any number of clips as long as they are all on the same track, and there are no unselected clips between them
//             2. Run the script.
//
// Requires the "Utils.jsx" file also from the repo to be in the same directory as this script, or in an "includes" folder in the same directory
//
// Author Repo: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools

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

function main() {
    
    var selectedClips = app.project.activeSequence.getSelection();

    // Validate that all the clips are on the same track, and that there are at least 2 clips selected, and that there are no unselected clips in between the selected clips
    if (selectedClips.length < 2) {
        alert("You must select at least 2 clips to evenly distribute.");
        return;
    }

    var firstTrackIndex = selectedClips[0].parentTrackIndex;
    for (var i = 0; i < selectedClips.length; i++) {
        if (selectedClips[i].parentTrackIndex != firstTrackIndex) {
            alert("You must select clips on the same track.");
            return;
        }
    }

   
    // Get the start point of the first selected clip, and the end point of the last selected clip, and move the cuts so they're evenly spaced.
    // First need to find the smallest startTicks and largest endTicks of the selected clips. Just assign the first clip's startTicks and endTicks to the variables,
    //       then loop through the rest of the clips to find the smallest and largest values.
    var startPoint = selectedClips[0].start.seconds;
    var endPoint = selectedClips[0].end.seconds;
    
    for (var i = 0; i < selectedClips.length; i++) {
        var currentClip = selectedClips[i];

        if (currentClip.start.seconds < startPoint) {
                startPoint = currentClip.start.seconds;
            }
        if (currentClip.end.seconds > endPoint) {
            endPoint = currentClip.end.seconds;
        }
    }


    // Further validation now that we know the start and end points. We can ensure that there are no unselected clips in between the selected clips.
    var allClipsOnTrack = app.project.activeSequence.videoTracks[firstTrackIndex].clips;
    var allClipsOnTrackArray = convertToArray(allClipsOnTrack);

    // Go through the clips on the track, and check if there are any clips that are between the start and end points that are not in the selected clips
    for (var i = 0; i < allClipsOnTrackArray.length; i++) {
        var currentClip = allClipsOnTrackArray[i];
        if (currentClip.start.seconds >= startPoint && currentClip.end.seconds <= endPoint) {
            if (!doesAContainTrackB(selectedClips, currentClip)) {
                var infoAboutCurrentClip = "At least one unselected clip: " + currentClip.name + "\n" +
                    "Start: " + currentClip.start.seconds + "\n" +
                    "End: " + currentClip.end.seconds + "\n";
                alert("There are unselected clips in between the selected clips. Please select all clips in between the selected clips." + "\n\n" + infoAboutCurrentClip);
                return;
            }
        }
    }

    
    var totalTime = endPoint - startPoint;
    var numberOfClips = selectedClips.length;
    var timePerClip = totalTime / numberOfClips;

    // First shorten the clips that are longer than the time per clip
    for (var i = 0; i < selectedClips.length; i++) {
        var currentClip = selectedClips[i];
        var currentClipDuration = currentClip.end.seconds - currentClip.start.seconds;
        
        if (currentClipDuration > timePerClip) {
            // Shorten the clip to the time per clip
            var newEnd = secondsToTimeObject(Number(currentClip.start.seconds) + Number(timePerClip)) 
            currentClip.end = newEnd;
        }
    }

    // Then move all clips to their new positions with the .move() method
    for (var i = 0; i < selectedClips.length; i++) {
        var currentClip = selectedClips[i];
        var newStart = startPoint + (i * timePerClip);
        // The move method actually specifies how much to move the clip, not the new position
        // So we need to subtract the current start position from the new start position
        var moveAmount = newStart - currentClip.start.seconds;
        // Move the clip to its new position
        currentClip.move(moveAmount, "0");
    }

    // Extend the clips that are shorter than the time per clip
    for (var i = 0; i < selectedClips.length; i++) {
        var currentClip = selectedClips[i];
        var currentClipDuration = currentClip.end.seconds - currentClip.start.seconds;
        
        if (currentClipDuration < timePerClip) {
            // Extend the clip to the time per clip
            var newEnd = secondsToTimeObject(Number(currentClip.start.seconds) + Number(timePerClip)) 
            currentClip.end = newEnd;
        }
    }

    $.writeln();
} // ----------------------------------------------


main();