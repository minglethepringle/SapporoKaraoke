const { TEST_MODE, LOG_MODE, SAVE_DIRECTORY } = require("./config.js")
// Express + HTTPS
const path = require('path');
const express = require('express');
const cors = require('cors')
const fs = require("fs");
const https = require("https");

// SSL
var privateKey = fs.readFileSync('ssl/privkey.pem', 'utf8');
var certificate = fs.readFileSync('ssl/fullchain.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname + '/public')));

let httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
    console.log(`Sapporo Karaoke server listening on port ${port}`)
});

// Moment
const moment = require('moment');

// YT-DLP
const youtubedl = require('youtube-dl-exec');

// LiquidJS Templating Engine
const { Liquid } = require('liquidjs');
const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('views', './public');
app.set('view engine', 'liquid');

// Thumbnail
const { execSync } = require("child_process");
const puppeteer = require('puppeteer');

// MPV
const mpvAPI = require('node-mpv');
const mpv = new mpvAPI();

// Wrapper
class Song {
    /**
     * Creates a new Song object
     * @param {string} title the full title of the YouTube video 
     * @param {*} url the full URL of the YouTube video e.g. https://www.youtube.com/watch?v=kXTkjMdgf7Q
     */
    constructor(title, url) {
        this.title = title;
        this.url = url;
        // Generate random 10 character string
        this.id = Math.random().toString(36).substring(2, 12);
    }

    getVideoId() {
        return this.url.split("v=")[1];
    }

    /**
     * Generates filepath for this song. Example output: SAVE_DIRECTORY + "kXTkjMdgf7Q-someVideoSong263.mp4" e.g. "C:\videos\whatever\kXTkjMdgf7Q-someVideoSong263.mp4"
     */
    getFilePath() {
        let filename = "";
        filename += this.getVideoId();
        filename += "-";
        filename += this.title.replace(/[/\\?%*:|"<> ]/g, ''); // strip invalid characters
        filename += ".mp4";
        return path.join(SAVE_DIRECTORY, filename);
    }
}

/* Actual code */

// QUEUE: Song[]
let QUEUE = [];
// currentlyPlaying: Song (for actual song) or null (for background, queue page, or nothing)
let currentlyPlaying = null;

let backgroundPlaying = false;
let queuePagePlaying = false; // Is the 10 second queue page video playing?

/**
 * Express server; render queue page
 */
app.get('/', (req, res) => {
    res.render("index", {
        currentlyPlaying: currentlyPlaying,
        queue: QUEUE
    });
});

/**
 * Play a song
 */
app.post("/play", cors(), (req, res) => {
    // Check if queueing this song will go over end time
    let now = moment();
    let karaokeEnd = moment(req.body.karaokeEnd, "HH:mm");
    // adding 1 to queue length to factor in adding this song
    let estQueueMin = (QUEUE.length + 1) * 5; // est 5 min per song

    // if now + estQueueTime is AFTER karaokeEnd, queue already goes after end, so deny!
    if (!req.body.override && now.add(estQueueMin, "minutes").isAfter(karaokeEnd)) {
        // DENY!
        res.status(200).send({
            ok: false,
            msg: "Queue is closed for further songs."
        });
        return;
    }

    let song = new Song(req.body.title, req.body.url);
    if (LOG_MODE) console.log("Adding song to queue: " + song.title + " " + song.url);
    addToQueue(song);

    if (LOG_MODE) console.log(`QUEUE: ${JSON.stringify(QUEUE)}`);

    res.status(200).send({
        ok: true
    });
});

/**
 * Skip the current song
 */
app.post("/skip", cors(), (req, res) => {
    if (LOG_MODE) console.log("Skipping song");
    mpv.next("force") // The title is skipped (even if it was the last one) and playback is stopped
    .then(() => {
        res.status(200).send({
            ok: true
        });
    })
    .catch((err) => {
        onError(err);
        res.status(500).send({
            ok: false,
            msg: "Error skipping song"
        });
    });
});

/**
 * Adjust volume by a certain amount, can be positive or negative. Bounded to 0-100
 */
app.post("/volume", cors(), (req, res) => {
    if (req.body.amount == null) {
        res.status(400).send({
            ok: false,
            msg: "No amount specified"
        });
        return;
    }
    if (LOG_MODE) console.log("Adjusting volume by " + req.body.amount);
    mpv.adjustVolume(req.body.amount)
    .then(() => {
        res.status(200).send({
            ok: true
        });
    })
    .catch((err) => {
        onError(err);
        res.status(500).send({
            ok: false,
            msg: "Error adjusting volume"
        });
    });
});

/**
 * Retrieve the queue as a list of objects with the Song id and title
 */
app.get("/queue", cors(), (req, res) => {
    let queue = [];

    // If there is a song playing right now, add it to the queue
    if (currentlyPlaying != null) {
        queue.push({
            id: currentlyPlaying.id,
            title: currentlyPlaying.title
        });
    }

    for (let i = 0; i < QUEUE.length; i++) {
        queue.push({
            id: QUEUE[i].id,
            title: QUEUE[i].title
        });
    }
    res.status(200).send({
        ok: true,
        queue: queue
    });
});

/**
 * Remove song with id from queue
 */
app.post("/remove", cors(), (req, res) => {
    if (req.body.id == null) {
        res.status(400).send({
            ok: false,
            msg: "No id specified"
        });
        return;
    }
    if (LOG_MODE) console.log("Removing song with id " + req.body.id);
    QUEUE = QUEUE.filter(song => song.id != req.body.id);
    res.status(200).send({
        ok: true
    });
});

/**
 * Play specified song with id as the next song in queue
 */
app.post("/playnext", cors(), (req, res) => {
    if (req.body.id == null) {
        res.status(400).send({
            ok: false,
            msg: "No id specified"
        });
        return;
    }
    if (LOG_MODE) console.log("Playing song with id " + req.body.id + " next");
    // Take the song with the specified id out of the queue, and then place it at the front
    let song = QUEUE.filter(song => song.id == req.body.id)[0];
    QUEUE = QUEUE.filter(song => song.id != req.body.id);
    QUEUE.unshift(song);
    res.status(200).send({
        ok: true
    });
});


/**
 * Adds a song to queue; plays it immediately if queue is empty
 * @param {Song} song 
 */
function addToQueue(song) {
    if (song.title == null || song.title == ""
        || song.url == null || song.url == "") {
        console.log("Something's empty!");
        return;
    }

    // If queue is empty and just idling, 
    if (QUEUE.length == 0 && backgroundPlaying) {
        // First download song and then play it. Might have an awkward gap
        downloadSong(song).then(playSong(song))
        .catch(err => onError(err));
    } else {
        // else, add it to the list
        QUEUE.push(song);
        // and download it
        downloadSong(song)
        .catch(err => onError(err));
    }
}

/**
 * Plays the next song in queue, if queue is non-empty
 */
function playNextInQueue() {
    // If queue is empty, background idle checker will play background automatically
    if (QUEUE.length == 0) return;

    nextSong = QUEUE.shift();
    playSong(nextSong);
}

/**
 * Plays a song with a youtube link
 * @param {Song} song 
 */
async function playSong(song) {
    if (LOG_MODE) console.log("Playing song part 1: " + song.title);

    // mpv.pause();
    backgroundPlaying = false;
    currentlyPlaying = song;

    // At this point, the song should either be downloaded or currently downloading
    let queuePageFinished = false;
    playQueuePage()
        .then(() => queuePageFinished = true)
        .catch(err => onError(err));

    // Wait for download and queue page to finish
    let checkIfDownloadFinished = () => {
        if (LOG_MODE) console.log("checking download");
        // If song is downloaded and queue page is finished, play it
        if (fs.existsSync(song.getFilePath()) && queuePageFinished) {
            if (LOG_MODE) console.log("Done! Loading song: " + song.title);
            loadSong(song);
        } else {
            setTimeout(checkIfDownloadFinished, 1000);
        }
    }
    checkIfDownloadFinished();
}

/**
 * Downloads the song file and stores it at its generated path. Returns a Promise that resolves when the download finishes
 */
async function downloadSong(song) {
    if (LOG_MODE) console.log("Downloading song: " + song.title);
    return new Promise((resolve, reject) => {
        if (fs.existsSync(song.getFilePath())) {
            if (LOG_MODE) console.log("Song already downloaded: " + song.title);
            resolve();
        }

        youtubedl(song.url, {
            noCheckCertificates: true,
            noWarnings: true,
            mergeOutputFormat: "mp4", // downloads mp4
            format: "bestvideo[height<=480]+bestaudio/best[height<=480]", // downloads 480p
            addHeader: [
                'referer:youtube.com',
                'user-agent:googlebot'
            ],
            output: song.getFilePath(), // path
        }).then(() => resolve())
        .catch(err => reject(err));
    });
}

async function loadSong(song) {
    await mpv.fullscreen()
    mpv.load(song.getFilePath()).catch(err => onError(err));
}

/**
 * Generates the video of and plays the queue page video for 10 seconds
 */
async function playQueuePage() {
    if (LOG_MODE) console.log("Playing queue page");
    return new Promise(async (resolve, reject) => {
        // Take a screenshot of the queue page
        const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 720,
            deviceScaleFactor: 1,
        });
        
        try {
            if (TEST_MODE) {
                await page.goto('https://localhost:5000');    
            } else {
                await page.goto('https://sapporokaraoke.ddns.net:51581');
            }
        } catch (err) {
            console.log("Error: " + err);
            reject();
        }
        
        await page.screenshot({ path: './media/queue.png' });
        await browser.close();

        // Run ffmpeg to generate video from queue screenshot
        execSync("ffmpeg -hide_banner -loglevel error -y -loop 1 -i ./media/queue.png -c:v libx264 -t 10 -pix_fmt yuv420p -vf scale=960:540 ./media/queuePage.mp4");
        // Add audio
        execSync("ffmpeg -hide_banner -loglevel error -y -i ./media/queuePage.mp4 -i ./media/ding.mp3 -map 0:v -map 1:a -c:v copy ./media/queueVid.mp4");
        // Cleanup
        execSync("cd media && del queue.png queuePage.mp4");
        // Play it
        queuePagePlaying = true;
        await mpv.fullscreen();
        await mpv.load("./media/queueVid.mp4").catch(err => onError(err));;
        let queueVidDuration = await mpv.getDuration().catch(err => onError(err));;
        // After X seconds, the queue page is finished
        setTimeout(() => {
            if (LOG_MODE) console.log("Queue page finished");
            queuePagePlaying = false;
            resolve();
        }, (queueVidDuration + 1) * 1000); // 1 second buffer to allow "end" event to fire but not play next video

        // Cleanup
        setTimeout(() => {
            execSync("cd media && del queueVid.mp4");
        }, 5000);
    });
}

/**
 * Play the background video
 */
async function playBackground() {
    currentlyPlaying = null;
    backgroundPlaying = true;
    await mpv.fullscreen();
    
    // Select a random mp4 file
    const files = await fs.promises.readdir( "./media/bg" );
    const file = files[Math.floor(Math.random() * files.length)];
    if (LOG_MODE) console.log("Playing background video: " + file);
    await mpv.load("./media/bg/" + file).catch(err => onError(err));;
}

function onVideoStop() {
    if (LOG_MODE) console.log(`Statuses: backgroundPlaying: ${backgroundPlaying}, queuePagePlaying: ${queuePagePlaying}, currentlyPlaying: ${currentlyPlaying?.title}`);
    // Was it the background video? If so, keep looping
    if (backgroundPlaying) {
        playBackground();
    }

    // Was it a song or queue page? If song, is there another song in queue? If so, play it. Else, play background
    if (currentlyPlaying != null && !queuePagePlaying) {
        if (QUEUE.length > 0) {
            playNextInQueue();
        } else {
            playBackground();
        }
    }

    // If it was the queue page, don't worry about it :)
}

function onError(err) {
    console.log(err);
    mpv.stop();
    process.exit(1);
}

mpv.on('stopped', onVideoStop);

mpv
.start()
.then(async () => {
    playBackground();
})
.catch(err => onError(err));