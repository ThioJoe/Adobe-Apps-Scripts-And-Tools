// Numeric.js can be acquired from: https://raw.githubusercontent.com/sloisel/numeric/refs/tags/v1.2.6/src/numeric.js
//     - I'll also host it alongside this script in my repo in an 'includes' folder (see repo link below)
//     - Or alternatively from here, but you must un-minify it yourself first: https://cdnjs.cloudflare.com/ajax/libs/numeric/1.2.6/numeric.min.js
// Note that not all versions of numeric.js floating out there work. The original non-minified version on CDNs like cloudflare apparently have extra code at the bottom that causes issues.
//     Use either the version linked above from GitHub, or you can use the minified version then unminify it and save it as numeric.js

// --------------------------------------------------------------------
// Version 1.0.0
// Author: ThioJoe (https://github.com/ThioJoe)
// From Repo: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools
// --------------------------------------------------------------------

// This block will try to import the required library file.
// If it's not found in the current directory or "includes" folder, it will ask the user if they want to try and download it automatically
try {
    // First, try to include from the current directory
    eval("#include 'numeric.js'")
} catch (e) {
    try {
        // If not in current directory, try the "includes" folder
        eval("#include './includes/numeric.js'")
    } catch (e) {
        var userChoice = confirm("numeric.js was not found and is required. Do you want to try to automatically download it now?\n\n(Note: This only needs to be done once)");
        if (userChoice) {
            try {
                var imageUrl = "https://raw.githubusercontent.com/sloisel/numeric/refs/tags/v1.2.6/src/numeric.js";
                var scriptFile = new File($.fileName);
                var scriptFolder = scriptFile.parent;
                var includesFolder = new Folder(scriptFolder + "/includes");
                
                // Create includes folder if it doesn't exist
                if (!includesFolder.exists) {
                    includesFolder.create();
                }
                
                var localImgPath = includesFolder.fsName + "/numeric.js";
                
                if (Folder.fs.indexOf("Win") > -1) {
                    var command = "powershell -Command \"& { Invoke-WebRequest -Uri '" + imageUrl + "' -OutFile '" + localImgPath.replace(/\\/g, "\\\\") + "' }\"";
                    app.system(command);
                } else {
                    app.system("curl -o \"" + localImgPath + "\" \"" + imageUrl + "\"");
                }
                
                // Check if file was successfully downloaded
                var downloadedFile = new File(localImgPath);
                if (downloadedFile.exists) {
                    alert("Success! numeric.js was successfully downloaded.\n\n" +
                        "It was placed into a folder called \"includes\" at:\n" + 
                        localImgPath + "\n\n" + 
                        "Click OK to proceed with running the script");
                    eval("#include './includes/numeric.js'");
                } else {
                    throw new Error("File download failed.");
                }
            } catch (e) {
                alert("Error downloading or including numeric.js: " + e.message);
            }
        } else {
            displayNotFoundAlert("Required library 'numeric.js' not found.");
        }
    }
}

function displayNotFoundAlert(errorMessage) {
    alert("Failed to find 'numeric.js' in either the current directory or 'includes' folder!\n\n" +
        "Error: " + errorMessage + "\n\n" +
        "To resolve this issue:\n" +
        "1. Obtain Numeric.js from one of these sources (See inside script for links):\n\n" +
        "   a) GitHub: Raw version 1.2.6\n" +
        "   b) Cloudflare CDN: Minified version 1.2.6 (requires un-minifying yourself)\n\n" +
        "2. Note: Not all versions of numeric.js are compatible. Use the linked version from GitHub or manually un-minify the CDN version from Cloudflare.\n\n" +
        "3. Save the file as 'numeric.js' in the current directory or 'includes' folder.\n\n" +
        "For clickable links to download numeric.js, please check the comments at the top of this script file.");
}


// ---------------------- BEGIN MAIN PART OF SCRIPT --------------------------

$.writeln("--------------------------------------------------")
// Ellipse Fitting Script for Photoshop
// Ensure that a document is open
if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Calculate the resolution factor
    var docResolution = doc.resolution; // Pixels per inch
    //var resolutionFactor = docResolution / 72; // Pixels per point
    var resolutionFactor = 1; // Actually we don't need to account for this apparently. Using it on non-72dpi images causes it to be drawn wrong.

    // Check if there's at least one path
    if (doc.pathItems.length > 0) {
        var myPath;

        // Try to get the active or selected path
        try {
            // Get the active (work) path by name
            myPath = doc.pathItems.getByName('Work Path');
        } catch (e) {
            // If 'Work Path' doesn't exist, use the first path item
            myPath = doc.pathItems[0];
        }

        // Check if the path contains sub-paths
        if (myPath.subPathItems.length > 0) {
            // Collect anchor points from the path
            var points = [];
            for (var i = 0; i < myPath.subPathItems.length; i++) {
                var subPath = myPath.subPathItems[i];
                var pathPoints = subPath.pathPoints;
                for (var j = 0; j < pathPoints.length; j++) {
                    var anchor = pathPoints[j].anchor;
                    // Convert from points to pixels
                    points.push([anchor[0] * resolutionFactor, anchor[1] * resolutionFactor]);
                }
            }

            $.writeln("Point coordinates: " + points);

            // Ensure we have at least five points
            if (points.length >= 5) {
                // Fit the ellipse
                var ellipseParams = fitEllipse(points);

                if (ellipseParams) {
                    // Draw the ellipse
                    drawEllipse(ellipseParams);
                    //alert("Ellipse has been fitted and drawn as a vector shape.");
                } else {
                    alert("Could not fit an ellipse to the provided points.");
                }
            } else {
                alert("Please use the Pen Tool to select at least five points along the ellipse.");
            }
        } else {
            alert("The selected path does not contain any sub-paths or points.");
        }
    } else {
        alert("No paths found. Use the Pen Tool to create a path along the ellipse.");
    }
} else {
    alert("Please open a document before running this script.");
}


// Function to fit an ellipse to the given points
function fitEllipse(points) {
    // Number of points
    var n = points.length;

    if (n < 6) {
        alert("At least six points are required to fit an ellipse.");
        return null;
    }

    // Construct the design matrix D
    var D = [];
    for (var i = 0; i < n; i++) {
        var x = points[i][0];
        var y = points[i][1];
        D.push([x * x, x * y, y * y, x, y, 1]);
    }

    // Compute the scatter matrix S = D^T * D
    var DT = numeric.transpose(D);
    var S = numeric.dot(DT, D);

    // Partition the scatter matrix S into submatrices
    // S = [S11 | S12]
    //      [S21 | S22]
    // Where S11 is 3x3, S12 is 3x3, S21 is 3x3, S22 is 3x3
    var S11 = numeric.getBlock(S, [0, 0], [2, 2]);
    var S12 = numeric.getBlock(S, [0, 3], [2, 5]);
    var S21 = numeric.getBlock(S, [3, 0], [5, 2]);
    var S22 = numeric.getBlock(S, [3, 3], [5, 5]);

    // Compute the constraint matrix C1 (top-left 3x3 submatrix)
    var C1 = [
        [0, 0, 2],
        [0, -1, 0],
        [2, 0, 0]
    ];

    // Compute T = -inv(S22) * S21
    var S22_inv = numeric.inv(S22);
    var T = numeric.neg(numeric.dot(S22_inv, S21));

    // Compute M = S11 + S12 * T
    var M = numeric.add(S11, numeric.dot(S12, T));

    // Solve the generalized eigenvalue problem M * a1 = lambda * C1 * a1
    // Since C1 is small and constant, we can proceed to solve this as a standard eigenvalue problem
    // Let's transform the problem to a standard eigenvalue problem

    // Add a small value epsilon to the diagonal elements of C1 to make it invertible
    var epsilon = 1e-12; // Small regularization value
    var C1_reg = numeric.clone(C1);
    C1_reg[0][0] += epsilon;
    C1_reg[1][1] += epsilon;
    C1_reg[2][2] += epsilon;

    // Compute the inverse of C1_reg
    var C1_inv = numeric.inv(C1_reg);

    // Compute N = inv(C1_reg) * M
    var N = numeric.dot(C1_inv, M);

    // Solve the standard eigenvalue problem N * a1 = lambda * a1
    var eigResult = numeric.eig(N);

    // Extract eigenvalues and eigenvectors
    var eigenvalues = eigResult.lambda.x; // Real parts of eigenvalues
    var eigenvectors = eigResult.E.x;     // Eigenvectors

    // Find the eigenvector corresponding to the smallest positive eigenvalue
    var positiveEigenvalues = [];
    var positiveEigenvectors = [];
    for (var i = 0; i < eigenvalues.length; i++) {
        if (eigenvalues[i] > 0 && isFinite(eigenvalues[i])) {
            positiveEigenvalues.push(eigenvalues[i]);
            positiveEigenvectors.push([eigenvectors[0][i], eigenvectors[1][i], eigenvectors[2][i]]);
        }
    }

    if (positiveEigenvalues.length === 0) {
        alert("No positive eigenvalues found; cannot fit an ellipse.");
        return null;
    }

    // Choose the eigenvector corresponding to the smallest positive eigenvalue
    var minIndex = 0;
    var minEigenvalue = positiveEigenvalues[0];
    for (var i = 1; i < positiveEigenvalues.length; i++) {
        if (positiveEigenvalues[i] < minEigenvalue) {
            minEigenvalue = positiveEigenvalues[i];
            minIndex = i;
        }
    }

    var a1 = positiveEigenvectors[minIndex];

    // Compute a2 = T * a1
    var a2 = numeric.dot(T, a1);

    // Assemble the full coefficient vector a = [a1; a2]
    var a = a1.concat(a2);

    // Normalize the coefficients so that the last element is 1
    if (a[5] !== 0) {
        a = numeric.div(a, a[5]);
    }

    // Extract ellipse parameters from the coefficients
    var params = ellipseCoefficientsToParameters(a);

    return params;
}


function ellipseCoefficientsToParameters(a) {
    var A = a[0];
    var B = a[1];
    var C = a[2];
    var D = a[3];
    var E = a[4];
    var F = a[5];

    // Calculate the orientation of the ellipse
    var theta = 0.5 * Math.atan2(B, A - C);

    // Calculate the center in rotated coordinates
    var sin_t = Math.sin(theta);
    var cos_t = Math.cos(theta);

    // Rotate the coordinate system to eliminate the cross-product term B
    var Ao = A * cos_t * cos_t + B * cos_t * sin_t + C * sin_t * sin_t;
    var Co = A * sin_t * sin_t - B * cos_t * sin_t + C * cos_t * cos_t;
    var Do = D * cos_t + E * sin_t;
    var Eo = -D * sin_t + E * cos_t;

    // Compute the center in rotated coordinates
    var x0_prime = -Do / (2 * Ao);
    var y0_prime = -Eo / (2 * Co);

    // Compute the semi-major and semi-minor axes
    var F0 = F + Ao * x0_prime * x0_prime + Do * x0_prime + Co * y0_prime * y0_prime + Eo * y0_prime;

    if (Ao === 0 || Co === 0) {
        alert("Degenerate ellipse.");
        return null;
    }

    var a_axis = Math.sqrt(Math.abs(-F0 / Ao));
    var b_axis = Math.sqrt(Math.abs(-F0 / Co));

    // Ensure that a_axis is the semi-major axis
    if (a_axis < b_axis) {
        var temp = a_axis;
        a_axis = b_axis;
        b_axis = temp;
        theta += Math.PI / 2;
    }

    // Transform the center back to the original coordinates
    var x0 = x0_prime * cos_t - y0_prime * sin_t;
    var y0 = x0_prime * sin_t + y0_prime * cos_t;

    // Normalize theta to be between 0 and 2*pi
    theta = theta % (2 * Math.PI);

    $.writeln("Center X: " + x0);
    $.writeln("Center Y: " + y0);
    $.writeln("Semi-Major Axis: " + a_axis);
    $.writeln("Semi-Minor Axis: " + b_axis);

    return {
        cx: x0,
        cy: y0,
        a: a_axis,
        b: b_axis,
        theta: theta
    };
}


// Function to draw the ellipse based on parameters
function drawEllipse(params) {
    var centerX = params.cx; // Already in pixels
    var centerY = params.cy;
    var rx = params.a;
    var ry = params.b;
    var rotation = params.theta * (180 / Math.PI); // Convert to degrees

    drawEllipseShape(centerX, centerY, rx * 2, ry * 2, rotation);
}

function drawEllipseShape(centerX, centerY, width, height, rotationAngle) {
    // Debug message with parameters
    $.writeln("Debug Info:\nCenter X: " + centerX + "\nCenter Y: " + centerY + 
          "\nWidth: " + width + "\nHeight: " + height + 
          "\nRotation Angle: " + rotationAngle);

    // Store original ruler units and set to pixels
    var originalRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;

    // Calculate bounds
    var left = centerX - (width / 2);
    var top = centerY - (height / 2);
    var right = centerX + width / 2;
    var bottom = centerY + height / 2;

    $.writeln("Bounds: Left: " + left + ", Top: " + top + ", Right: " + right + ", Bottom: " + bottom);

    // Create the ellipse
    createEllipse([left, top, right, bottom], 255, 0, 0); // Red ellipse

    // Restore original ruler units
    app.preferences.rulerUnits = originalRulerUnits;

    // Apply rotation if needed
    if (rotationAngle !== 0) {
        // Apply rotation around the ellipse center
        rotateLayer(centerX, centerY, rotationAngle);
    }

    //alert("Shape creation completed.");
}

function rotateLayer(centerX, centerY, rotationAngle) {
    var idTrnf = charIDToTypeID("Trnf");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref.putEnumerated(idLyr, idOrdn, idTrgt);
    desc.putReference(idnull, ref);

    var idFTcs = charIDToTypeID("FTcs");
    var idQCSt = charIDToTypeID("QCSt");
    var idQcsa = charIDToTypeID("Qcsa");
    desc.putEnumerated(idFTcs, idQCSt, idQcsa);

    // Set the anchor point for rotation
    var idPnt = charIDToTypeID("Pnt ");
    var descAnchor = new ActionDescriptor();
    var idHrzn = charIDToTypeID("Hrzn");
    var idPxl = charIDToTypeID("#Pxl");
    descAnchor.putUnitDouble(idHrzn, idPxl, centerX);
    var idVrtc = charIDToTypeID("Vrtc");
    descAnchor.putUnitDouble(idVrtc, idPxl, centerY);
    desc.putObject(idPnt, idPnt, descAnchor);

    var idAngl = charIDToTypeID("Angl");
    desc.putUnitDouble(idAngl, charIDToTypeID("#Ang"), rotationAngle);

    executeAction(idTrnf, desc, DialogModes.NO);
}


function createEllipse(theBounds, theR, theG, theB) {
    $.writeln("Creating ellipse shape with bounds: " + theBounds + ", color: " + theR + ", " + theG + ", " + theB);
    var idpixelsUnit = stringIDToTypeID("pixelsUnit");
    var idmake = stringIDToTypeID("make");
    var desc1 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref1 = new ActionReference();
    var idcontentLayer = stringIDToTypeID("contentLayer");
    ref1.putClass(idcontentLayer);
    desc1.putReference(idnull, ref1);
    var idusing = charIDToTypeID("Usng");
    var desc2 = new ActionDescriptor();
    var idtype = charIDToTypeID("Type");
    var desc3 = new ActionDescriptor();
    var idcolor = charIDToTypeID("Clr ");
    var desc4 = new ActionDescriptor();
    var idred = charIDToTypeID("Rd  ");
    desc4.putDouble(idred, theR);
    var idgreen = charIDToTypeID("Grn ");
    desc4.putDouble(idgreen, theG);
    var idblue = charIDToTypeID("Bl  ");
    desc4.putDouble(idblue, theB);
    var idRGBColor = stringIDToTypeID("RGBColor");
    desc3.putObject(idcolor, idRGBColor, desc4);
    var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
    desc2.putObject(idtype, idsolidColorLayer, desc3);
    var idshape = charIDToTypeID("Shp ");
    var desc5 = new ActionDescriptor();
    var idunitValueQuadVersion = stringIDToTypeID("unitValueQuadVersion");
    desc5.putInteger(idunitValueQuadVersion, 1);
    var idtop = charIDToTypeID("Top ");
    desc5.putUnitDouble(idtop, idpixelsUnit, theBounds[1]);
    var idleft = charIDToTypeID("Left");
    desc5.putUnitDouble(idleft, idpixelsUnit, theBounds[0]);
    var idbottom = charIDToTypeID("Btom");
    desc5.putUnitDouble(idbottom, idpixelsUnit, theBounds[3]);
    var idright = charIDToTypeID("Rght");
    desc5.putUnitDouble(idright, idpixelsUnit, theBounds[2]);
    var idellipse = stringIDToTypeID("ellipse");
    desc2.putObject(idshape, idellipse, desc5);
    desc1.putObject(idusing, idcontentLayer, desc2);
    executeAction(idmake, desc1, DialogModes.NO);
}
