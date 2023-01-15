import React, { useState } from "react";
import ConfigPage from "./ConfigPage";
import LoginPage from "./LoginPage";

export default function AdminPage() {
    let [authorized, setAuthorized] = useState(false);

    return (
        <main>
            {
                authorized ? <ConfigPage/> : <LoginPage setAuthorized={setAuthorized} />
            }
        </main>
    );
}