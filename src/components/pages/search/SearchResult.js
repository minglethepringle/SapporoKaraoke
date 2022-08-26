import { Button, Card } from "react-bootstrap";
import * as karaoke from "../../../shared/KaraokeAPI";
import makeToast from "../../../shared/MakeToast";

export default function SearchResult(props) {
    let title = props.video.snippet.title;
    let channel = props.video.snippet.channelTitle;
    let videoId = props.video.id.videoId;
    let thumbnailURL = props.video.snippet.thumbnails.high.url;
    let watchURL = `https://www.youtube.com/watch?v=${videoId}`;
    let embedURL = `https://www.youtube.com/embed/${videoId}`;

    /**
     * Adds song to queue and starts song timeout
     */
    function addToQueue() {
        props.setLoading(true);
        karaoke.addToQueue(title, watchURL,
            props.karaokePrefs.karaokeEnd,
            props.karaokePrefs.systemVLC,
            props.karaokePrefs.playingModeDownload)
            .then(response => response.json())
            .then((res) => {
                if (!res.ok) {
                    return makeToast("Error: " + res.msg, "error");
                }
                makeToast("Added video \"" + title + "\" to queue successfully!", "success");

                // NEW: Starts timeout
                props.startSongTimeout();
            })
            .catch((e) => {
                makeToast("Something went wrong: " + e, "error");
            })
            .finally(() => {
                props.setLoading(false);
            });
    }

    return (
        <Card border="secondary" className="text-center my-3">
            <Card.Header>
                <b>{title}</b><br />
                <small>Channel: {channel}</small>
            </Card.Header>
            <iframe src={embedURL} style={{ border: "0px #ffffff none" }} scrolling="no" frameBorder="1" marginHeight="0px" marginWidth="0px" width="100%"></iframe>
            <a href={watchURL} target="_blank" className="my-3">Watch on YouTube</a>

            <Card.Footer>
                <Button variant="success" onClick={addToQueue} disabled={props.inTimeout}>🎤 Sing!</Button>
            </Card.Footer>
        </Card>
    );
}