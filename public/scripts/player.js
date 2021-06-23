YOUTUBE_API_KEY = "AIzaSyBhnISQT3jgEWZdu_RD7thslDzMPdJat_s";
let playem = null;
let queueSearchTimer = null;
let PLAYING_TRACK = false;

function setPlaying(bool) {
    PLAYING_TRACK = bool;
}

function getNextInQueue() {
    if(!PLAYING_TRACK) {
        fetch("/getnext", {
            method : "GET"
        }).then((res) => {
            res.json().then(data => {
                if(data.url != null && data.url.length > 0) {
                    addToQueue(data.url);
                }
            });
        });
    }
}

function addToQueue(link) {
    playem.addTrackByUrl(link);
    if(!PLAYING_TRACK) {
        playem.play(0); // play first in queue
    }
}

function playemInit() {
    const config = {
        playerContainer: document.getElementById("video")
    };

    // init playem and players
    playem = new Playem({
        loop: false,
    });
    playem.addPlayer(YoutubePlayer, config);
    playem.on("onPlay", () => {
        setPlaying(true);
    });
    playem.on("onEnd", () => {
        setPlaying(false);
    });
    playem.on("onPause", () => {
        setPlaying(false)
    });

    // Every 30 seconds, if not playing a video, get the next one.
    queueSearchTimer = setInterval(getNextInQueue, 5000);
}

playemInit();