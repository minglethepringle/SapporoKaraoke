import { get, getDatabase, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, ListGroup } from "react-bootstrap";
import * as karaoke from "../../../shared/KaraokeAPI";
import firebaseApp from "../../../shared/FirebaseAPI";
import makeToast from "../../../shared/MakeToast";

export default function ConfigPage() {

    let [karaokeStart, setKaraokeStart] = useState("");
    let [karaokeEnd, setKaraokeEnd] = useState("");
    let [timeoutMin, setTimeoutMin] = useState("");
    let [override, setOverride] = useState(false);
    let [systemVLC, setSystemVLC] = useState(true);
    let [playingModeDownload, setPlayingModeDownload] = useState(false);
    let [ytApiKey, setYtApiKey] = useState(null);

    let [currentQueue, setCurrentQueue] = useState([]);

    /**
     * Effect: get karaoke preferences and check times. Runs once
     */
    useEffect(() => {
        // Initialize Realtime Database and get a reference to the service
        const db = getDatabase(firebaseApp);
        get(ref(db)).then((snapshot) => {
            if (snapshot.exists()) {
                let data = snapshot.val();
                setKaraokeStart(data.karaokeStart);
                setKaraokeEnd(data.karaokeEnd);
                setTimeoutMin(data.timeoutMin);
                setOverride(data.override);
                setSystemVLC(data.systemVLC);
                setPlayingModeDownload(data.playingModeDownload);
                setYtApiKey(data.ytApiKey);
            } else {
                return makeToast("RTDB Error!", "error");
            }
        }).catch((error) => {
            console.log(error);
            return makeToast("RTDB Error!", "error");
        });
    }, []);

    /**
     * Start a timer to update the queue every 10 seconds
     */
    useEffect(() => {
        let queueUpdateInterval = setInterval(() => {
            updateQueue();
        }, 10000);
        return () => {
            clearInterval(queueUpdateInterval);
        }
    }, []);

    function updateQueue() {
        karaoke.getQueue()
            .then(res => res.json())
            .then(data => {
                setCurrentQueue(data.queue);
            })
            .catch((err) => {
                console.log(err);
                makeToast("Failed to retrieve queue!", "error");
            });
    }

    function swapYtApiKey() {
        let nextApiKey;
        if (ytApiKey == 1) {
            nextApiKey = 2;
        } else {
            nextApiKey = 1;
        }
        if (window.confirm(`The current API key # is ${ytApiKey}. This will swap it to # ${nextApiKey}. Are you sure?`)) 
        {
            setYtApiKey(nextApiKey);
            handleSubmit(null, nextApiKey);
        }
    }

    function handleSubmit(e, nextApiKey) {
        if (e) {
            e.preventDefault();
        }

        // Validation
        if (/^([01]\d|2[0-3]):?([0-5]\d)$/.test(karaokeStart) == false) {
            return makeToast("Invalid start time!", "error");
        }

        if (/^([01]\d|2[0-3]):?([0-5]\d)$/.test(karaokeEnd) == false) {
            return makeToast("Invalid end time!", "error");
        }

        if (isNaN(timeoutMin)) {
            return makeToast("Invalid timeout time!", "error");
        }

        // Save
        const db = getDatabase(firebaseApp);
        set(ref(db), {
            karaokeStart: karaokeStart,
            karaokeEnd: karaokeEnd,
            timeoutMin: timeoutMin,
            override: override,
            systemVLC: systemVLC,
            playingModeDownload: playingModeDownload,
            ytApiKey: nextApiKey ?? ytApiKey // either used passed in one or use state
        }).then(() => {
            return makeToast("Successfully updated.", "success");
        });
    }

    function skipSong() {
        // Have a confirm dialog first
        if (window.confirm("This will skip the current song. This is an irreversible action. Are you sure?")) {
            karaoke.skipSong()
                .then(() => {
                    return makeToast("Successfully skipped song.", "success");
                }).catch((error) => {
                    console.log(error);
                    return makeToast("Error skipping song!", "error");
                });           
        }
    }

    function decreaseVolume() {
        karaoke.decreaseVolume()
            .then(() => {
                return makeToast("Decreased volume by 10%", "success");
            }).catch((error) => {
                console.log(error);
                return makeToast("Error decreasing volume!", "error");
            });           
    }

    function increaseVolume() {
        karaoke.increaseVolume()
            .then(() => {
                return makeToast("Increased volume by 10%", "success");
            }).catch((error) => {
                console.log(error);
                return makeToast("Error increasing volume!", "error");
            });
    }

    // Remove song with id
    function removeSongFromQueue(songId) {
        karaoke.removeSong(songId)
            .then(() => {
                makeToast("Successfully removed song.", "success");
                updateQueue();
            }).catch((error) => {
                console.log(error);
                return makeToast("Error removing song!", "error");
            });
    }

    // Play next in queue
    function playNext(songId) {
        karaoke.playNext(songId)
            .then(() => {
                makeToast("Successfully shifted song to front of queue.", "success");
                updateQueue();
            }).catch((error) => {
                console.log(error);
                return makeToast("Error shifting song!", "error");
            });
    }

    return (
        <Row>
            <Col>
                <h1>YouTube API Key</h1>
                <Col xs={12} className="text-center">
                    <Button variant="primary" type="button" onClick={swapYtApiKey} className="mx-3 my-3">
                    🔁 SWITCH YOUTUBE API KEY 🔁
                    </Button>
                </Col>

                <hr/>

                <h1>Media Controls</h1>

                <Col xs={12} className="text-center">
                    <Button variant="danger" type="button" onClick={skipSong} className="mx-3 my-3">
                        ⏭️ Skip Current Song ⏭️
                    </Button>
                </Col>

                <Row className="text-center">
                    <Col>
                        <Button variant="info" type="button" onClick={decreaseVolume} className="mx-3 my-3">
                            ⬇️ Volume Down ⬇️
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="success" type="button" onClick={increaseVolume} className="mx-3 my-3">
                            ⬆️ Volume Up ⬆️
                        </Button>
                    </Col>
                </Row>

                <hr/>

                <h1>Queue Mods</h1>

                <ListGroup as="ol" numbered>
                    {
                        currentQueue.length > 0 ? (
                            currentQueue.map((songObj, i) => {
                                if (i == 0) {
                                    return (
                                        <ListGroup.Item as="li" className="bg-warning">{songObj.title}</ListGroup.Item>
                                    );
                                } else {
                                    return (
                                        <ListGroup.Item as="li">
                                            <span>{songObj.title}</span>
                                            <Button variant="secondary" type="button" className="float-end mx-1" onClick={() => {removeSongFromQueue(songObj.id)}}>❌</Button>
                                            <Button variant="primary" type="button" className="float-end mx-1" onClick={() => {playNext(songObj.id)}}>⬆️</Button>
                                        </ListGroup.Item>
                                    );
                                }
                                
                            })
                        )
                        : <b className="text-center">No songs in queue!</b>
                    }
                </ListGroup>

                <hr/>

                <h1>Configuration</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Karaoke Start Time</Form.Label>
                        <Form.Control type="text" placeholder="Enter username"
                            value={karaokeStart} onChange={(e) => { setKaraokeStart(e.target.value) }} />
                        <Form.Text className="text-muted">
                            In the format HH:mm (24 hour time), e.g. 22:30
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Karaoke End Time</Form.Label>
                        <Form.Control type="text" placeholder="Enter username"
                            value={karaokeEnd} onChange={(e) => { setKaraokeEnd(e.target.value) }} />
                        <Form.Text className="text-muted">
                            In the format HH:mm (24 hour time), e.g. 22:30
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Timeout (in minutes)</Form.Label>
                        <Form.Control type="text" placeholder="Enter username"
                            value={timeoutMin} onChange={(e) => { setTimeoutMin(e.target.value) }} />
                        <Form.Text className="text-muted">
                            How long a customer waits before being able to select another song
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Override Start/End Time</Form.Label>
                        <Form.Check
                            type="checkbox"
                            checked={override} onChange={(e) => { setOverride(e.target.checked) }}
                        />
                        <Form.Text className="text-muted">
                            If enabled, karaoke will always be accessible regardless of start and end time.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Karaoke System Selection</Form.Label>
                        <Row>
                            <Col className="text-end"><p><b>KSongLover</b></p></Col>
                            <Col xs={2}>
                                <Form.Switch
                                    type="switch"
                                    checked={systemVLC} onChange={(e) => { setSystemVLC(e.target.checked) }}
                                />
                            </Col>
                            <Col className="text-start"><p><b>VLC (default)</b></p></Col>

                        </Row>
                    </Form.Group>

                    {systemVLC ? (
                        <Form.Group className="mb-3">
                            <Form.Label>Song Playing Mode</Form.Label>
                            <Row>
                                <Col className="text-end"><p><b>Streaming (default)</b></p></Col>
                                <Col xs={2}>
                                    <Form.Switch
                                        type="switch"
                                        checked={playingModeDownload} onChange={(e) => { setPlayingModeDownload(e.target.checked) }}
                                    />
                                </Col>
                                <Col className="text-start"><p><b>Download Video</b></p></Col>
                            </Row>
                            <Form.Text className="text-muted">
                                ONLY APPLICABLE FOR VLC KARAOKE
                            </Form.Text>
                        </Form.Group>
                    ) : <></>}

                    <Button variant="success" type="submit">
                        Save Changes
                    </Button>
                </Form>

            </Col>
        </Row>
    );
}