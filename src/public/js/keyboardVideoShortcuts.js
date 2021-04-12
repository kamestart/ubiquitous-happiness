const video = document.getElementById("video")


document.addEventListener("keypress", function(event) {
    var isFullScreen = false;
    var paused = false
    if (event.keyCode === 70) {
        if (isFullScreen === false) {
            video.requestFullscreen();
            isFullScreen = true;
            console.log(isFullScreen)
        } else if ( isFullScreen === true ) {
            video.exitFullScreen();
            isFullScreen = false;
        }
    } else if ( event.keyCode == 32 ) {
        if (paused == false) {
            video.pause();
            paused = true;
            console.log(paused)
        } else if (paused === true) {
            video.play();
            paused = false;
        }
    }
});