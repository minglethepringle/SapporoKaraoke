import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Image, Row } from "react-bootstrap";
import Loading from "../../loading/Loading";
import * as yt from "../../../shared/YoutubeAPI";
import "./SearchPage.css";
import search from "../../../res/search.svg";
import SearchResult from "./SearchResult";
import makeToast from "../../../shared/MakeToast";


export default function SearchPage(props) {

    let [loading, setLoading] = useState(true);
    let [searchText, setSearchText] = useState("");
    let [searchResults, setSearchResults] = useState([]);
    let [inTimeout, setInTimeout] = useState(false);

    /**
     * Effect: loads the YT client. Runs once.
     */
    useEffect(() => {
        yt.loadClient(() => {
            setLoading(false);
        });
    }, []);


    /**
     * Searches YouTube for videos with the keyword specified by `searchText`
     */
    function searchVideo() {
        if (searchText.length == 0) {
            return makeToast("You must enter some text to search!", "error");
        }

        // If beginning starts with http, it's a youtube link. If not, append Karaoke
        if (searchText.substring(0, 4) != "http") {
            searchText += " + karaoke";
        }

        yt.searchByKeyword(searchText, 8, (results) => {
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

    return (
        <main>
            {loading ? <Loading /> : (
                <>
                    <Row>
                        <Col>
                            <Alert variant="danger"> 
                                <small>Once you queue a song, you will need to <b>wait {props.karaokePrefs.timeoutMin} minutes</b> before you can select again!</small>
                            </Alert>
                            <h1 className="m-3"><u>TO SING, YOU MUST:</u></h1>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            <Form.Label as="h5">1. Search YouTube for a karaoke video</Form.Label>
                            {/* <Alert variant="warning"> */
                                /* <small>Tip: Include the word "<b>karaoke</b>" in your search to find karaoke versions of your wanted songs!</small> */
                            /*</Alert> */}
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search videos here"
                                        className="border border-secondary"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button onClick={searchVideo}>
                                        <Image src={search} width="20px" />
                                    </Button>
                                </Col>
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
                                    return <SearchResult video={videoResult} setLoading={setLoading} inTimeout={inTimeout} startSongTimeout={startSongTimeout} />
                                }))
                            }

                        </Col>
                    </Row>
                </>
            )}
        </main>
    );
}