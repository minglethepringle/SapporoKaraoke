import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Image, Row, Dropdown, Modal, ListGroup } from "react-bootstrap";
import Loading from "../../loading/Loading";
import * as yt from "../../../shared/YoutubeAPI";
import "./SearchPage.css";
import trash from "../../../res/trash.svg";
import search from "../../../res/search.svg";
import SearchResult from "./SearchResult";
import makeToast from "../../../shared/MakeToast";
import * as karaoke from "../../../shared/KaraokeAPI";


export default function SearchPage(props) {

    let [loading, setLoading] = useState(true);
    let [searchText, setSearchText] = useState("");
    let [searchResults, setSearchResults] = useState([]);
    let [inTimeout, setInTimeout] = useState(false);
    let [singHistory, setSingHistory] = useState([]); // Sing history is just a list of strings, song titles
    let [currentQueue, setCurrentQueue] = useState([]);
    let [showQueue, setShowQueue] = useState(false);

    /**
     * Effect: loads the YT client. Runs once.
     */
    useEffect(() => {
        yt.loadClient(props.karaokePrefs.ytApiKey, () => {
            setLoading(false);
        });
    }, []);

    /**
     * Effect: loads the sing history from local storage. Runs once.
     */
    useEffect(() => {
        let history = localStorage.getItem("singHistory");
        if (history != null) {
            setSingHistory(JSON.parse(history));
        }
    }, []);

    /**
     * Searches YouTube for videos with the keyword specified by `searchText`
     */
    function searchVideo() {
        if (searchText.length == 0) {
            return makeToast("You must enter some text to search!", "error");
        }

        let modifiedSearchText = searchText;

        // If string contains ?si=, remove it.
        if (modifiedSearchText.includes("?si=")) {
            modifiedSearchText = modifiedSearchText.split("?si=")[0]
        }

        // If beginning starts with http, it's a youtube link. If not, append Karaoke
        if (modifiedSearchText.substring(0, 4) != "http") {
            modifiedSearchText += " + karaoke";
        }

        yt.searchByKeyword(modifiedSearchText, 8, (results) => {
            if (results != null && results.length > 0) {
                setSearchResults(results);
            }
        });
    }

    /**
     * Starts a timeout and disables all queue buttons until timer is up.
     */
    function startSongTimeout() {
        setInTimeout(true);

        // After x minutes, reenable buttons
        setTimeout(() => {
            setInTimeout(false);
        }, Number(props.karaokePrefs.timeoutMin) * 1000 * 60);
    }

    function viewQueue() {
        karaoke.getQueue()
            .then(res => res.json())
            .then(data => {
                setCurrentQueue(data.queue);
                setShowQueue(true);
            })
            .catch((err) => {
                console.log(err);
                makeToast("Failed to retrieve queue!", "error");
            });
    }
    
    function hideQueue() {
        setShowQueue(false);
    }

    return (
        <main>
            {loading ? <Loading /> : (
                <>
                    <Row className="my-3">
                        <Col>
                            <Button variant="outline-primary w-100" onClick={viewQueue}>🎤 View Song Queue 🎤</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Alert variant="danger">
                                <small>Once you queue a song, you will need to <b>wait {props.karaokePrefs.timeoutMin} minutes</b> before you can select again!</small>
                            </Alert>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Label as="h5">1. Search YouTube for a karaoke video</Form.Label>
                            {/* <Alert variant="warning"> */
                                /* <small>Tip: Include the word "<b>karaoke</b>" in your search to find karaoke versions of your wanted songs!</small> */
                            /*</Alert> */}
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="search"
                                        placeholder="Search videos here"
                                        className="border border-secondary rounded-0"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6} className="pe-0">
                                    <Button className="w-100 rounded-0" onClick={searchVideo}>
                                        <Image src={search} width="20px" />
                                    </Button>
                                </Col>
                                <Col xs={6} className="ps-0 ">
                                    <Dropdown className="w-100 ">
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="w-100 rounded-0">
                                            My History
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {
                                                singHistory.map((historyItem) => {
                                                    return (
                                                        <Dropdown.Item onClick={() => setSearchText(historyItem)}>
                                                            {historyItem}
                                                        </Dropdown.Item>
                                                    );
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                            </Row>
                            <Row>
                                
                            </Row>


                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            <Form.Label as="h5">2. Choose a video from the search results below</Form.Label>
                            <Alert variant="info">
                                <small>Tip: If the video player does not load, click <b>Watch on YouTube</b> to preview the video and listen to it!</small>
                            </Alert>

                            {
                                searchResults.map((videoResult => {
                                    return (
                                        <SearchResult video={videoResult}
                                            setLoading={setLoading}
                                            inTimeout={inTimeout} startSongTimeout={startSongTimeout}
                                            singHistory={singHistory} setSingHistory={setSingHistory}
                                            karaokePrefs={props.karaokePrefs}
                                            override={props.override}/>);
                                }))
                            }

                        </Col>
                    </Row>

                    <Modal show={showQueue} onHide={hideQueue}>
                        <Modal.Header closeButton>
                            <Modal.Title>🎤 Karaoke Song Queue</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <ListGroup as="ol" numbered>
                            {
                                currentQueue.length > 0 ? (
                                    currentQueue.map((songObj, i) => {
                                        return (
                                            <ListGroup.Item as="li" className={i == 0 ? "bg-warning" : ""}>{songObj.title}</ListGroup.Item>
                                        );
                                    })
                                )
                                : <b className="text-center">No songs in queue!</b>
                            }
                        </ListGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={hideQueue}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </main>
    );
}