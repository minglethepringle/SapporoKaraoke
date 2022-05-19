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
                    <td><button onclick="addToQueue('${url}')">Add To Queue</button></td>
                </tr>
            `;
        }

        document.getElementById("results").innerHTML = resultsBody;

    });
}

function addToQueue(url) {
    fetch("/addtoqueue", {
        method : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            url: url
        })
    }).then(() => {
        alert("Added video to queue!");
    });
}