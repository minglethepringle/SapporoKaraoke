
/**
 * Adds a YouTube video to the karaoke queue
 * @param {string} id The YouTube ID of the video to add to queue
 * @returns A Promise as a callback
 */
export function addToQueue(id) {
    /*return fetch("http://173.48.191.46:51581/WebBrowser/Command", {
        method : "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            command: "addyoutubesong",
            limit: "mp4",
            id: url
        })
    });*/
    return fetch("http://localhost:3000");
}