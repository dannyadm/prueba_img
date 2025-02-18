document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
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

    function startCamera() {
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

    /*function capturePhoto() {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight

        let portrait = window.matchMedia("(orientation: portrait)").matches;
        let isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile && portrait) {
            context.save(); // Guardar el estado actual del contexto
            context.scale(-1, 1); // Invertir horizontalmente
            context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height); // Dibujar la imagen reflejada
            context.restore();
        } else {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        photo.src = canvas.toDataURL('image/png')
    }*/

    /*function capturePhoto() {
        const context = canvas.getContext('2d');
        console.log('Withhhhhh videoooo:' + canvas.width);
        console.log('heightttt videoooo:' + canvas.height);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        console.log('Withhhhhh videoooo:' + video.videoWidth);
        console.log('heightttt videoooo:' + video.videoHeight);

        let portrait = window.matchMedia("(orientation: portrait)").matches;
        let isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        context.save();

        //if (isMobile && portrait) {
            //canvas.width = video.videoHeight;
            //canvas.height = video.videoWidth;
            //context.translate(canvas.width, canvas.height);
            //context.rotate(Math.PI);
        //}
        canvas.width = video.videoHeight;
        canvas.height = video.videoWidth;
        context.translate(canvas.height, 0);
        context.rotate(Math.PI / 2);
        console.log('Withhhhhh videoooo:' + canvas.width);
        console.log('heightttt videoooo:' + canvas.height);
        context.drawImage(video, 0, 0, canvas.height, canvas.width);
        context.restore();

        photo.src = canvas.toDataURL('image/png');
    }*/

    function capturePhoto() {
        const context = canvas.getContext('2d');
    
        let videoWidth = video.videoWidth;
        let videoHeight = video.videoHeight;
    
        // Ajustamos el tamaño del canvas antes de obtener el contexto
        canvas.width = videoHeight;  // Intercambiamos ancho y alto para la rotación
        canvas.height = videoWidth;
    
        console.log('Canvas Width:', canvas.width);
        console.log('Canvas Height:', canvas.height);
    
        context.save(); // Guardamos el contexto antes de hacer transformaciones
    
        // Trasladamos el origen de coordenadas antes de rotar
        context.translate(canvas.width, 0); 
        context.rotate(Math.PI / 2); // Rotamos 90° (Pi/2 radianes)
    
        // Dibujamos la imagen en la nueva orientación
        context.drawImage(video, 0, 0, videoWidth, videoHeight);
    
        context.restore(); // Restauramos el contexto
    
        // Convertimos el contenido del canvas en imagen
        photo.src = canvas.toDataURL('image/png');
    }

    const decodeFun = (e) => {
        console.log('Entro a decodificar valoressss');
        codeReader.decodeFromImage(photo)
            .then(result => {
                console.log(result.text);
                let dataParser = parserResult(result.text);
                console.log('Que fue que llegoooooo::::', dataParser);
                //console.log(result.text);
                let jsonString = JSON.stringify(dataParser);
                resultadoDecoded.textContent = jsonString;
                //resultDecoded.value = jsonString;
                //ajustarAltura(resultDecoded);
            })
            .catch(err => {
                console.error(err);
                resultadoDecoded.textContent = 'Error al decodificar';
            });


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


    startCamera()
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