
/**
 * Adds a YouTube video to the karaoke queue
 * @param {string} id The YouTube ID of the video to add to queue
 * @returns A Promise as a callback
 */
export function addToQueue(title, url, thumbnail) {
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
    // return fetch("https://sapporokaraoke.ddns.net:51581/play", {
    return fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Bypass-Tunnel-Reminder": "I love you Wiwwi <3 <3 <3"
        },
        body: JSON.stringify({
            title: title,
            url: url,
            thumbnail: thumbnail
        })
    });
    // return fetch("http://localhost:3000");
}