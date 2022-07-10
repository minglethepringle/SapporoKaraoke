import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import makeToast from "../../../shared/MakeToast";

export default function LoginPage(props) {

    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (username == "sapporobbq" && password == "KeepSinging50!") {
            props.setAuthorized(true);
        } else {
            makeToast("Unauthorized!", "error");
        }
    }

    return (
        <Row>
            <Col>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username"
                            value={username} onChange={(e) => {setUsername(e.target.value)}}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password"
                            value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Col>
        </Row>
    );
}