# Scripts & Tools For Adobe Apps
 A repo for stuff I've made including Extendscript scripts and other tools for use with Adobe's creative cloud apps

----

# [Photoshop Scripts](Scripts/Photoshop/)

## Path Points to Ellipse [⮺](Scripts/Photoshop/Path-Points-To-Ellipse.jsx)

- **Purpose:** Draw 6 path points (or more) using the pen tool, and the script will create an Ellipse shape layer such that the outline matches the points as close as possible.

- **Requirements:** [Numeric.js](Scripts/Photoshop/includes/numeric.js) (Script will offer to automatically download)

- **Notes:**
    - The script will look for the points in the default "Work Path"
 
### **Path Points to Ellipse Demo:**
       
<p align="center"><img width="800" src="https://github.com/user-attachments/assets/c595ee4d-f8f9-4fd5-b47a-cc9802e66583">


# [Premiere Pro Scripts](Scripts/Premiere%20Pro/)

- ### Requirements: Most of these require the "[`Utils.jsx`](https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools/blob/main/Scripts/Premiere%20Pro/Utils.jsx)" file which is available next to the other Premiere Pro scripts
- ### Note: These scripts are probably most useful when used with the Excalibur extension which lets you assign scripts to run via keyboard shortcuts

## Add Effect Keyframes At Transitions [⮺](Scripts/Premiere%20Pro/Add_Effect_Keyframes_At_Transitions.jsx)

 - **Purpose:** Add keyframes for the chosen effect property at the edge of transitions for selected clips
- **Example:**
<p align="center"><img width="800" alt="Effects control panel view of Scale keyframes lined up with transitions" src="https://github.com/user-attachments/assets/0badd1f2-405d-4d1c-b5e8-f6dc9793c524"></p>

## Add Mogrt From Path [⮺](Scripts/Premiere%20Pro/Add_Mogrt_FromPath.jsx)

 - **Purpose:** Add a specified (`.mogrt`) file of your choice to the sequence at the playhead position. It will put it on the video track above the topmost clip under the playhead.

## Make Timestamps From Text in Selected Graphics [⮺](Scripts/Premiere%20Pro/MakeTimestamps.jsx)
- **Purpose:** Generates YouTube chapter timestamps using the text and starting points of selected graphics clips, and optionally includes timestamps of markers of chosen colors
- **How To Use:**
    1. Select any graphics clips on the timeline that contain the chapter titles
    2. Run the script. It will show an alert box with the timestamps, which you can copy by focusing the dialog and pressing Ctrl+C
- **Example:** 
  <p align="center"><img width="400" src="https://github.com/user-attachments/assets/ae00709b-4eb4-411a-80d4-46dca71250fc"></p>


## Copy/Paste Motion Properties [⮺](Scripts/Premiere%20Pro/CopyMotionAtCurrentTime.jsx) / [⮺](Scripts/Premiere%20Pro/PasteMotionToClips.jsx)
- **Purpose:** These two scripts work together to copy motion properties (position, scale, etc.) from one clip at the current playhead position and paste them to other clips WITHOUT copying keyframes - just the exact current values
- **How To Use:**
    1. Position playhead over the source clip, select it, and run `CopyMotionAtCurrentTime.jsx`
    2. Select target clips and run `PasteMotionToClips.jsx` to apply the copied motion properties
- **Example:**
  <p align="center"><img width="800" src="https://github.com/user-attachments/assets/78e3268a-deed-4bfd-bcf8-e0e50f445a7f">


## Add Transitions To Internal Cuts [⮺](Scripts/Premiere%20Pro/Add_Transitions_Internal_Cuts.jsx)
- **NOTE - POTENTIALLY OBSOLETE**: I realized after making this one, that it can probably be solved by simply holding `Ctrl` while marquee selecting the clips, which will make it select the cut points instead of the entire clip. Therefore you can just select the interior cuts then use the normal default transition keyboard shortcut to apply.
    - However this still might be useful in some cases, since it lets you specify which transition to use and the duration, if you don't want the default.
- **Purpose:** Add a specified transition between touching selected clips, but only on their "interior" cuts, not the furthest left or right ends of selected clips
- **Example:**
<p align="center"><img width="800" alt="Timeline view of selected clips with transitions between them but not on the left and right ends" src="https://github.com/user-attachments/assets/631b9f01-d146-43ff-a1ec-4939b432e588"></p>


# Extendscript Library

Extendscript external dll libraries allow adding native javascript methods, functions, etc that can be used with Extendscript. I've created my own to add various functionality that wasn't built into extendscript.

Current methods:
- `ThioUtils.systemBeep(uint)`: Play one of the standard Windows sounds
- `ThioUtils.playSoundAlias(string)`: Plays a system sound by alias or filename within the `C:\Windows\Media` folder
- `ThioUtils.copyTextToClipboard(string)`: Places an inputted string on the Windows clipboard

See this Wiki page for more details: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools/wiki/Extendscript-ThioUtils
