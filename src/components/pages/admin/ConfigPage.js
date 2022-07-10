import { get, getDatabase, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import firebaseApp from "../../../shared/FirebaseAPI";
import makeToast from "../../../shared/MakeToast";

export default function ConfigPage() {

    let [karaokeStart, setKaraokeStart] = useState("");
    let [karaokeEnd, setKaraokeEnd] = useState("");
    let [timeoutMin, setTimeoutMin] = useState("");

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
            timeoutMin: timeoutMin
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

                    

                    <Button variant="success" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Col>
        </Row>
    );
}