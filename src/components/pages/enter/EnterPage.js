import "./EnterPage.css";
import { useState } from "react";
import { Col, Form, Image, Row, Button } from "react-bootstrap";
import karaoke from "../../../res/karaoke.jpg";
import facebookIcon from "../../../res/facebook.svg";
import instagramIcon from "../../../res/instagram.svg";
import makeToast from "../../../shared/MakeToast";

export default function EnterPage(props) {
    // TODO: Store email in firebase or something
    let [email, setEmail] = useState("");

    /**
     * Sets a 5 second timeout for user to follow page, then shows search page
     * @param {string} link 
     */
    function followPage(link) {
        if (email.length == 0) {
            return makeToast("You must enter your email first!", "warning");
        }

        window.open(link, "_blank");

        setTimeout(() => {
            props.setFollowing(true);
            props.setShowSearch(true);
            // alert("10 seconds")
        }, 5 * 1000);
    }

    return (
        <main>
            <Row>
                <Col>
                    <Image className="w-75" src={karaoke} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1 className="m-3"><u>TO ENTER, YOU MUST</u></h1>
                </Col>
            </Row>
            <hr/>   
            <Row>
                <Col>
                    <Form.Label as="h5">1. Enter your email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email here"
                        className="border border-secondary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col>
                    <Form.Label as="h5">2. Follow us on Facebook or Instagram</Form.Label>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="dark"
                            className="w-100 btn-fb" onClick={() => {followPage("https://www.facebook.com/SapporoWestborough/")}}>
                        <Image src={facebookIcon} width="20px"/> <br/>
                        <span className="mx-2">Follow on Facebook</span>
                    </Button>
                </Col>
                <Col>
                    <Button variant="dark"
                            className="w-100 btn-ig" onClick={() => {followPage("https://www.instagram.com/sapporobbq/?hl=en")}}>
                        <Image src={instagramIcon} width="20px"/> <br/>
                        <span className="mx-2">Follow on Instagram</span>
                    </Button>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col>
                    <small className="text-secondary">By entering your email, you consent to receiving offers and news from Sapporo Restaurant.</small>
                </Col>
            </Row>
        </main> 
    );
}