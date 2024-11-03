# Scripts & Tools For Adobe Apps
 A repo for stuff I've made including Extendscript scripts and other tools for use with Adobe's creative cloud apps

----

# [Photoshop Scripts](Scripts/Photoshop/)

## Path Points to Ellipse

- **Purpose:** Draw 6 path points (or more) using the pen tool, and the script will create an Ellipse shape layer such that the outline matches the points as close as possible.

- **Requirements:** [Numeric.js](Scripts/Photoshop/includes/numeric.js) (Script will offer to automatically download)

- **Notes:**
    - The script will look for the points in the default "Work Path"
 
### **Path Points to Ellipse Demo:**
       
![PathToEllipseExample-optimize](https://github.com/user-attachments/assets/c595ee4d-f8f9-4fd5-b47a-cc9802e66583)


# [Premiere Pro Scripts](Scripts/Premiere%20Pro/)
### Requirements: Most of these require the "Utils.jsx" file which is available next to the other Premiere Pro scripts

## Add Effect Keyframes At Transitions
 - **Purpose:** Add keyframes for the chosen effect property at the edge of transitions for selected clips

## Add Mogrt From Path
 - **Purpose:** Add a specified (`.mogrt`) file of your choice to the sequence at the playhead position. It will put it on the video track above the topmost clip under the playhead.

## Add Transitions To Internal Cuts
- **Purpose:** Add a specified transition between touching selected clips, but only on their "interior" cuts, not the furthest left or right ends of selected clips
