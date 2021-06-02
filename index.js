const express = require('express');
const app = express();
const PORT = 3000;
let VIDEO_QUEUE = [""];

/* QUEUE STUFF */
function addToQueue(url) {
    VIDEO_QUEUE.push(url);

    console.log("QUEUE: " + JSON.stringify(VIDEO_QUEUE));
}

// Mutable operation! Shifts video queue by one and deletes most recent.
function getNext() {
    return VIDEO_QUEUE.shift();
}

function clearQueue() {
    VIDEO_QUEUE = [];
}

/* SERVER STUFF */
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/homepage.html');
});
app.get("/player", (req, res) => {
    res.sendFile(__dirname + '/public/player.html');
});

app.get("/getnext", (req, res) => {
    let nextVideo = getNext();
    if(nextVideo != null && nextVideo.length > 0){
        console.log("NEXT VIDEO: " + nextVideo);
        res.send({
            url: nextVideo
        });
    } else {
        res.send({});
    }
});

app.post("/addtoqueue", (req, res) => {
    let url = req.body.url;
    addToQueue(url);

    res.send();
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));