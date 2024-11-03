// Examples of ways to Include:
//    #include './includes/Utils.jsx'
//    #include 'Utils.jsx'

// When using eval, it will use a working directory in the program files directory, so it is necessary to use the full path to the script.
//       ---- Compact robus example at top of a script ----
//
// function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }
// function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }
// try { eval("#include '" + relativeToFullPath("Utils.jsx") + "'"); }
// catch(e) {
//     try { eval("#include '" + relativeToFullPath("includes/Utils.jsx") + "'"); }
//     catch(e) { alert("Could not find Utils.jsx in the same directory as the script or in an includes folder."); } // Return optional here, if you're within a main() function
// }

// Random Notes:
//    To clear console in Extendscript Toolkit, can use app.clc();  Or this line for automatic each run, regardless of target app:
//      var bt=new BridgeTalk;bt.target='estoolkit-4.0';bt.body='app.clc()';bt.send(5);

function getCurrentScriptDirectory() { return (new File($.fileName)).parent; }
function joinPath() { return Array.prototype.slice.call(arguments).join('/'); }
function relativeToFullPath(relativePath) { return joinPath(getCurrentScriptDirectory(), relativePath); }

function getTopTrackItemAtPlayhead() {
  var seq = app.project.activeSequence;
  var currentTime = Number(seq.getPlayerPosition().ticks);
  var topTrackItem = null;
  var highestTrackIndex = -1;

  var videoTrackCount = seq.videoTracks;

  for (var i = 0; i < seq.videoTracks.numTracks; i++) {
    var track = seq.videoTracks[i];
    for (var j = 0; j < track.clips.numItems; j++) {
      var clip = null;
      clip = track.clips[j];
      var clipStart = Number(clip.start.ticks);
      var clipEnd =  Number(clip.end.ticks);

      if (currentTime >= clipStart && currentTime < clipEnd) {
        if (i > highestTrackIndex) {
          highestTrackIndex = i;
          topTrackItem = clip;
        }
      }
    }
  }

  if (topTrackItem) {
    return highestTrackIndex; // Return the track number (add 1 to make it 1-based)
  } else {
    return -1; // Return -1 to indicate no track item found
  }
}



function getSelectedClipInfoQE() {
    // Enable QE DOM
    app.enableQE();
    
    var activeSequence = app.project.activeSequence;
    if (!activeSequence) {
        alert("No active sequence found.");
        return;
    }
    
    // Get selected clips from vanilla API
    var selectedVanillaClipObjects = activeSequence.getSelection();
    if (!selectedVanillaClipObjects.length) {
        alert("No clips selected in the active sequence.");
        return;
    }
    
    var qeSequence = qe.project.getActiveSequence(0);
    var clipInfo = [];
    var outputString = "";
    var clipCount = 0;
   
    // Process each selected vanilla clip
    for (var i = 0; i < selectedVanillaClipObjects.length; i++) {
        var vanillaClip = selectedVanillaClipObjects[i];
        
        var trackIndex = vanillaClip.parentTrackIndex;
        // Get the corresponding track in QE
        var trackItem = qeSequence.getVideoTrackAt(trackIndex);
        
        // Search through items in this track to find matching clip by start time
        for (var j = 0; j < trackItem.numItems; j++) {
            var qeClipObject = trackItem.getItemAt(j);
            
            // Skip if this item is null or undefined (empty space)
            if (!qeClipObject) continue;
            
            // Match based on start time in ticks
            if (qeClipObject.start.ticks === vanillaClip.start.ticks) {
                clipCount++;
                
                // Stores the info to be returned for each QE clip item in the list of selected items
                var info = {
                    name: qeClipObject.name,
                    clipItemIndexQE: j,   // The QE Clip index in the track
                    trackIndex: trackIndex, // The track index in the sequence
                    startTicks: qeClipObject.start.ticks,
                    endTicks: qeClipObject.end.ticks,
                    vanillaNodeId : vanillaClip.nodeId,
                    fullQEClipObject: qeClipObject,
                    fullVanillaClipObject: vanillaClip
                };
                
                clipInfo.push(info);
                
                outputString += "Clip " + clipCount + ":\n";
                outputString += "Name: " + info.name + "\n";
                outputString += "Start (Ticks): " + info.startTicks + " ticks\n";
                outputString += "End (Ticks): " + info.endTicks + " ticks\n\n";
            }
        }
    }
    
    //alert(outputString);
    return clipInfo;
}


function getSelectedClipInfoVanilla() {
    var activeSequence = app.project.activeSequence;
    if (!activeSequence) {
        alert("No active sequence found.");
        return;
    }
    var selectedClips = activeSequence.getSelection();
    if (!selectedClips.length) {
        alert("No clips selected in the active sequence.");
        return;
    }
    var clipInfo = [];
    var outputString = "";
    for (var i = 0; i < selectedClips.length; i++) {
        var clip = selectedClips[i];
        clipInfo.push({
            name: clip.name,
            startTicks: clip.start.ticks,
            endTicks: clip.end.ticks,
            trackIndex: clip.parentTrackIndex,
            nodeId: clip.nodeId,
            fullClipObject: clip
        });
        outputString += "Clip " + (i + 1) + ":\n";
        outputString += "Name: " + clip.name + "\n";
        outputString += "In Point: " + clip.start.ticks + " ticks\n";
        outputString += "Out Point: " + clip.end.ticks + " ticks\n";
		outputString += "Node ID: " + clip.nodeId + "\n";
        outputString += "Track Index: " + clip.parentTrackIndex + "\n\n";
		
    }
    //alert(outputString); // Display the formatted string in an alert
    return clipInfo;
}

function testUtilsAlert(){
  alert("Hello from inside Utils.jsx!");
}