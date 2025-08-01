// Purpose: This script is is used with the 'CopyMotionAtCurrentTime.jsx' script to copy the motion properties (position, scale, etc) of a clip at the current playhead position,
//          then paste it to another clip WITHOUT the keyframes - just the exact current values.
//
// How To use: 1. Put the playhead over the exact part of the clip, make sure that clip is also selected, then run the other "CopyMotionAtCurrentTime.jsx" script.
//             2. Select any clips you want to apply those properties to, and run this script to paste and apply the values.
//
// Requires the "ThioUtils.jsx" file also from the repo to be in the same directory as this script, or in an "includes" folder in the same directory
//
// Author Repo: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools

//=====================================================================================
// =============================== USER SETTINGS ======================================
// ====================================================================================

// If true, if the destination clip has keframes on some properties, keyframes will be added for those properties at the current time, based on copied data
// If false, keyframed properties will be left as-is on the destination clip
var addKeyframesForKeyframedProperties = true; 

// ===========================================================

// ---------------------- Include ThioUtils.jsx ----------------------
function getCurrentScriptDirectory() { return (new File($.fileName)).parent; }
function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }
function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }
try { eval("#include '" + relativeToFullPath("ThioUtils.jsx") + "'"); }
catch(e1) {
    try { eval("#include '" + relativeToFullPath("includes/ThioUtils.jsx") + "'"); }
    catch(e2) { alert("Could not find ThioUtils.jsx in the same directory as the script or in an includes folder.\n\nErrors: " + e1 + "\n\n" + e2); }
}
// ---------------------------------------------------------------

function main(addKeyframesForKeyframedProperties) {
    var propertyValuesDict = {};

    if (typeof $.global.propertyValuesAtTimeDict === 'undefined' || $.global.propertyValuesAtTimeDict === null || $.global.propertyValuesAtTimeDict == {} || $.global.propertyValuesAtTimeDict === undefined) {
        ThioUtils.playErrorBeep("No values to paste. Please copy some values first with the corresponding script.");
        var propertyValuesDict = {};
    } else {
        propertyValuesDict = $.global.propertyValuesAtTimeDict
    }

    var clipsToApplyMotion = ThioUtils.GetSelectedVideoClips();

    for (var i = 0; i < clipsToApplyMotion.length; i++) {
        var clip = clipsToApplyMotion[i];
        var motionComponent = ThioUtils.GetClipEffectComponent_AsObject(clip, "Motion");

        // Go through the properties in the component and apply the ones we have values for
        var numProperties = motionComponent.properties.numItems;
        for (var j = 0; j < numProperties; j++) {
            var property = motionComponent.properties[j];
            var propertyName = property.displayName;
            if (propertyValuesDict.hasOwnProperty(propertyName)) {
                var newValue = propertyValuesDict[propertyName];

                // If it's time varying (has keyframes), we need to check if we should add keyframes
                if (property.isTimeVarying() === true) {
                    if (addKeyframesForKeyframedProperties && ThioUtils.checkIfPlayheadIsInClip(clip)) {
                        // If we are adding keyframes for keyframed properties, we need to add or update a keyframe at the current time
                        var internalTimeObject = ThioUtils.ticksToTimeObject(ThioUtils.GetPlayheadPosition_WithinSource_AsTicks(false)) // False to not use audio track
                        if (!property.keyExistsAtTime(internalTimeObject)) { // This is currently undocumented but works
                            property.addKey(internalTimeObject); // Last param is to update the UI
                        }
                        property.setValueAtKey(internalTimeObject, newValue, 1); // Last param is to update the UI
                    }
                } else {
                    // If the property is not time-varying, we can set the value directly. This wouldn't work if the property is time-varying, it wouldn't do anything.
                    property.setValue(newValue, 1); // Last param is to update the UI
                }

            }
        }
    }
}

main(addKeyframesForKeyframedProperties);