// Purpose: This will add the mogrt file of your choice to the sequence at the playhead position. It will put it on the video track above the topmost clip under the playhead.
//
// How To use: Look at the bottom of the script for the variable settings
//
// Requires the "Utils.jsx" file also from the repo to be in the same directory as this script, or in an "includes" folder in the same directory
//
// Author Repo: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools

// ---------------------- Settings ----------------------
// The file path can use either forward slashes, or double backslashes
var mogrtFilePath = 'C:/Path/To/Whatever.mogrt';

// ------------------------------------------------------------------------------------------------------------
// ---------------------- Include ThioUtils.jsx ----------------------
function getCurrentScriptDirectory() { return (new File($.fileName)).parent; }
function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }
function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }
try { eval("#include '" + relativeToFullPath("ThioUtils.jsx") + "'"); }
catch(e) {
    try { eval("#include '" + relativeToFullPath("includes/ThioUtils.jsx") + "'"); }
    catch(e) { alert("Could not find ThioUtils.jsx in the same directory as the script or in an includes folder."); } // Return optional here, if you're within a main() function
}
// ---------------------------------------------------------------

/**
 * @param {Number} trackNumber 
 * @param {string} mogrtFilePath 
 */
function importMoGRT(trackNumber, mogrtFilePath) {
    var activeSeq = app.project.activeSequence;
    if (activeSeq) {
        var targetTime = activeSeq.getPlayerPosition();
        var vidTrackOffset = trackNumber;
        var audTrackOffset = 0;
        var newTrackItem = activeSeq.importMGT(mogrtFilePath, targetTime.ticks, vidTrackOffset, audTrackOffset);
        
        if (newTrackItem) {
            var moComp = newTrackItem.getMGTComponent();
            if (moComp) {
                var params = moComp.properties;
            }
        }
    }
    return false;
}

var topTrackIndex = getTopTrackItemAtPlayhead();
if (topTrackIndex < 0) { 
    topTrackIndex = 4; // Default to track 5 (Index 4) if no track is found
}
var trackNumber = topTrackIndex + 1;

// Run
importMoGRT(trackNumber, mogrtFilePath);
