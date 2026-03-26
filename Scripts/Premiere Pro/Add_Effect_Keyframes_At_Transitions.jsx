// Purpose: This script will add keyframes to the chosen effect property at the edge of transitions for selected clips
//          For example, at the end of the left transition and the start of the right transition of any selected clips with transitions on them
//
// How To use: Set the user settings below and run the script
//
// Requires the "ThioUtils.jsx" file also from the repo to be in the same directory as this script, or in an "includes" folder in the same directory
//
// Author Repo: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools

// ===================================  USER SETTINGS  ===================================
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

// If there are already exactly 2 keyframes, whether to move them to the transition edges
var moveExistingKeyframesToTransitionEdges = true; // Boolean true/false

// ========================================================================================
// ========================================================================================

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

app.enableQE();


/**
 * @param {TrackItem} clip 
 * @param {string} componentName 
 * @param {string} propertyName 
 * @returns {ComponentParam}
 */
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

/**
 * 
 * @param {string|Number} clipStartTicks 
 * @param {string|Number} transitionTicks 
 * @returns {Number} Time in seconds
 */
function calculateTransitionTimeSeconds(clipStartTicks, transitionTicks) {
    return (Number(transitionTicks) - Number(clipStartTicks)) / 254016000000;
}

/**
 * 
 * @param {boolean} applyToAudioTracks 
 * @param {boolean} applyToVideoTracks 
 * @param {string} effectComponentName 
 * @param {string} effectPropertyName 
 * @param {Number|null} leftValue 
 * @param {Number|null} rightValue 
 * @param {boolean} moveExistingKeyframesToTransitionEdges
 */
function addTransitionScaleKeyframes(applyToAudioTracks, applyToVideoTracks, effectComponentName, effectPropertyName, leftValue, rightValue, moveExistingKeyframesToTransitionEdges) {
    // Get selected clips
    var selectedClips = app.project.activeSequence.getSelection();
    var transitionsInfo = ThioUtils.getTransitionsForSelectedClips(selectedClips, applyToAudioTracks, applyToVideoTracks);

    for (var i = 0; i < transitionsInfo.length; i++) {
        var currentClip = transitionsInfo[i];
        var leftTrans = currentClip.transitions.left;
        var rightTrans = currentClip.transitions.right;
        var vanillaClip = currentClip.clipInfo.fullVanillaClipObject;
        var initialValue = null;

        // Get the scale property for this clip
        var effectPropertyObject = findProperty(vanillaClip, effectComponentName, effectPropertyName);
        if (!effectPropertyObject) {
            alert("addTransitionScaleKeyframes Error: Could not find the specified effect property on the clip: " + vanillaClip.name);
            return;
        }

        // First get any existing keyframes for later just in case
        var existingStartKeyTime = null;
        var existingEndKeyTime = null;
        var existingStartKeyValue = null;
        var existingEndKeyValue = null;

        if (effectPropertyObject.isTimeVarying()) {
            var allKeys = effectPropertyObject.getKeys();
            if (allKeys.length === 2) {
                existingStartKeyTime = allKeys[0];
                existingEndKeyTime = allKeys[1];
                existingStartKeyValue = effectPropertyObject.getValueAtKey(existingStartKeyTime);
                existingEndKeyValue = effectPropertyObject.getValueAtKey(existingEndKeyTime);
            }
        }

        if (!effectPropertyObject.isTimeVarying()) {
            initialValue = effectPropertyObject.getValue();
            // Enable time varying to be able to add keyframes
            var timeVaryResult = effectPropertyObject.setTimeVarying(true);
        }

        // Add keyframe at end of left transition if it exists
        if (leftTrans) {
            var leftTransTimeSeconds = calculateTransitionTimeSeconds(currentClip.clipInfo.startTicks, leftTrans.timelineEnd.ticks);
            var leftKeyTime = ThioUtils.secondsToTimeObject(vanillaClip.inPoint.seconds + leftTransTimeSeconds);
            var leftValueToUse;
            var doMoveLeftKeyframe = false;
            
            // Set the value. If the clip was not time varying, set the initial scale
            if (leftValue != null && leftValue != undefined) {
                leftValueToUse = Number(leftValue);
            } else if (moveExistingKeyframesToTransitionEdges && existingStartKeyTime && existingEndKeyTime) {
                leftValueToUse = existingStartKeyValue;
                doMoveLeftKeyframe = true;
            }
            else if (initialValue) {
                leftValueToUse = initialValue;
            // If the clip was already time varying, get the value at the time the keyframe was added
            } else {
                leftValueToUse = effectPropertyObject.getValueAtTime(leftKeyTime);
            }

            // Add the key and set the value
            var addKeySuccess = effectPropertyObject.addKey(leftKeyTime);
            var setValueSuccess = effectPropertyObject.setValueAtKey(leftKeyTime, leftValueToUse, 1); // Third parameter is UpdateUI and ensures the change is reflected in the UI

            // addKey and setValueAtKey return null or true on success apparently, always false on failure
            if (addKeySuccess !== false && setValueSuccess !== false && doMoveLeftKeyframe) {
                // If we are moving existing keyframes, remove the old one
                effectPropertyObject.removeKey(existingStartKeyTime);
            }
        }
        
        // Add keyframe at start of right transition if it exists
        if (rightTrans) {
            // For right transition, calculate time relative to outPoint instead
            var rightTransDurationSeconds = calculateTransitionTimeSeconds(rightTrans.timelineStart.ticks, currentClip.clipInfo.endTicks);
            var rightKeyTime = ThioUtils.secondsToTimeObject(vanillaClip.outPoint.seconds - rightTransDurationSeconds);       
            var rightValueToUse;
            var doMoveRightKeyframe = false;

            if (rightValue != null && rightValue != undefined) {
                rightValueToUse = Number(rightValue);
            } else if (moveExistingKeyframesToTransitionEdges && existingStartKeyTime && existingEndKeyTime) {
                rightValueToUse = existingEndKeyValue;
                doMoveRightKeyframe = true;
            }
            else if (initialValue) {
                rightValueToUse = initialValue;
            } else {
                rightValueToUse = effectPropertyObject.getValueAtTime(rightKeyTime);
            }

            var addKeySuccess = effectPropertyObject.addKey(rightKeyTime);
            var setValueSuccess = effectPropertyObject.setValueAtKey(rightKeyTime, rightValueToUse, 1); // Third parameter is UpdateUI and ensures the change is reflected in the UI

            // addKey and setValueAtKey return null or true on success apparently, always false on failure
            if (addKeySuccess !== false && setValueSuccess !== false && doMoveRightKeyframe) {
                // If we are moving existing keyframes, remove the old one
                effectPropertyObject.removeKey(existingEndKeyTime);
            }
        }
    }
}

addTransitionScaleKeyframes(applyToAudioTracks, applyToVideoTracks, effectComponentName, effectPropertyName, leftValue, rightValue, moveExistingKeyframesToTransitionEdges);
