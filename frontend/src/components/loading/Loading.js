import "./Loading.css";
import loader from "../../res/loading.gif";
import { Image } from "react-bootstrap";

export default function Loading() {
    return (
        <div className="loader-bg">
            <Image width="100px" src={loader}/>
        </div>
    )
}