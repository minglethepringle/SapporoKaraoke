document.getElementById("video-addtoqueue").onclick = function() {
    let url = document.getElementById("video-url").value;
    if(url.length <= 0) {
        alert("You must input a valid YouTube URL!");
        return;
    }

    fetch("/addtoqueue", {
        method : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            url: url
        })
    }).then(() => {
        document.getElementById("video-url").value = "";
        alert("Added video to queue!");
    });
}