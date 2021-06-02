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

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey("AIzaSyBhnISQT3jgEWZdu_RD7thslDzMPdJat_s");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    return gapi.client.youtube.search.list({
      "part": [
        "snippet"
      ],
      "maxResults": 25,
      "q": "surfing"
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "1033422400708-450uc4uaalarrtjdj7lv5g45uej5hmki.apps.googleusercontent.com"});
  });