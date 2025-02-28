document.addEventListener('DOMContentLoaded', function () {
    var FACING_MODES = JslibHtml5CameraPhoto.FACING_MODES;
    var IMAGE_TYPES = JslibHtml5CameraPhoto.IMAGE_TYPES;
    var videoElement = document.getElementById('videoId');
    var imgElement = document.getElementById('imgId');
    var btnDemoCapture = document.getElementById('btnDemoCapture');
    var btnRecorte = document.getElementById('btnRecorte');
    var btnDecoded = document.getElementById('btnDecoded');
    var resultDecoded = document.getElementById('resultDecoded');
    var divVideo = document.getElementById('divVideo');
    const divResult = document.getElementById('result');
    const divProcces = document.getElementById('imgProccess');
    const divRecort = document.getElementById('imgResult');
    // const canvasCapture = document.getElementById('canvasCapture');
    const imgRotated = document.getElementById('imgRotated');
    var takePhotoButtonElement = document.getElementById('takePhotoButtonId');
    var stopCameraButtonElement = document.getElementById('stopCameraButtonId');

    const codeReader = new ZXing.BrowserPDF417Reader()
    var cameraPhoto = new JslibHtml5CameraPhoto.default(videoElement);
    const scanner = new jscanify();


    function startCameraMaxResolution() {
        //var facingMode = facingModeSelectElement.value;
        var facingMode = 'ENVIRONMENT';
        cameraPhoto.startCameraMaxResolution(FACING_MODES[facingMode])
            .then(() => {
                var log =
                    `Camera started with maximum resoluton and ` +
                    `prefered facingMode : ${facingMode}`;
                console.log(log);
            })
            .catch((error) => {
                console.error('Camera not started!', error);
            });
    }

    function stopCamera() {
        cameraPhoto.stopCamera()
            .then(() => {
                console.log('Camera stoped!');
            })
            .catch((error) => {
                console.log('No camera to stop!:', error);
            });
        divVideo.style.display = 'none'
    }

    /*function takePhoto() {
        var config = {
            sizeFactor: 1,
            imageType: IMAGE_TYPES.PNG,
            imageCompression: 1
        };

        var dataUri = cameraPhoto.getDataUri(config);
        imgElement.src = dataUri;
        setTimeout(() => {
            let imgWidth = imgElement.width;
            let imgHeight = imgElement.height;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            if (isMobile) {
                console.log('Si es un mobileeeee');
                canvas.width = imgElement.height;
                canvas.height = imgElement.width;
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.save();
                ctx.translate(0, canvas.height);
                ctx.rotate(Math.PI * 1.5);
                ctx.drawImage(imgElement, 0, 0, imgWidth, imgHeight);
            } else {
                console.log('NO es un mobileeeee');
                canvas.width = imgElement.width;
                canvas.height = imgElement.height;
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(imgElement, 0, 0);
            }
            let mat = cv.imread(canvas);
            cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY);
            cv.imshow(canvas, mat);
            canvas.toBlob(function(blob) {
                var url = URL.createObjectURL(blob);
                imgRotated.src = url;
            }, 'image/png');

        }, 20);

        stopCamera()
    }*/

    function takePhoto() {
        var config = {
            sizeFactor: 1,
            imageType: IMAGE_TYPES.PNG,
            imageCompression: 1
        };

        var dataUri = cameraPhoto.getDataUri(config);
        console.log('Tipo de image de variable', typeof dataUri);
        imgElement.src = dataUri;
        setTimeout(() => {
            let imgWidth = imgElement.naturalWidth;
            let imgHeight = imgElement.naturalHeight;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            if (isMobile) {
                console.log('Si es un mobileeeee');
                canvas.width = imgElement.naturalHeight;
                canvas.height = imgElement.naturalWidth;
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.save();
                ctx.translate(0, canvas.height);
                ctx.rotate(Math.PI * 1.5);
                ctx.filter = 'grayscale(1)';
                ctx.drawImage(imgElement, 0, 0, imgWidth, imgHeight);
            } else {
                console.log('NO es un mobileeeee');
                canvas.width = imgElement.naturalWidth;
                canvas.height = imgElement.naturalHeight;
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.filter = 'grayscale(1)';
                ctx.drawImage(imgElement, 0, 0, imgWidth, imgHeight);
            }

            const imagenData = canvas.toDataURL('image/png');
            imgRotated.src = imagenData;

        }, 20);

        stopCamera()
    }

    /*function cutImage() {
        divResult.style.display = 'block'
        const highlightedCanvas = scanner.highlightPaper(imgElement);
        divProcces.src = highlightedCanvas.toDataURL('image/png');
        //divResult.appendChild(highlightedCanvas);

        const contour = scanner.findPaperContour(cv.imread(imgElement));
        const cornerPoints = scanner.getCornerPoints(contour);
        console.log('Coordenadas obtenidasss:', cornerPoints);

        let newSisze = getSizeNewImage(cornerPoints)
        console.log('Nuevas dimensioness', newSisze);

        const extractedCanvas = scanner.extractPaper(imgElement, newSisze.newWith, newSisze.newHeight);
        divRecort.src = extractedCanvas.toDataURL('image/png');

    }*/

    /*function cutImage() {
        divResult.style.display = 'block';

        const highlightedCanvas = scanner.highlightPaper(imgElement);
        divProcces.src = highlightedCanvas.toDataURL('image/png');

        const contour = scanner.findPaperContour(cv.imread(imgElement));
        const cornerPoints = scanner.getCornerPoints(contour);
        console.log('Coordenadas obtenidasss:', cornerPoints);

        const scaleFactor = window.devicePixelRatio || 1;
        let newSisze = getSizeNewImage(cornerPoints);
        console.log('Nuevas dimensioness', newSisze);

        const extractedCanvas = document.createElement('canvas');
        extractedCanvas.width = newSisze.newWith * scaleFactor;
        extractedCanvas.height = newSisze.newHeight * scaleFactor;
        const extractedCtx = extractedCanvas.getContext('2d');

        const adjustedX = cornerPoints.topLeftCorner.x * scaleFactor;
        const adjustedY = cornerPoints.topLeftCorner.y * scaleFactor;
        const adjustedWidth = newSisze.newWith * scaleFactor;
        const adjustedHeight = newSisze.newHeight * scaleFactor;

        extractedCtx.drawImage(
            imgElement,  // Imagen original
            adjustedX, adjustedY, adjustedWidth, adjustedHeight,
            0, 0, extractedCanvas.width, extractedCanvas.height
        );

        divRecort.src = extractedCanvas.toDataURL('image/png');
    }*/

    function cutImage() {
        divResult.style.display = 'block';

        const highlightedCanvas = scanner.highlightPaper(imgRotated);
        divProcces.src = highlightedCanvas.toDataURL('image/png');

        const contour = scanner.findPaperContour(cv.imread(imgRotated));
        const cornerPoints = scanner.getCornerPoints(contour);
        console.log('Coordenadas obtenidasss:', cornerPoints);

        const imgWidth = imgRotated.naturalWidth;
        const imgHeight = imgRotated.naturalHeight;
        const displayWidth = imgRotated.width;
        const displayHeight = imgRotated.height;

        const scaleX = imgWidth / displayWidth;
        const scaleY = imgHeight / displayHeight;

        let newSisze = getSizeNewImage(cornerPoints);
        console.log('Nuevas dimensioness', newSisze);

        const adjustedX = cornerPoints.topLeftCorner.x * scaleX;
        const adjustedY = cornerPoints.topLeftCorner.y * scaleY;
        const adjustedWidth = (cornerPoints.topRightCorner.x - cornerPoints.topLeftCorner.x) * scaleX;
        const adjustedHeight = (cornerPoints.bottomLeftCorner.y - cornerPoints.topLeftCorner.y) * scaleY;

        const extractedCanvas = document.createElement('canvas');
        extractedCanvas.width = adjustedWidth;
        extractedCanvas.height = adjustedHeight;
        const extractedCtx = extractedCanvas.getContext('2d');

        alert("Resolucion ajustada:" + adjustedWidth + " x " + adjustedHeight + " sisze:" + JSON.stringify(newSisze))

        extractedCtx.drawImage(
            imgRotated,  // Imagen original
            adjustedX, adjustedY, adjustedWidth, adjustedHeight,
            0, 0, extractedCanvas.width, extractedCanvas.height
        );

        divRecort.src = extractedCanvas.toDataURL('image/png');
    }

    function decodeFun(){
        console.log('Entro a decodificar valoressss');
        try {
            codeReader.decodeFromImage(divRecort)
                .then(result => {
                    alert("result p417")
                    console.log("pasa then decode", result.text);
                    let dataParser = parserResult(result.text);
                    console.log('Que fue que llegoooooo::::', dataParser);
                    //console.log(result.text);
                    let jsonString = JSON.stringify(dataParser);
                    alert("result p417", jsonString)
                    resultDecoded.textContent = jsonString;
                    //resultDecoded.value = jsonString;
                    //ajustarAltura(resultDecoded);
                })
                .catch(err => {
                    alert("Error p147")
                    console.error(err);
                    resultDecoded.textContent = 'Error al decodificar:' + err;
                });
 
 
            console.log(`Started decode for image from ${divRecort.src}`)
 
        } catch (ee) {
            console.log("Errro mainss", ee)
            resultDecoded.textContent = 'Errro mainss' + ee;
        }
 
 
        console.log(`Started decode for image from ${divRecort.src}`)
    };

    function getSizeNewImage(corners) {
        const bottomLeft = corners.bottomLeftCorner;
        const bottomRight = corners.bottomRightCorner;
        const topLeft = corners.topLeftCorner;
        const topRight = corners.topRightCorner;

        let side1 = Math.abs(bottomRight.x - bottomLeft.x)
        let side2 = Math.abs(topRight.x - topLeft.x)
        let side3 = Math.abs(bottomRight.y - topRight.y)
        let side4 = Math.abs(bottomLeft.y - topLeft.y)

        let newWith = Math.round((side1 + side2) / 2);
        let newHeight = Math.round((side3 + side4) / 2);

        return { newWith, newHeight }

    }

    btnDemoCapture.addEventListener('click', function () {
        divVideo.style.display = 'block'
        startCameraMaxResolution();
    })

    btnRecorte.addEventListener('click', cutImage, false)
    takePhotoButtonElement.addEventListener('click', takePhoto, false)
    stopCameraButtonElement.addEventListener('click', stopCamera, false)
    btnDecoded.addEventListener('click', decodeFun, false)

});

function parserResult(text) {
    console.log('Llego a crear objetooooo');
    return {
        afis_code: cleanString(text.substring(2, 10)),
        finger_card: cleanString(text.substring(40, 48)),
        document_number: cleanString(text.substring(48, 58)),
        last_name: cleanString(text.substring(58, 80)),
        second_last_name: cleanString(text.substring(81, 104)),
        first_name: cleanString(text.substring(104, 127)),
        middle_name: cleanString(text.substring(127, 150)),
        gender: cleanString(text.substring(151, 152)),
        birth_date: `${cleanString(text.substring(152, 156))}-${cleanString(text.substring(156, 158))}-${cleanString(text.substring(158, 160))}`.replace(/[^0-9-]/g, ''),
        municipality_code: cleanString(text.substring(160, 162)),
        department_code: cleanString(text.substring(162, 165)),
        blood_type: cleanString(text.substring(166, 168))
    };
}
 
function cleanString(text) {
    return text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚ+-]/g, '').trim()
}

