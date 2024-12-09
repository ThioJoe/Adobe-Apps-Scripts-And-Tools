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

// In addition to selected clips, you can get the timestamps of markers of chosen colors set below. See below for color indexes.
// Put a comma separated list of the numbers between the brackets. Leave empty to not include any markers.
markerColorsInclude = [ 3, 4 ]

// Marker color must be represented as the index of the color in the marker panel
// 0 = Green
// 1 = Red
// 2 = Purple
// 3 = Orange
// 4 = Yellow
// 5 = White
// 6 = Blue

// Text to show for matched markers without a name (if applicable)
coloredMarkerText = "[MARKER]"

// Whether to add an "Intro" timestamp for 0:00
addIntro = true

// ====================================================================
// ====================================================================

function SortDictionaryByValue(dict) {
    var items = []
    for (var key in dict) {
        items.push([key, dict[key]]);
    }

    // Sort the array based on the second element
    items.sort(function(first, second) {
        return first[1] - second[1];
    });

    // Create a new array with the sorted items
    var sortedDict = {}
    for (var i = 0; i < items.length; i++) {
        sortedDict[items[i][0]] = items[i][1];
    }

    return sortedDict
}

function MakeTimestamps(addIntro, includeMarkerColors, coloredMarkerText) {

    var activeSequence = app.project.activeSequence
    var selectedVanillaClipObjects = activeSequence.getSelection()

    var ui = 0 // "Unique Index" for making sure the keys are unique, append to key, will be removed later
    // Function to create a unique suffix. Doing this since if we go above 9 there will be multiple digits and can't simply remove the last character
    function uni(key) { 
        return "~~" + ui + "~~"
    }

    // Dictionary of text in the titles and their start times
    
    var timestamps = {}
    if (addIntro) {
        timestamps["Intro" + uni()] = 0
        ui++
    }
    
    // For adding timestamps based on markers of certain colors
    if (includeMarkerColors.length > 0) {
        // Get the markers
        var markers = activeSequence.markers

        for (var i = 0; i < markers.numMarkers; i++) {
            var marker = markers[i];
            var markerTime = marker.start.seconds;
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
                    ui++;
                }
            }
        }
    }

    //DEBUG TESTING
    // timestamps["Test"] = 185.86
    // timestamps["Test2"] = 185.14
    // timestamps["Test3"] = 185.85

    // For adding timestamps based on text in the selected graphics clips
    for (var i = 0; i < selectedVanillaClipObjects.length; i++) {
        var vanillaClip = selectedVanillaClipObjects[i];
        startTime = vanillaClip.start.seconds

        // Go through the components (effects) of the clip to find the text
        for (var j = 0; j < vanillaClip.components.length; j++) {
            var component = vanillaClip.components[j]
            if (component.matchName === "AE.ADBE Text") {
                textContent = component.instanceName
                // Strip any newlines. NOTE: For some reason extendscript will replace \n with \r in strings silently, so we actually need to replace \r
                textContentCleaned = textContent.replace(/\r\n|\r|\n/g, " ");
                timestamps[textContentCleaned + uni()] = startTime
                ui++
                //$.writeln(textContentCleaned + " - " + startTime)
            }
        }
    }

    // Sort the dictionary by time
    timestamps = SortDictionaryByValue(timestamps)

    var finalString = "\n"
    for (var key in timestamps) {
        timeSeconds = timestamps[key]

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
        var cleanedKey = key.replace(/~~\d+~~$/, "")
        
        // Add to the final string
        finalString += timecode + " - " + cleanedKey + "\n"
    }

    return finalString

}

var finalString = MakeTimestamps(true, markerColorsInclude, coloredMarkerText)
// Shows the final string in an alert box, which you can copy by focusing the dialog and pressing Ctrl+C
alert(finalString)