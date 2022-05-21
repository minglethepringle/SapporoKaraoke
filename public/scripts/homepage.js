document.getElementById("search").onclick = function() {
    let keyword = document.getElementById("search-keyword").value;
    if(keyword.length <= 0) {
        alert("You must enter something in the search bar!");
        return;
    }
    
    searchByKeyword(keyword, 15, (list) => {
        let resultsBody = "";

        for(let item of list) {
            let thumbnail = item.snippet.thumbnails.high.url;
            let title = item.snippet.title;
            let channel = item.snippet.channelTitle;
            let videoId = item.id.videoId;
            let url = `https://www.youtube.com/watch?v=${videoId}`;
            /*resultsBody += `
                <tr>
                    <td><img src="${thumbnail}" class="results-img"/></td>
                    <td>${title}</td>
                    <td>${channel}</td>
                    <td><button onclick="addToQueue('${url}')">Add To Queue</button></td>
                </tr>
            `;*/
            resultsBody += `
                <tr>
                    <td>
                    <iframe src="https://www.youtube.com/embed/${videoId}" style="border:0px #ffffff none;" scrolling="no" frameborder="1" marginheight="0px" marginwidth="0px" width="100%"></iframe>
                    </td>
                    <td>
                        ${title} <br/>
                        <a href="${url}" target="_blank">Watch on YouTube</a>
                        </td>
                    <td>${channel}</td>
                    <td><button onclick="addToQueue('${videoId}')">Add To Queue</button></td>
                </tr>
            `;
        }

        document.getElementById("results").innerHTML = resultsBody;

    });
}

function addToQueue(url) {
    // fetch("/addtoqueue", {
    //     method : "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body : JSON.stringify({
    //         url: url
    //     })
    // }).then(() => {
    //     alert("Added video to queue!");
    // });
    // fetch("http://192.168.1.50:2010/WebBrowser/Command", {
    fetch("http://173.48.191.46:51581/WebBrowser/Command", {
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
    }).then(() => {
        alert("Added video to queue!");
    }).catch(() => {
        alert("Could not add video!");
    });
}