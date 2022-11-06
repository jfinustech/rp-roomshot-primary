import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import Test from "./Test";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/rp-roomshot-primary" element={<App />} />
            <Route path="/rp-roomshot-primary/test" element={<Test />} />
        </Routes>
    </BrowserRouter>
);
