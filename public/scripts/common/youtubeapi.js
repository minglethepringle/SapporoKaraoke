YOUTUBE_API_KEY = "AIzaSyBhnISQT3jgEWZdu_RD7thslDzMPdJat_s";

function searchByKeyword(keyword, numResults, callback) {
    return gapi.client.youtube.search.list({
        "part": [
            "snippet"
        ],
        "maxResults": numResults,
        "q": keyword,
        "safeSearch": "strict",
        "videoEmbeddable": "true",
        "type": "video"
    })
    .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        if(response.result != null) {
            callback(response.result.items)
        } else {
            alert("Something went wrong.");
        }
    },
    function(err) { alert("Something went wrong!") });
}

function loadClient() {
    gapi.client.setApiKey(YOUTUBE_API_KEY);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function() { console.log("GAPI client loaded for API"); },
    function(err) { console.error("Error loading GAPI client for API", err); });
}

gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "1033422400708-450uc4uaalarrtjdj7lv5g45uej5hmki.apps.googleusercontent.com"});
});

// Need Google API to load before loadClient is called
setTimeout(loadClient, 2000);