var seconds = 00;
var tens = 00;
var appendTens = document.getElementById("tens");
var appendSeconds = document.getElementById("seconds");
var Interval;

let mediaRecorder;
let recordedBlobs;

const errorMsgElement = document.querySelector("span#errorMsg");
const recordedVideo = document.querySelector("video#recorded");
const recordButton = document.querySelector("button#record");
const playButton = document.querySelector("button#play");
const playAudioButton = document.querySelector("button#playAudio");



function startTimer() {
    tens++;

    if (tens <= 9) {
        appendTens.innerHTML = "0" + tens;
    }

    if (tens > 9) {
        appendTens.innerHTML = tens;
    }

    if (tens > 99) {
        console.log("seconds");
        seconds++;
        appendSeconds.innerHTML = "0" + seconds;
        tens = 0;
        appendTens.innerHTML = "0" + 0;
    }

    if (seconds > 9) {
        appendSeconds.innerHTML = seconds;
    }
}

recordButton.addEventListener("click", () => {
    if (recordButton.textContent === "Record") return startRecording();
    stopRecording();
    recordButton.textContent = "Record";
    playButton.disabled = false;
    playAudioButton.disabled = false;
});

playButton.addEventListener("click", () => {
    const superBuffer = new Blob(recordedBlobs, { type: "video/webm" });

    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    recordedVideo.play();
});

playAudioButton.addEventListener("click", () => {
    //const superBufferWav = new Blob(recordedBlobs, { type: "audio/wav; codecs=MS_PCM" });
    //var audio = new Audio(superBufferWav);
    //audio.play();

    const superBuffer = new Blob(recordedBlobs, { type: "video/webm" });

    //fetch('/Statement/upload/1', {

    //    // HTTP request type 
    //    method: "POST",
    //    // Sending our blob with our request 
    //    body: superBuffer
    //})
    //    .then(response => alert('Blob Uploaded'))
    //    .catch(err => alert(err));

        var reader = new FileReader();
        reader.readAsDataURL(superBuffer);
        reader.onloadend = function () {
            var base64data = reader.result;
            //console.log(base64data);
            console.log('Vst:', Vst);

            $.ajax({
                type: 'POST',
                url: 'https://localhost:7074/api/statement',
                //dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "id": 1,
                    "vst_id": Vst,
                    "base64data": base64data
                }),
                success: function (response) {
                    console.log('response: ', response);

                },
                error: function (e) {
                    console.log(e);
                },
            });
        }
});

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) recordedBlobs.push(event.data);
}

function startRecording() {
    recordedBlobs = [];
    let options = { mimeType: "video/webm;codecs=vp9,opus" };
    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error("Exception while creating MediaRecorder:", e);
        errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(
            e
        )}`;
        return;
    }
    recordButton.textContent = "Stop Recording";
    playButton.disabled = true;
    mediaRecorder.onstop = (event) => console.log(event);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    console.log("MediaRecorder started", mediaRecorder);

    clearInterval(Interval);
    tens = "00";
    seconds = "00";
    appendTens.innerHTML = tens;
    appendSeconds.innerHTML = seconds;
    Interval = setInterval(startTimer, 10);
}

function stopRecording() {
    mediaRecorder.stop();

    clearInterval(Interval);

}

document.querySelector("button#start").addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        recordButton.disabled = false;
        window.stream = stream;
        const gumVideo = document.querySelector("video#gum");
        gumVideo.srcObject = stream;
    } catch (e) {
        console.error("navigator.getUserMedia error:", e);
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
});





