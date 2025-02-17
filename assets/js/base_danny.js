document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const imgAuxCamera = document.getElementById('imgAuxCamera');
    const captureButton = document.getElementById('capture');
    const changeCamera = document.getElementById('changeCamera');

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

    /*function capturePhoto() {
        contador =+ 1
        const context = canvas.getContext('2d');
        
        let isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        alert('Es un celularrrrrr:' + isMobile)
        if (isMobile) {
            canvas.width = 350;
            canvas.height = 210;
            context.drawImage(video, 0,0, 350, 210, 0, 0, 350, 210);
        }else {
            canvas.width = 435;
            canvas.height = 290;
            context.drawImage(video, 100,85, 435, 290, 0, 0, 435, 290);
        }
        //context.drawImage(video, 0, 0, canvas.width, canvas.height);
        

        // Convertir la imagen a base64 y mostrarla
        photo.src = canvas.toDataURL('image/png');
    }*/

    function capturePhoto() {
        const context = canvas.getContext('2d');
    
        // Obtener las dimensiones reales del video
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
    
        // Configurar el tamaño del canvas en función de las dimensiones del video
        canvas.width = videoWidth;
        canvas.height = videoHeight;
    
        // Definir las dimensiones y posición del recorte
        const cropWidth = 435;
        const cropHeight = 290;
        const cropX = (videoWidth - cropWidth) / 2; // Centrar el recorte horizontalmente
        const cropY = (videoHeight - cropHeight) / 2; // Centrar el recorte verticalmente
    
        // Dibujar la imagen recortada en el canvas
        context.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    
        // Establecer la fuente de la imagen como el contenido del canvas
        photo.src = canvas.toDataURL('image/png')
    }

    //setInterval(capturePhoto, 5000);

    changeCamera.addEventListener('click', function() {
        useFrontCamera = !useFrontCamera; // Alternar entre cámaras
        startCamera();
    })

    captureButton.addEventListener('click', function() {
        let contador = 0

        let interval = setInterval(() => {
            if (contador < 3) {
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