/**
 * Loads the YouTube API client, accessible from gapi.client.youtube
 * @param {Function} callback The function called once the YouTube API is done loading
 */
export function loadClient(callback) {
    gapi.load("client:auth2", function () {
        gapi.auth2.init({ client_id: "1033422400708-450uc4uaalarrtjdj7lv5g45uej5hmki.apps.googleusercontent.com" });

        gapi.client.setApiKey(process.env.REACT_APP_YT_API_KEY);
        gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
            .then(() => {
                console.log("GAPI client loaded for API");
                callback();
            },
                () => { console.error("Error loading GAPI client for API", err); });
    });
}

/**
 * Searches YouTube videos by keyword
 * @param {String} keyword 
 * @param {int} numResults 
 * @param {Function} callback 
 * @returns {Object[]} Array of objects representing video search results, sorted by relevance
 */
export function searchByKeyword(keyword, numResults, callback) {
    return gapi.client.youtube.search.list({
        "part": [
            "snippet"
        ],
        "maxResults": numResults,
        "q": keyword,
        "safeSearch": "strict",
        // "videoEmbeddable": "true", // limits # of options
        "type": "video",
    })
        .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response", response);
            if (response.result != null) {
                callback(response.result.items)
            } else {
                alert("Something went wrong.");
            }
        },
            function (err) { alert("Something went wrong!") });
}