// Purpose: This script is is used with the 'PasteMotionToClips.jsx' script to copy the motion properties (position, scale, etc) of a clip at the current playhead position,
//          then paste it to another clip WITHOUT the keyframes - just the exact current values.
//
// How To use: 1. Put the playhead over the exact part of the clip, make sure that clip is also selected, then run this script.
//             2. Run the 'PasteMotionToClips.jsx' script to paste the copied values to any selected clips.
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
    try { eval("#include '" + relativeToFullPath("includes/ThioUtils.jsx") + "'"); }
    catch(e) { alert("Could not find ThioUtils.jsx in the same directory as the script or in an includes folder."); } // Return optional here, if you're within a main() function
}
// ---------------------------------------------------------------

// This will be used by the corresponding script to paste, so reset it when this script runs
// Use $ to declare in global scope so it can be accessed by the pasting script
$.global.propertyValuesAtTimeDict = {};

var selectedClips = app.project.activeSequence.getSelection();
var selectedClip = selectedClips[0];
    
var internalPlayheadPos = ThioUtils.GetPlayheadPosition_WithinSource_AsTicks(false);

var currentPlayheadPos = ThioUtils.GetPlayheadPosition_WithinTimeline_AsTicks();


// Get a specific property from a component, or all of them. Returns an array of property objects
function GetEffectComponentPropertyArray(component, propertyName) {
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
}

function main() {
    var motionComponent = ThioUtils.GetClipEffectComponent_AsObject(selectedClip, "Motion");
    var propertyToCopy = null; // Leave null to copy all properties, otherwise specify the property name to get only 1 
    var propertyArray = GetEffectComponentPropertyArray(motionComponent, propertyToCopy);

    var propertiesObjectsDict = {};
    for (var i = 0; i < propertyArray.length; i++) {
        var property = propertyArray[i];
        var propertyName = property.displayName;
        propertiesObjectsDict[propertyName] = property;
    }

    // We got all the property objects, now we need to get their values at the current time
    $.global.propertyValuesAtTimeDict = {}; // This is already reset at the top of the script, but just as a reminder

    for (var _propertyName in propertiesObjectsDict) {
        var _property = null;
        _property = propertiesObjectsDict[_propertyName];
        var internalTimeObj = ThioUtils.ticksToTimeObject(internalPlayheadPos);
        $.global.propertyValuesAtTimeDict[_propertyName] = _property.getValueAtTime(internalTimeObj);
    }

    //alert("Copied: " + propertyArray.length + " Properties");

    if (typeof ThioUtilsLib !== 'undefined' && ThioUtilsLib !== null) {
        ThioUtilsLib.playSoundAlias("Windows Information Bar.wav")
    }
}

main();
