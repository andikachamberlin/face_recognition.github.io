//Get elemen video untuk menampilkan kamera
const videoEl = document.getElementById('videoEl');

//Inisiasi function dari faceapi load model
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./model'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./model'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./model'),
    faceapi.nets.faceExpressionNet.loadFromUri('./model'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./model')
])
.then(startCamera);

//Membuat function untuk menampilkan input webcam di elemen video
async function startCamera(){
    navigator.mediaDevices.getUserMedia({video: true})
    .then(function(stream){
        videoEl.srcObject = stream;
    })
    .catch(function(err){
        console.log('Ada yang error');
        console.log(err);
    })
}

//Main function untuk deteksi wajah
function startFunction(){
    //Create canvas untuk detection shape nya
    const canvas = faceapi.createCanvasFromMedia(videoEl);
    document.body.append(canvas);

    //Get video element width dan height nya
    const sizeEl = {width:videoEl.width , height: videoEl.height}
    //Match ukuran canvas dengan video elemen
    faceapi.matchDimensions(canvas, sizeEl);

    //Set interval setiap 0,1 detik
    setInterval(async function(){
        //Memanggil function untuk mendeteksi wajah di video webcam
        const detection = await faceapi.detectAllFaces(
            videoEl,
            new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()//Sistem deteksi menggunakan face landmark
        .withFaceExpressions()//Sistem deteksi menggunakan face expression
        .withFaceDescriptors()
        
        console.log(detection)

        //Membuat detection yang diresize menurut ukuran wajah
        const resizedSizeDetection = faceapi.resizeResults(detection, sizeEl);

        //Mengaplikasikan deteksi di canvas yang telah dibuat tadi, 
        //juga menghapus hasil deteksi yang sebelumnya
        canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedSizeDetection);

    }, 1000);
}

//Listen event saat output webcam sudah mulai muncul di browser
videoEl.addEventListener('playing', startFunction)