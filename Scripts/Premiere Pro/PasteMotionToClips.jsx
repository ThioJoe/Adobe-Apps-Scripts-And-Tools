// Purpose: This script is is used with the 'CopyMotionAtCurrentTime.jsx' script to copy the motion properties (position, scale, etc) of a clip at the current playhead position,
//          then paste it to another clip WITHOUT the keyframes - just the exact current values.
//
// How To use: 1. Put the playhead over the exact part of the clip, make sure that clip is also selected, then run the other "CopyMotionAtCurrentTime.jsx" script.
//             2. Select any clips you want to apply those properties to, and run this script to paste and apply the values.
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

var propertyValuesDict = {};

if (typeof propertyValuesAtTimeDict === 'undefined' || propertyValuesAtTimeDict === null || propertyValuesAtTimeDict === {} || propertyValuesAtTimeDict === undefined) {
    playErrorBeep("No values to paste. Please copy some values first with the corresponding script.");
    var propertyValuesDict = {};
} else {
    propertyValuesDict = $.global.propertyValuesAtTimeDict
}

var clipsToApplyMotion = GetSelectedVideoClips();

for (var i = 0; i < clipsToApplyMotion.length; i++) {
    var clip = clipsToApplyMotion[i];
    var motionComponent = GetClipEffectComponent_AsObject(clip, "Motion");

    // Go through the properties in the component and apply the ones we have values for
    var numProperties = motionComponent.properties.numItems;
    for (var j = 0; j < numProperties; j++) {
        var property = motionComponent.properties[j];
        var propertyName = property.displayName;
        if (propertyValuesDict.hasOwnProperty(propertyName)) {
            var newValue = propertyValuesDict[propertyName];
            property.setValue(newValue, 1);
        }
    }
}