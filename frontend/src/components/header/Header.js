import { Image } from "react-bootstrap";
import "./Header.css";
import logo from "../../res/sapporo.jpg";

export default function Header() {
    return (
        <header className="d-flex flex-row justify-content-center align-items-center">
            <Image height="100%" src={logo}/>
            <h1 className="m-0 px-3 text-light">KARAOKE</h1>
        </header>
    );
}