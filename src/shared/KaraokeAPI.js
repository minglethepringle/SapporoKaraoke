
/**
 * Adds a YouTube video to the karaoke queue
 * @returns A Promise as a callback
 */
export function addToQueue(title, url, karaokeEnd) {

    // UNCOMMENT for KSONGLOVER KARAOKE (port is 2010 for ksonglover)

    // let youtube_parser = (url) => {
    //     var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    //     var match = url.match(regExp);
    //     return (match && match[7].length == 11) ? match[7] : false;
    // }
    // let id = youtube_parser(url);
    // return new Promise((resolve, reject) => {
    //     fetch("https://sapporokaraoke.loca.lt/WebBrowser/Command", {
    //         method: "POST",
    //         mode: "no-cors",
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded",
    //             "Bypass-Tunnel-Reminder": "Test"
    //         },
    //         body: JSON.stringify({
    //             command: "addyoutubesong",
    //             limit: "mp4",
    //             id: id
    //         })
    //     }).then(() => {
    //         var blob = new Blob([JSON.stringify({ok: true, msg: ""})], { type: 'application/json' });
    //         resolve(new Response(blob));
    //     }).catch(() => {
    //         reject();
    //     });
    // });


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

    // CURRENT ONE WITH NO-IP
    return fetch("https://sapporokaraoke.ddns.net:51581/play", {
        // return fetch("https://localhost:5000/play", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Bypass-Tunnel-Reminder": "I love you Wiwwi <3 <3 <3"
        },
        body: JSON.stringify({
            title: title,
            url: url,
            karaokeEnd: karaokeEnd
        })
    });

    // return fetch("http://localhost:3000");
}