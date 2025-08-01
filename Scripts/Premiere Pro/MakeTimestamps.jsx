// Purpose: Lets you select any number of graphics clips on the timeline, and it will automatically generate YouTube chapter timestamps from the text within them.
//            > Also lets you choose to include timestamps of certain color markers.
//
// How To use:  1. Select any graphics clips on the timeline that contain the chapter titles. 
//              2. Run the script. It will show an alert box with the timestamps, which you can copy by focusing the dialog and pressing Ctrl+C.
//
// Author Repo: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools
//
//
// ======================== USER SETTINGS =============================

// Whether to add an "Intro" timestamp for 0:00
var addIntro = true

// Whether to show the exact timecode for the timestamps. If false, will show rounded down to the nearest second
var exactTimecode = false 

// In addition to selected clips, you can get the timestamps of markers of chosen colors set below. See below for color indexes.
// Put a comma separated list of the numbers between the brackets. Leave empty to not include any markers.
var markerColorsInclude = [ 4 ]
// Text to show for matched markers without a name (if applicable)
var coloredMarkerText = "[MARKER]"

// Marker color must be represented as the index of the color in the marker panel
// 0 = Green
// 1 = Red
// 2 = Purple
// 3 = Orange
// 4 = Yellow
// 5 = White
// 6 = Blue
// 7 = Cyan

// You can also set colors of markers that will be printed as a separate list at the end of the timestamps (comma separated list of colors above)
var markersColorsForSeparateTimestamps = [ 3 ]
// Text to show in the heading for the separate timestamps
var alternateTimestampsText = "Ads @:"
var altTimestampsExactTimecode = true // Whether to show the exact timecode for the separate timestamps
var showCommentsForAltTimestamps = true // If the alt timestamps have text comments, they'll be shown next to them, otherwise only the timecodes will be shown

// --- Fine Tuning Prferences ---

// Whether to use a semicolon within dropframe timecodes, or always use a colon
var useSemicolonInDropframe = false // If true, will use semicolon in dropframe timecodes, otherwise will always use colon

// Whether to always include the full HH:MM:SS:frame timecode for exact timecode. Otherwise hours will be excluded if there are no hours in the timecode, 
//      and minutes will be shown without leading 0 if there are no hours and no minutes greater than 10 in any of the timecode results
var alwaysFullTimecode = false

// ====================================================================
// ====================================================================

// ---------------------- Include ThioUtils.jsx ----------------------
function getCurrentScriptDirectory() { return (new File($.fileName)).parent; }
function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }
function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }
try { eval("#include '" + relativeToFullPath("ThioUtils.jsx") + "'"); }
catch(e) {
    try { var e1=e; eval("#include '" + relativeToFullPath("includes/ThioUtils.jsx") + "'"); } // Check Utils folder
    catch(e) { var e2=e; try { eval("#include '" + relativeToFullPath("../ThioUtils.jsx") + "'"); } // Check parent directory
    catch (e) { var e3=e; try { eval("#include '" + relativeToFullPath("../includes/ThioUtils.jsx") + "'"); } // Check parent includes folder
    catch (e) { var e4=e; alert("Could not find ThioUtils.jsx in current dir, includes folder, or parent dir." + "\n\nAll Attempt Errors: \n"+e1+"\n"+e2+"\n"+e2+"\n"+e3+"\n"+e4); } // Return optional here, if you're within a main() function
}}}
// ---------------------------------------------------------------

function GetSortedArrayFromDictionary(dict) {
    var items = []
    for (var key in dict) {
        items.push([key, dict[key]]);
    }

    // Sort the array based on the second element
    items.sort(function(first, second) {
        return first[1] - second[1];
    });

    return items
}

function sortTimeObjectNestedArray(timeObjArray) {
    // Sort the array based on the second element
    timeObjArray.sort(function(first, second) {
        return first[1].seconds - second[1].seconds;
    });

    return timeObjArray
}

function MakeTimeCodeMMSS(timestampsArray, noLabels) {
    var finalString = "\n"

    for (var i = 0; i < timestampsArray.length; i++) {

        var key = timestampsArray[i][0]
        var timeSeconds = timestampsArray[i][1]

        // Try to round down unless the number is very close to the next whole number
        var roundingThreshold = 0.85
        if (timeSeconds % 1 > roundingThreshold) {
            timeSeconds = Math.ceil(timeSeconds)
        } else {
            timeSeconds = Math.floor(timeSeconds)
        }


        // Convert to timecode of HH:MM:SS. Ignore hours if there are none. For minutes, don't show leading 0 unless there are hours. For seconds, always show leading 0.
        var hours = Math.floor(timeSeconds / 3600)
        var minutes = Math.floor((timeSeconds % 3600) / 60)
        var seconds = Math.floor(timeSeconds % 60)
        var timecode = ""

        // Don't show hours if there are none
        if (hours > 0) {
            timecode += hours + ":"
        }

        // If there are hours, show minutes with leading 0. If there are no hours, don't show leading 0, but still show 0 if there are no minutes
        if (minutes > 0) {
            if (hours > 0) {
                // var minuteStr = minutes.toString()
                var paddedMinutes = ("0" + minutes.toString()).slice(-2); 
                timecode += paddedMinutes + ":"
            } else {
                timecode += minutes + ":"
            }
        } else if (hours > 0) {
            timecode += "00:"
        } else {
            timecode += "0:"
        }

        // Always show seconds with leading 0
        timecode += ("0" + seconds.toString()).slice(-2);

        // Remove the unique index from the end of the key
        var cleanedKey;
        var separator = "";

        if (noLabels) {
            cleanedKey = ""
        } else {
            cleanedKey = key.replace(/~~\d+~~$/, "")
            if (cleanedKey !== "") {
                separator = " - "
            }
        }
        
        // Add to the final string
        finalString += timecode + separator + cleanedKey + "\n"
    }
    return finalString;
}

function getMaxOfPart(timeObjArray, partIndex) {
    var max = 0
    // partIndex: 0 = hours, 1 = minutes, 2 = seconds

    for (var i = 0; i < timeObjArray.length; i++) {
        // The timecode generated by premiere should always have an hours part 
        var timeObj = timeObjArray[i][1]
        var timecodeStr = ThioUtils.getTimecodeString_FromTimeObject(timeObj)

        if (timecodeStr.indexOf(":") !== -1) {
            var timecodeParts = timecodeStr.split(":")
        } else if (timecodeStr.indexOf(";") !== -1) {
            var timecodeParts = timecodeStr.split(";")
        }

        // Check if the first part (hours) is greater than 0
        if (timecodeParts.length > partIndex - 1 && parseInt(timecodeParts[partIndex]) > 0) {
            var partValue = parseInt(timecodeParts[partIndex])
            if (partValue > max) {
                max = partValue
            }
        }
    }
    return max
}

function makeTimeCodeAsIs(timeObjArray, noLabels) {
    var finalString = "\n"

    for (var i = 0; i < timeObjArray.length; i++) {
        var key = timeObjArray[i][0]
        var timeObj = timeObjArray[i][1]
        var timecode = ThioUtils.getTimecodeString_FromTimeObject(timeObj)

        var cleanedKey;
        if (noLabels) {
            cleanedKey = ""
        } else {
            cleanedKey = key.replace(/~~\d+~~$/, "")
        }

        // Determine if it's ; or : based on the timecode format, split on the correct character
        var frameChar;
        if (timecode.indexOf(":") !== -1) {
            var timecodeParts = timecode.split(":")
            frameChar = ":"
        } else if (timecode.indexOf(";") !== -1) {
            var timecodeParts = timecode.split(";")
            if (useSemicolonInDropframe) {
                frameChar = ";"
            } else {
                frameChar = ":"
            }
        }

        var includeHoursPart = getMaxOfPart(timeObjArray, 0) > 0
        var hasAnyMinutesOver10 = getMaxOfPart(timeObjArray, 1) > 9

        // Reassemble the timecode
        var reassembledTimecode = ""
        for (var j = 0; j < timecodeParts.length; j++) {
            // If the first part is hours, only add it if there's any results that have non-zero hours
            if (j === 0 && includeHoursPart == false && alwaysFullTimecode !== true) {
                continue; // Skip the hours part if it's 0
            }

            var timecodePartToAdd = timecodeParts[j]
            // If it's the minute part, remove any leading zero if there's no hours and there's no minute part greater than 10 in the array
            if (j === 1) {
                if (Number(timecodePartToAdd) < 10 && !includeHoursPart && hasAnyMinutesOver10 === false && alwaysFullTimecode !== true) {
                    timecodePartToAdd = timecodePartToAdd.replace(/^0/, ""); // Remove leading zero if it's less than 10 and no hours
                }
            }

            reassembledTimecode += timecodePartToAdd
            // Add the frame character if it's not the last part
            if (j < timecodeParts.length - 1) {
                reassembledTimecode += frameChar;
            }
        }

        var separator = "";
        if (noLabels) {
            separator = ""
        } else {
            if (cleanedKey !== "") {
                separator = " - "
            }
        }

        finalString += reassembledTimecode + separator + cleanedKey + "\n"
    }
    return finalString;
}


function MakeTimestamps(addIntro, includeMarkerColors, coloredMarkerText, markersOnly, noLabels, exactTimecode) {

    var activeSequence = app.project.activeSequence
    var selectedVanillaClipObjects = []

    if (typeof markersOnly === 'undefined' || markersOnly === null || !markersOnly) {
        selectedVanillaClipObjects = activeSequence.getSelection()
    }

    if (typeof noLabels === 'undefined' || noLabels === null || !noLabels) {
        noLabels = false
    } else {
        noLabels = true
    }

    if (typeof exactTimecode === 'undefined' || exactTimecode === null || !exactTimecode) {
        exactTimecode = false
    } else {
        exactTimecode = true
    }

    var ui = 0 // "Unique Index" for making sure the keys are unique, append to key, will be removed later
    // Function to create a unique suffix. Doing this since if we go above 9 there will be multiple digits and can't simply remove the last character
    function uni(key) { 
        return "~~" + ui + "~~"
    }

    // Dictionary of text in the titles and their start times
    
    var timestamps = {}
    var timestamps_timeObjs = []
    if (addIntro) {
        timestamps["Intro" + uni()] = 0

        var tempArray = []
        tempArray[0] = "Intro" + uni()
        tempArray[1] = ThioUtils.secondsToTimeObject(0)
        timestamps_timeObjs.push(tempArray)

        ui++
    }
    
    // For adding timestamps based on markers of certain colors
    if (includeMarkerColors.length > 0) {
        // Get the markers
        var markers = activeSequence.markers

        for (var i = 0; i < markers.numMarkers; i++) {
            var marker = markers[i];
            var markerTime = marker.start.seconds;
            var markerTimeObject = ThioUtils.getTimecodeString_FromTimeObject(marker.start)

            var markerName;
            if (marker.name === "") {
                markerName = coloredMarkerText;
            } else {
                markerName = marker.name;
            }
            
            // Get the color of the marker, see if it matches any of the chosen included colors
            var markerColor = marker.getColorByIndex(i);
            for (var j = 0; j < includeMarkerColors.length; j++) {
                if (markerColor === includeMarkerColors[j]) {
                    timestamps[markerName + uni()] = markerTime;

                    tempArray = []
                    tempArray[0] = markerName + uni()
                    tempArray[1] = marker.start
                    timestamps_timeObjs.push(tempArray)

                    ui++;
                }
            }
        }
    }

    // For adding timestamps based on text in the selected graphics clips
    for (var i = 0; i < selectedVanillaClipObjects.length; i++) {
        var vanillaClip = selectedVanillaClipObjects[i];
        var startTime = vanillaClip.start.seconds

        // Go through the components (effects) of the clip to find the text
        for (var j = 0; j < vanillaClip.components.length; j++) {
            var component = vanillaClip.components[j]
            if (component.matchName === "AE.ADBE Text") {
                var textContent = component.instanceName
                // Strip any newlines. NOTE: For some reason extendscript will replace \n with \r in strings silently, so we actually need to replace \r
                var textContentCleaned = textContent.replace(/\r\n|\r|\n/g, " ");
                timestamps[textContentCleaned + uni()] = startTime
                tempArray = []
                tempArray[0] = textContentCleaned + uni()
                tempArray[1] = vanillaClip.start
                timestamps_timeObjs.push(tempArray)
                ui++
            }
        }
    }

    var timestampsSorted = {}
    var timestampsFullSorted = {}

    // Sort the dictionary by time
    timestampsSorted = GetSortedArrayFromDictionary(timestamps)
    timestampsFullSorted = sortTimeObjectNestedArray(timestamps_timeObjs)

    if (!exactTimecode) {
        var finalString = MakeTimeCodeMMSS(timestampsSorted, noLabels)
    } else {
        var finalString = makeTimeCodeAsIs(timestampsFullSorted, noLabels)
    }

    return finalString

}

var finalStringToPrint
finalStringToPrint = MakeTimestamps(true, markerColorsInclude, coloredMarkerText, null, null, exactTimecode)

// For the secondary set of timestamps, if any
if (markersColorsForSeparateTimestamps.length > 0) {
    var additionalString = MakeTimestamps(false, markersColorsForSeparateTimestamps, "", true, !showCommentsForAltTimestamps, altTimestampsExactTimecode)
    if (additionalString !== "") {
        finalStringToPrint += "\n" + alternateTimestampsText + additionalString
    }
}

// Trim the final string to remove any leading or trailing whitespace. There's no trim function in extendscript, so using regex
finalStringToPrint = finalStringToPrint.replace(/^\s+|\s+$/g, "");

// if isThioUtilsLoaded() === true {
if (ThioUtils.isThioUtilsLibLoaded() === true) {
    var stringAndMessage = finalStringToPrint + "\n\n" + "---------------------------\nCopy to clipboard?";

    var choice = confirm(stringAndMessage, false, "Timestamps");
    if (choice === true){
        var copyResult = ThioUtils.copyToClipboard(finalStringToPrint);
        if (copyResult === false){
            var fallbackMessage = "\n" + finalStringToPrint + "\n\n" + "---------------------------\nFailed to copy to clipboard. You can try again by focusing this dialog box and pressing Ctrl+C";
            alert(fallbackMessage)
        }
    }
} else {
    // Shows the final string in an alert box, which you can copy by focusing the dialog and pressing Ctrl+C
    var stringAndMessage = "\n" + finalStringToPrint + "\n\n" + "---------------------------\nCopy the text by focusing this dialog box and pressing Ctrl+C";
    alert(stringAndMessage)
}
