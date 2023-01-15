import { get, getDatabase, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import firebaseApp from "../../../shared/FirebaseAPI";
import makeToast from "../../../shared/MakeToast";

export default function ConfigPage() {

    let [karaokeStart, setKaraokeStart] = useState("");
    let [karaokeEnd, setKaraokeEnd] = useState("");
    let [timeoutMin, setTimeoutMin] = useState("");
    let [override, setOverride] = useState(false);
    let [systemVLC, setSystemVLC] = useState(true);
    let [playingModeDownload, setPlayingModeDownload] = useState(false);

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
            } else {
                return makeToast("RTDB Error!", "error");
            }
        }).catch((error) => {
            console.log(error);
            return makeToast("RTDB Error!", "error");
        });
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

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
            playingModeDownload: playingModeDownload
        }).then(() => {
            return makeToast("Successfully updated.", "success");
        });
    }

    return (
        <Row>
            <Col>
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