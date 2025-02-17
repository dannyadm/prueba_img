document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const captureButton = document.getElementById('capture');
    const changeCamera = document.getElementById('changeCamera');
    let useFrontCamera = true; // Variable para alternar entre frontal y trasera
    let stream = null;

    function startCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop()); // Detener la cámara actual antes de cambiar
        }

        const constraints = {
            // video: {
            //     facingMode: useFrontCamera ? 'user' : 'environment'
            // }
            video: {
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

    /*function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => { video.srcObject = stream; })
            .catch(err => console.error("Error al acceder a la cámara: ", err));
    }*/

    function capturePhoto() {
        contador =+ 1
        const context = canvas.getContext('2d');
        canvas.width = 435;
        canvas.height = 290;
        //context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.drawImage(video, 100,85, 435, 290, 0, 0, 435, 290);

        // Convertir la imagen a base64 y mostrarla
        photo.src = canvas.toDataURL('image/png');
    }

    //setInterval(capturePhoto, 5000);

    changeCamera.addEventListener('click', function() {
        useFrontCamera = !useFrontCamera; // Alternar entre cámaras
        startCamera();
    })

    captureButton.addEventListener('click', function() {
        let contador = 0

        let interval = setInterval(() => {
            if (contador < 5) {
                capturePhoto()
                contador += 1
            }else {
                clearInterval(interval)
                console.log('Finalizo capturas');
            }
        }, 3000)
        
    });

    startCamera()
})