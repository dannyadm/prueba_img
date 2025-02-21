const width = 320;    // We will scale the photo width to this
const height = 0;     // This will be computed based on the input stream
 
 
 
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const canvasOut = document.getElementById('canvasExampleFilters');
const photo = document.getElementById('photo');
const photo2 = document.getElementById('photo2');
const captureButton = document.getElementById('capture');
const changeCamera = document.getElementById('changeCamera');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const resultadoDecoded = document.getElementById('resultadoDecoded');
const decodeBtn = document.getElementById('decodeBtn');
 
const videoContainer = document.getElementById("auxContainer");
const fullscreenControls = document.getElementById("fullscreenControls");
 
const codeReader = new ZXing.BrowserPDF417Reader()
 
let useFrontCamera = true; // Variable para alternar entre frontal y trasera
let stream = null;
 
var FACING_MODES = JslibHtml5CameraPhoto.FACING_MODES;
 
function startCamera() {
    var cameraPhoto = new JslibHtml5CameraPhoto.default(video);
    var facingMode = "ENVIRONMENT"//USER
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
 
 
document.addEventListener('DOMContentLoaded', function () {
 
    function startCamera_native() {
        //alert('Es un celular:::' + isMobile)
        if (stream) {
            stream.getTracks().forEach(track => track.stop()); // Detener la cámara actual antes de cambiar
        }
 
        const constraints = {
            // video: {
            //     facingMode: useFrontCamera ? 'user' : 'environment'
            // }
            video: {
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 480, ideal: 720, max: 1080 },
                frameRate: { ideal: 60, max: 60 },
                facingMode: useFrontCamera ? 'user' : 'environment' // Cámara frontal o trasera
            }
        };
 
        navigator.mediaDevices.getUserMedia(constraints)
            .then(newStream => {
                stream = newStream;
                video.srcObject = newStream;
            })
            .catch(err => console.error("Error al acceder a la cámara: ", err));
    }
 
 
 
 
 
 
 
    // function capturePhoto() {
    //     const context = canvas.getContext('2d');
 
    //     let videoWidth = video.videoWidth;
    //     let videoHeight = video.videoHeight;
 
    //     // Ajustamos el tamaño del canvas antes de obtener el contexto
    //     canvas.width = videoWidth ;  // Intercambiamos ancho y alto para la rotación
    //     canvas.height = videoHeight;
 
    //     console.log('Canvas Width:', canvas.width);
    //     console.log('Canvas Height:', canvas.height);
 
    //     context.save(); // Guardamos el contexto antes de hacer transformaciones
 
    //     // Trasladamos el origen de coordenadas antes de rotar
    //     //context.translate(canvas.width, 0);
    //     //context.rotate(Math.PI / 2); // Rotamos 90° (Pi/2 radianes)
 
    //     // Dibujamos la imagen en la nueva orientación
    //     console.log("video params",0, videoHeight, videoWidth)
    //     context.drawImage(video,videoHeight, videoWidth);
 
    //     context.restore(); // Restauramos el contexto
    //     console.log("fin captura",canvas.toDataURL('image/png'))
    //     // Convertimos el contenido del canvas en imagen
    //     photo.src = canvas.toDataURL('image/png');
    // }
 
    function clearPhoto() {
        const context = canvas.getContext("2d");
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);
 
        const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
    }
 
    function capturePhoto() {
        const context = canvas.getContext("2d");
        // if (width && height) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
 
 
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
 
        const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
 
 
        console.log("antese de filtro")
 
        canvasOut.width = video.videoWidth;
        canvasOut.height = video.videoHeight;
 
        var imageExampleFilters = new MarvinImage();
        var imageExampleFiltersOut;
        imageExampleFilters.load(data, function () {
            imageExampleFilters.draw(canvasOut);
            console.log("imageExampleFilters.getWidth", imageExampleFilters.getWidth(), imageExampleFilters.getHeight())
            imageExampleFiltersOut = new MarvinImage(imageExampleFilters.getWidth(), imageExampleFilters.getHeight())
            console.log("carga de filtro")
 
            //Gris
            // Marvin.grayScale(imageExampleFilters, imageExampleFiltersOut);
            // imageExampleFiltersOut.draw(canvasOut);
            //B/W
            // Marvin.blackAndWhite(imageExampleFilters, imageExampleFiltersOut, 60);
            // imageExampleFiltersOut.draw(canvasOut);
            //Emboss
            // Marvin.emboss(imageExampleFilters, imageExampleFiltersOut);
            // imageExampleFiltersOut.draw(canvasOut);
            //Edge
            // imageExampleFiltersOut.clear(0xFF000000);
            // Marvin.prewitt(imageExampleFilters, imageExampleFiltersOut);
            // imageExampleFiltersOut.draw(canvasOut)
            //Grey and Brigth contrast
            Marvin.grayScale(imageExampleFilters, imageExampleFilters);
            Marvin.brightnessAndContrast(imageExampleFilters,
                imageExampleFiltersOut, 80, 80);
            imageExampleFiltersOut.draw(canvasOut);
            console.log("termina filtro")
 
            // photo.width=video.videoHeight
            // photo.height=video.videoWidth
            photo.src = canvasOut.toDataURL('image/png');
            photo2.src = canvasOut.toDataURL('image/png');
 
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
 
                alert("es movil")
                photo.onload = () => {
                    const context = canvasOut.getContext('2d');
                    // Ajustamos el tamaño del canvas antes de obtener el contexto
                    canvasOut.width = video.videoHeight;  // Intercambiamos ancho y alto para la rotación
                    canvasOut.height = video.videoWidth;
                    context.save(); // Guardamos el contexto antes de hacer transformaciones
                    // Trasladamos el origen de coordenadas antes de rotar
                    context.translate(canvasOut.width, 0);
                    context.rotate(Math.PI / 2); // Rotamos 90° (Pi/2 radianes)
 
                    // Dibujamos la imagen en la nueva orientación
                    context.drawImage(photo, 0, 0, video.videoWidth, video.videoHeight);
 
                    context.restore(); // Restauramos el contexto
                    console.log("termina giro")
 
                    photo2.width = video.videoHeight
                    photo2.height = video.videoWidth
                    photo2.src = canvasOut.toDataURL('image/png');
                }
            }
 
 
 
            // if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
 
            //     const context = canvasOut.getContext('2d');
            //     // Ajustamos el tamaño del canvas antes de obtener el contexto
            //     canvasOut.width = video.videoHeight;  // Intercambiamos ancho y alto para la rotación
            //     canvasOut.height = video.videoWidth;
            //     context.save(); // Guardamos el contexto antes de hacer transformaciones
            //     // Trasladamos el origen de coordenadas antes de rotar
            //     context.translate(canvasOut.width, 0);
            //     context.rotate(Math.PI / 2); // Rotamos 90° (Pi/2 radianes)
 
            //     // Dibujamos la imagen en la nueva orientación
            //     context.drawImage(canvasOut, video.videoHeight, video.videoWidth);
 
            //     context.restore(); // Restauramos el contexto
            //     // Convertimos el contenido del canvas en imagen
            //     //photo.src = canvas.toDataURL('image/png');
 
            // }
        });
 
 
 
        // } else {
        //     clearPhoto();
        // }
    }
 
 
    const decodeFun = (e) => {
        console.log('Entro a decodificar valoressss');
        try {
            codeReader.decodeFromImage(photo2)
                .then(result => {
                    alert("result p417")
                    console.log("pasa then decode", result.text);
                    let dataParser = parserResult(result.text);
                    console.log('Que fue que llegoooooo::::', dataParser);
                    //console.log(result.text);
                    let jsonString = JSON.stringify(dataParser);
                    alert("result p417", jsonString)
                    resultadoDecoded.textContent = jsonString;
                    //resultDecoded.value = jsonString;
                    //ajustarAltura(resultDecoded);
                })
                .catch(err => {
                    alert("Error p147")
                    console.error(err);
                    resultadoDecoded.textContent = 'Error al decodificar';
                });
 
 
            console.log(`Started decode for image from ${photo.src}`)
 
        } catch (ee) {
            console.log("Errro mainss", ee)
        }
 
 
        console.log(`Started decode for image from ${photo.src}`)
    };
 
    /*function capturePhoto() {
        const context = canvas.getContext('2d');
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
    
        canvas.width = videoWidth;
        canvas.height = videoHeight;
    
        let cropWidth = 435;
        let cropHeight = 290;
        let cropX = (videoWidth - cropWidth) / 2;
        let cropY = (videoHeight - cropHeight) / 2;
    
        let isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
            console.log('Cambio andchoooo');
            cropWidth -= 110;
            cropHeight -= 95;
            cropX = (videoWidth - cropWidth) / 2;
            cropY = (videoHeight - cropHeight) / 2;
        }
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        context.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    
        photo.src = canvas.toDataURL('image/png')
    }*/
 
    function changeOrientationImage() {
        let portrait = window.matchMedia("(orientation: portrait)").matches;
        let isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile && portrait) {
            imgAuxCamera.style.transform = 'rotate(90deg) scale(1, 1)';
        }
    }
 
    function toggleButtons() {
        let isFullscreen = document.fullscreenElement === videoContainer ||
            document.mozFullScreenElement === videoContainer ||
            document.webkitFullscreenElement === videoContainer ||
            document.msFullscreenElement === videoContainer;
 
        /*fullscreenControls.style.display = isFullscreen ? "flex" : "none";
        captureButton.style.display = isFullscreen ? "flex" : "none"
        changeCamera.style.display = isFullscreen ? "flex" : "none"*/
    }
 
    document.addEventListener("fullscreenchange", toggleButtons);
    document.addEventListener("webkitfullscreenchange", toggleButtons);
    document.addEventListener("mozfullscreenchange", toggleButtons);
    document.addEventListener("MSFullscreenChange", toggleButtons);
 
    //setInterval(capturePhoto, 5000);
 
    changeCamera.addEventListener('click', function () {
        useFrontCamera = !useFrontCamera; // Alternar entre cámaras
        startCamera();
    })
 
    captureButton.addEventListener('click', capturePhoto, false)
 
    /*captureButton.addEventListener('click', function () {
        let contador = 0
    
        let interval = setInterval(() => {
            if (contador < 2) {
                capturePhoto()
                contador += 1
            } else {
                clearInterval(interval)
                console.log('Finalizo capturas');
            }
        }, 3000)
    
    });*/
 
    /*fullscreenBtn.addEventListener('click', function () {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    })*/
 
    fullscreenBtn.addEventListener("click", function () {
        if (!document.fullscreenElement) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    });
 
    decodeBtn.addEventListener('click', decodeFun, false);
 
 
    //startCamera()
    //changeOrientationImage()
    //fullscreenBtn.click()
})
 
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