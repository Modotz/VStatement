// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {

    Webcam.set({
        width: window.width,
        height: window.height,
        dest_width: 640,
        dest_height: 480,
        image_format: 'jpeg',
        jpeg_quality: 90
    });

    Webcam.set('constraints', {
        optional: [
            { minWidth: 600 }
        ]
    });

    Webcam.attach('#camera--view');

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[0];
        cameraView.srcObject = stream;
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });
}


cameraTrigger.onclick = function () {
    // take snapshot and get image data  
    //Webcam.snap(function (data_uri) {
    //    // display results in page  
    //    document.getElementById('camera--output').innerHTML =
    //        '<img src="' +
    //        data_uri +
    //        '"/>';

    //    Webcam.upload(data_uri,
    //        '/Signature/Capture/1',
    //        function (code, text) {
    //            //alert('Photo Captured');
    //            console.log(text);
    //        });

    //});

    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    let image_data_url = cameraSensor.toDataURL("image/webp");
    cameraOutput.src = image_data_url;
    cameraOutput.classList.add("taken");
    //console.log(image_data_url);
    
    console.log('vst_id:', Vst);

    $.ajax({
        type: 'POST',
        url: 'https://localhost:7074/api/signature',
        //dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "id": 1,
            "vst_id": Vst,
            "base64data": image_data_url
        }),
        success: function (response) {
            console.log('response: ', response);
            //const obj = JSON.parse(response);
            console.log(response.status);
            if (response.status == true && response.vst_id != null) {
                window.location.href = "/Statement/Vst/" + response.vst_id;
            }
        },
        error: function (e) {
            console.log(e);
        },
    });
}

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);