const TEST_MODE = false;
let BASE_URL = "";
if (TEST_MODE) {
    BASE_URL = "https://localhost:5000";
} else {
    BASE_URL = "https://sapporokaraoke.ddns.net:51581";
}

/**
 * Adds a YouTube video to the karaoke queue
 * @returns A Promise as a callback
 */
export function addToQueue(title, url, karaokeEnd, systemVLC, playingModeDownload, override) {
    if (systemVLC) {
        // CURRENT ONE WITH NO-IP
        return fetch(`${BASE_URL}/play`, {
            // return fetch("https://localhost:5000/play", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Bypass-Tunnel-Reminder": "I love you Wiwwi <3 <3 <3"
            },
            body: JSON.stringify({
                title: title,
                url: url,
                karaokeEnd: karaokeEnd,
                playingModeDownload: playingModeDownload,
                override: override
            })
        });
    } else {
        // UNCOMMENT for KSONGLOVER KARAOKE (port is 2010 for ksonglover)

        // A helper method to get ID from youtube URL
        let youtube_parser = (url) => {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = url.match(regExp);
            return (match && match[7].length == 11) ? match[7] : false;
        }
        let id = youtube_parser(url);

        // Returns a promise to satisfy the "then" chain
        return new Promise((resolve, reject) => {
            // A CORS proxy set up on Heroku to allow CORS from anywhere
            fetch("https://sapporocors.herokuapp.com/https://sapporokaraoke.loca.lt/WebBrowser/Command", {
                method: "POST",
                headers: {
                    "Bypass-Tunnel-Reminder": "I love you Wiwwi <3 <3 <3",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: JSON.stringify({
                    command: "addyoutubesong",
                    limit: "mp4",
                    id: id
                })
            }).then(() => {
                // Simulates typical server response, needs blob so res.json() works
                var blob = new Blob([JSON.stringify({ ok: true, msg: "" })], { type: 'application/json' });
                resolve(new Response(blob));
            }).catch(() => {
                reject();
            });
        });
    }


    // Old old
    // return fetch("https://sapporokaraoke.pagekite.me/WebBrowser/Command", {
    //     method: "POST",
    //     mode: "no-cors",
    //     headers: {
    //         "Content-Type": "application/x-www-form-urlencoded"
    //     },
    //     body: JSON.stringify({
    //         command: "addyoutubesong",
    //         limit: "mp4",
    //         id: id
    //     })
    // });

    // return fetch("http://localhost:3000");
}

/**
 * Skips the current song
 */
export function skipSong() {
    return fetch(`${BASE_URL}/skip`, {
        method: "POST"
    });
}

/**
 * Increases volume by 10%
 */
export function increaseVolume() {
    return fetch(`${BASE_URL}/volume`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            amount: +10
        })
    });
}

/**
 * Decreases volume by 10%
 */
export function decreaseVolume() {
    return fetch(`${BASE_URL}/volume`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            amount: -10
        })
    });
}

/**
 * Retrieve the current queue
 */
export function getQueue() {
    return fetch(`${BASE_URL}/queue`, {
        method: "GET"
    });
}

/**
 * Remove song with id in queue
 */
export function removeSong(songId) {
    return fetch(`${BASE_URL}/remove`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            id: songId
        })
    });
}

/**
 * Play specified song next in queue
 */
export function playNext(songId) {
    return fetch(`${BASE_URL}/playnext`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            id: songId
        })
    });
}