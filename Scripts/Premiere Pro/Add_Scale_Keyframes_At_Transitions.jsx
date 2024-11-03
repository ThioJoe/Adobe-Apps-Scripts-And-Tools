// Purpose: This script will add keyframes to the chosen effect property at the edge of transitions for selected clips
//          For example, at the end of the left transition and the start of the right transition of any selected clips with transitions on them
//
// How To use: Look at the bottom of the script for the variable settings
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

app.enableQE();

function getTransitionsForSelectedClips(applyToAudioTracks, applyToVideoTracks) {
    // Get the clip info from the existing function
    var selectedClipsInfoList = getSelectedClipInfoQE();
    if (!selectedClipsInfoList || !selectedClipsInfoList.length) {
        //alert("No clip information available."); // The function will already alert if there is no selected clips
        return;
    }
    
    var qeSequence = qe.project.getActiveSequence(0);
    var clipTransitionInfo = [];
    var outputString = "";
    
    // Process each clip from the selected clip info
    for (var i = 0; i < selectedClipsInfoList.length; i++) {
        var clipData = selectedClipsInfoList[i];

        if (!applyToAudioTracks && clipData.fullVanillaClipObject.mediaType === "Audio") continue;
        if (!applyToVideoTracks && clipData.fullVanillaClipObject.mediaType === "Video") continue;

        var trackItem = null;
        if (clipData.fullVanillaClipObject.mediaType === "Video") {
            trackItem = qeSequence.getVideoTrackAt(clipData.trackIndex);
        }
        else if (clipData.fullVanillaClipObject.mediaType === "Audio") {
            trackItem = qeSequence.getAudioTrackAt(clipData.trackIndex);
        } else {
            alert("Unknown media type for clip: " + clipData.name);
            continue;
        }
        
        // Initialize transitions as null
        var leftTransition = null;
        var rightTransition = null;
        
        // Process transitions on the track
        for (var j = 0; j < trackItem.numTransitions; j++) {
            var transition = trackItem.getTransitionAt(j);
            
            // Skip if transition is null, undefined, or type "Empty"
            if (!transition || transition.type === "Empty") continue;
            
            // Convert all values to numbers for comparison
            var transStart = Number(transition.start.ticks);
            var transEnd = Number(transition.end.ticks);
            var clipStart = Number(clipData.startTicks);
            var clipEnd = Number(clipData.endTicks);
            
            // Calculate actual transition boundaries considering alignment
            var transitionDuration = transEnd - transStart;
            var alignmentOffset = transitionDuration * Number(transition.alignment);
            var effectiveStart = transStart + alignmentOffset;
            var effectiveEnd = effectiveStart + transitionDuration;
            
            // Check if this is a left transition for this clip
            // Either starts exactly at clip start (first clip case)
            // Or ends near the clip start (transition between clips)
            if (transStart === clipStart || 
                (Math.abs(transEnd - clipStart) < transitionDuration)) {
                leftTransition = {
                    name: transition.name,
                    startTicks: transition.start.ticks,
                    endTicks: transition.end.ticks,
                    duration: transition.duration,
                    alignment: transition.alignment,
                    effectiveStart: effectiveStart,
                    effectiveEnd: effectiveEnd,
                    fullTransitionObject: transition
                };
            }
            
            // Check if this is a right transition for this clip
            // Either ends exactly at clip end (last clip case)
            // Or starts near the clip end (transition between clips)
            if (transEnd === clipEnd || 
                (Math.abs(transStart - clipEnd) < transitionDuration)) {
                rightTransition = {
                    name: transition.name,
                    startTicks: transition.start.ticks,
                    endTicks: transition.end.ticks,
                    duration: transition.duration,
                    alignment: transition.alignment,
                    effectiveStart: effectiveStart,
                    effectiveEnd: effectiveEnd,
                    fullTransitionObject: transition
                };
            }
        }
        
        // Create combined info object
        var combinedInfo = {
            clipInfo: clipData,
            transitions: {
                left: leftTransition,
                right: rightTransition
            }
        };
        
        clipTransitionInfo.push(combinedInfo);
        
        // Build output string for debugging
        outputString += "Clip " + (i + 1) + ":\n";
        outputString += "Name: " + clipData.name + "\n";
        outputString += "Media Type: " + clipData.vanillaMediaType + "\n";
        outputString += "Clip Start: " + clipData.startTicks + "\n";
        outputString += "Clip End: " + clipData.endTicks + "\n";
        
        if (leftTransition) {
            outputString += "Left Transition: " + leftTransition.name + "\n";
            outputString += "  Start: " + leftTransition.startTicks + "\n";
            outputString += "  End: " + leftTransition.endTicks + "\n";
            outputString += "  Alignment: " + leftTransition.alignment + "\n";
            outputString += "  Effective Start: " + leftTransition.effectiveStart + "\n";
            outputString += "  Effective End: " + leftTransition.effectiveEnd + "\n";
        }
        
        if (rightTransition) {
            outputString += "Right Transition: " + rightTransition.name + "\n";
            outputString += "  Start: " + rightTransition.startTicks + "\n";
            outputString += "  End: " + rightTransition.endTicks + "\n";
            outputString += "  Alignment: " + rightTransition.alignment + "\n";
            outputString += "  Effective Start: " + rightTransition.effectiveStart + "\n";
            outputString += "  Effective End: " + rightTransition.effectiveEnd + "\n";
        }
        
        outputString += "\n";
    }
    
    //alert(outputString);  // For debugging, uncomment
    return clipTransitionInfo;
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

function findProperty(clip, componentName, propertyName) {
    // Component name is basically the effect name, and property name is the particular parameter name for the effect
    // Convert search terms to lowercase for case-insensitive comparison
    var searchComponentName = componentName.toLowerCase();
    var searchPropertyName = propertyName.toLowerCase();
    
    // Find specified component
    var component = null;
    for (var i = 0; i < clip.components.numItems; i++) {
        if (clip.components[i].displayName.toLowerCase() === searchComponentName) {
            component = clip.components[i];
            break;
        }
    }
    
    if (!component) {
        alert("Could not find " + componentName + " component");
        return null;
    }
    
    // Find specified property
    var property = null;
    for (var j = 0; j < component.properties.numItems; j++) {
        if (component.properties[j].displayName.toLowerCase() === searchPropertyName) {
            property = component.properties[j];
            break;
        }
    }
    
    if (!property) {
        alert("Could not find " + propertyName + " property");
        return null;
    }
    
    return property;
}

function calculateTransitionTime(clipStartTicks, transitionTicks) {
    return (Number(transitionTicks) - Number(clipStartTicks)) / 254016000000;
}

function addTransitionScaleKeyframes(applyToAudioTracks, applyToVideoTracks, effectComponentName, effectPropertyName, leftValue, rightValue) {
    var transitionsInfo = getTransitionsForSelectedClips(applyToAudioTracks, applyToVideoTracks);

    for (var i = 0; i < transitionsInfo.length; i++) {
        var currentClip = transitionsInfo[i];
        var leftTrans = currentClip.transitions.left;
        var rightTrans = currentClip.transitions.right;
        var vanillaClip = currentClip.clipInfo.fullVanillaClipObject;
        
        // Get the scale property for this clip
        var effectPropertyObject = findProperty(vanillaClip, effectComponentName, effectPropertyName);
        if (!effectPropertyObject) continue;

        var initialValue = null;

        if (!effectPropertyObject.isTimeVarying()) {
            initialValue = effectPropertyObject.getValue();
            // Enable time varying to be able to add keyframes
            var timeVaryResult = effectPropertyObject.setTimeVarying(true);
        }

        // Add keyframe at end of left transition if it exists
        if (leftTrans) {
            var leftTransTime = calculateTransitionTime(currentClip.clipInfo.startTicks, leftTrans.endTicks);
            var leftKeyTime = vanillaClip.inPoint.seconds + leftTransTime;
            var leftValueToUse;
            
            // Set the value. If the clip was not time varying, set the initial scale
            if (leftValue != null && leftValue != undefined) {
                leftValueToUse = Number(leftValue);
            }
            else if (initialValue) {
                leftValueToUse = initialValue;
            // If the clip was already time varying, get the value at the time the keyframe was added
            } else {
                leftValueToUse = effectPropertyObject.getValueAtTime(leftKeyTime);
            }

            // Add the key and set the value
            effectPropertyObject.addKey(leftKeyTime);
            effectPropertyObject.setValueAtKey(leftKeyTime, leftValueToUse, 1); // Third parameter is UpdateUI and ensures the change is reflected in the UI
        }
        
        // Add keyframe at start of right transition if it exists
        if (rightTrans) {
            // For right transition, calculate time relative to outPoint instead
            var rightTransDuration = calculateTransitionTime(rightTrans.startTicks, currentClip.clipInfo.endTicks);
            var rightKeyTime = vanillaClip.outPoint.seconds - rightTransDuration;       
            var rightValueToUse;

            if (rightValue != null && rightValue != undefined) {
                rightValueToUse = Number(rightValue);
            }
            else if (initialValue) {
                rightValueToUse = initialValue;
            } else {
                rightValueToUse = effectPropertyObject.getValueAtTime(rightKeyTime);
            }

            effectPropertyObject.addKey(rightKeyTime);
            effectPropertyObject.setValueAtKey(rightKeyTime, rightValueToUse, 1); // Third parameter is UpdateUI and ensures the change is reflected in the UI
        }
    }
}

// ---------------------- SETTINGS AND RUN ----------------------
// Theoretically you could apply to both, but the effect would have to be the same name for both, so just really just make one true
var applyToAudioTracks = false;     // Boolean true/false
var applyToVideoTracks = true;      // Boolean true/false

// The effect component name and property name must match exactly, though it wont be case sensitive
//      > The component name is basically the effect name, and the property name is the particular parameter name for the effect
var effectComponentName = "Motion";  // String
var effectPropertyName = "Scale";    // String

// Left and Right values are the values for the particular keyframe for the left and right transitions
//      > Both are optional, but must be a number if provided. If not provided or set to null, the script will use the current value at the keyframe time, even if there are other keyframes
var leftValue = null;    // Must be a number (can include decimal) -- Or null/undefined
var rightValue = null;   // Must be a number (can include decimal) -- Or null/undefined

addTransitionScaleKeyframes(applyToAudioTracks, applyToVideoTracks, effectComponentName, effectPropertyName, leftValue, rightValue);
