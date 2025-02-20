document.addEventListener('DOMContentLoaded', function () {
    const FACING_MODES = JslibHtml5CameraPhoto.FACING_MODES;
    const IMAGE_TYPES = JslibHtml5CameraPhoto.IMAGE_TYPES;
    const videoElement = document.getElementById('videoId');
    const imgElement = document.getElementById('imgId');
    const canvas = document.getElementById('canvas');
    const result = document.getElementById('result');
    const divRecort = document.getElementById('extracted');
    const canvasCtx = canvas.getContext('2d');
    const resultCtx = result.getContext('2d');

    const cameraPhoto = new JslibHtml5CameraPhoto.default(videoElement);
    const scanner = new jscanify();
    let contador = 0

    function startCameraMaxResolution() {
        var facingMode = 'ENVIRONMENT';
        cameraPhoto.startCameraMaxResolution(FACING_MODES[facingMode])
            .then(() => {
                console.log('Camra iniciada');

            })
            .catch((error) => {
                console.error('Camera not started!', error);
            });
    }

    function takePhoto() {
        var config = {
            sizeFactor: 1,
            imageType: IMAGE_TYPES.JPG,
            imageCompression: 1
        };

        var dataUri = cameraPhoto.getDataUri(config);
        imgElement.src = dataUri;
    }

    function proccessImg() {

        videoElement.onloadedmetadata = () => {
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            result.width = videoElement.videoWidth;
            result.height = videoElement.videoHeight;

            let intervalo = setInterval(() => {
                if (contador >= 10) {
                    cameraPhoto.stopCamera()
                        .then(() => {
                            console.log('Camera stoped!');
                        })
                        .catch((error) => {
                            console.log('No camera to stop!:', error);
                        });
                    videoElement.style.display = 'none'
                    result.style.display = 'none'
                    clearInterval(intervalo)
                }
                canvasCtx.drawImage(videoElement, 0, 0);
                takePhoto()
                const resultCanvas = scanner.highlightPaper(canvas);
                resultCtx.drawImage(resultCanvas, 0, 0);

                imgElement.onload = function () {
                    const contour = scanner.findPaperContour(cv.imread(imgElement));
                    const cornerPoints = scanner.getCornerPoints(contour);
                    console.log('Coordenadassssssss:', cornerPoints);
                    let isRectangle = validCorners(cornerPoints)
                    if (isRectangle) {
                        console.log('Es un rectangulooo???', isRectangle);
                        contador += 1
                        if (contador == 10) {
                            const extractedCanvas = scanner.extractPaper(imgElement, 640, 400);
                            divRecort.appendChild(extractedCanvas);
                        }
                    } else {
                        console.log('Es un rectangulooo???', isRectangle);
                        contador = 0
                    }

                }

            }, 400)
        }
    }

    function validCorners(corners, tolerance = 20) {
        const bottomLeft = corners.bottomLeftCorner;
        const bottomRight = corners.bottomRightCorner;
        const topLeft = corners.topLeftCorner;
        const topRight = corners.topRightCorner;

        let side1 = Math.abs(bottomRight.x - bottomLeft.x)
        let side2 = Math.abs(topRight.x - topLeft.x)
        let side3 = Math.abs(bottomRight.y - topRight.y)
        let side4 = Math.abs(bottomLeft.y - topLeft.y)

        let distanceVerMax = side1 + tolerance
        let distanceVerMin = side1 - tolerance
        let distanceHorMax = side3 + tolerance
        let distanceHorMin = side3 - tolerance

        if ((side2 >= distanceVerMin && side2 <= distanceVerMax) && (side4 >= distanceHorMin && side4 <= distanceHorMax)) {
            return true
        }

        return false
    }
    startCameraMaxResolution();
    proccessImg()

});
