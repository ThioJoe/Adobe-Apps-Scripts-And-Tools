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
       
![PathToEllipseExample-optimize](https://github.com/user-attachments/assets/c595ee4d-f8f9-4fd5-b47a-cc9802e66583)


# [Premiere Pro Scripts](Scripts/Premiere%20Pro/)
### Requirements: Most of these require the "[`Utils.jsx`](https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools/blob/main/Scripts/Premiere%20Pro/Utils.jsx)" file which is available next to the other Premiere Pro scripts

## Add Effect Keyframes At Transitions [⮺](Scripts/Premiere%20Pro/Add_Effect_Keyframes_At_Transitions.jsx)

 - **Purpose:** Add keyframes for the chosen effect property at the edge of transitions for selected clips
- **Example:**
<p align="center"><img width="800" alt="Effects control panel view of Scale keyframes lined up with transitions" src="https://github.com/user-attachments/assets/0badd1f2-405d-4d1c-b5e8-f6dc9793c524"></p>

## Add Mogrt From Path [⮺](Scripts/Premiere%20Pro/Add_Mogrt_FromPath.jsx)

 - **Purpose:** Add a specified (`.mogrt`) file of your choice to the sequence at the playhead position. It will put it on the video track above the topmost clip under the playhead.

## Add Transitions To Internal Cuts [⮺](Scripts/Premiere%20Pro/Add_Transitions_Internal_Cuts.jsx)
- **NOTE - POTENTIALLY OBSOLETE**: I realized after making this one, that it can probably be solved by simply holding `Ctrl` while marquee selecting the clips, which will make it select the cut points instead of the entire clip. Therefore you can just select the interior cuts then use the normal default transition keyboard shortcut to apply.
- **Purpose:** Add a specified transition between touching selected clips, but only on their "interior" cuts, not the furthest left or right ends of selected clips
- **Example:**
<p align="center"><img width="800" alt="Timeline view of selected clips with transitions between them but not on the left and right ends" src="https://github.com/user-attachments/assets/631b9f01-d146-43ff-a1ec-4939b432e588"></p>
