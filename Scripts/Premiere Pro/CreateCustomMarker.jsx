// Purpose: Add a marker to the current playhead position in Premiere Pro, with custom options about the marker.
//
// How To use:  1. Set the variables below to your desired values. 
//              2. Run the script in Adobe Premiere Pro with a sequence open.
//              Optional: To set multiple markers, create copies of this script with different variable values.
//
// Author Repo: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools
//
//
// ======================== USER SETTINGS =============================

// Set the variables as desired
var markerDurationSeconds = 1.0; // Duration of the marker in seconds. Set to 0 or null if you want a marker with no duration
var color = 0; // See colors below. Must be a number between 0 and 6
var markerName = "";
var markerComment = "";
var markerType = 0; // See marker types below. Must be a number between 0 and 3

// Specific to Web Link markers
var webLinkURL = "https://example.com"; // URL for the Web Link marker
var frameTarget = ""; // This refers to the <a> 'target' attribute, which is mostly obsolete so you can leave it empty. Apparently a "_blank" value could be used to explicitly open in a new tab, though.

// Marker color: Must be represented as the index of the color in the marker panel
    // 0 = Green
    // 1 = Red
    // 2 = Purple
    // 3 = Orange
    // 4 = Yellow
    // 5 = White
    // 6 = Blue
    // 7 = Cyan

// Marker Types:
    // 0 = Comment (Default)
    // 1 = Chapter
    // 2 = Segmentation
    // 3 = Web Link

// ====================================================================

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

function addMarkerAtLocation(startLocationSeconds, endLocationSeconds, color, markerName, markerComment, type, webLinkURL, frameTarget) {

    var activeSequence = app.project.activeSequence;
    if (activeSequence) {
        var markerList = activeSequence.markers;

        var newMarker = markerList.createMarker(startLocationSeconds);

        // End location
        if (typeof endLocationSeconds !== 'undefined' && endLocationSeconds !== null && endLocationSeconds > startLocationSeconds) {
            newMarker.end = endLocationSeconds;
        }
        // Color
        if (typeof color !== 'undefined' && color !== null) {
            newMarker.setColorByIndex(color);
        }
        // Name
        if (typeof markerName !== 'undefined' && markerName !== null && markerName !== "") {
            newMarker.name = markerName;
        }
        // Comment
        if (typeof markerComment !== 'undefined' && markerComment !== null && markerComment !== "") {
            newMarker.comments = markerComment;
        }
        // Type
        if (typeof type !== 'undefined' && type !== null) {
            if (type === 0) {
                // newMarker.setTypeAsComment(); // Not necessary because it's the default
            } else if(type === 1) {
                newMarker.setTypeAsChapter();
            } else if (type === 2) {
                newMarker.setTypeAsSegmentation();
            } else if (type === 3) {
                newMarker.setTypeAsWebLink(webLinkURL, frameTarget);
            }
        }
    }
}

// Get the start and end times based on the current playhead position and the desired duration
if (typeof app.project.activeSequence !== 'undefined' && app.project.activeSequence !== null) {

    startLocationSeconds = app.project.activeSequence.getPlayerPosition().seconds;

    if (markerDurationSeconds === null || markerDurationSeconds <= 0) {
        endLocationSeconds = null;
    } else {
        endLocationSeconds = startLocationSeconds + markerDurationSeconds;
    }

    addMarkerAtLocation(startLocationSeconds, endLocationSeconds, color, markerName, markerComment, markerType, webLinkURL, frameTarget);
} else {
    alert("Error: No active sequence found.");
}