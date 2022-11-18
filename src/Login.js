import { useState, useContext, useRef } from "react";
import { MainContext } from "./MainContext";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import "./Login.css";

//const { hideAssigned, setHideAssigned } = useContext(MainContext);

function Login(props) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // const { userLoggedIn, setUserLoggedIn } = useContext(MainContext);

    const { setUserLoggedIn } = useContext(MainContext);

    const doLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (userName === "" || password === "") {
            setError("Username and Password Required.");
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, userName, password);
            setLoading(false);
        } catch (err) {
            setError("Invalid username or password.");
            setLoading(false);
            return;
        }
    };

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setUserLoggedIn(true);
            localStorage.setItem("auth", currentUser.uid);
        }
    });

    const closeAlert = () => {
        setError(null);
    };

    return (
        <div className="loginformwrapper">
            <form
                className="loginform shadow border-0 p-4 rounded bg-white"
                onSubmit={(e) => doLogin(e)}
            >
                {loading && (
                    <div className="loginloading">
                        <div className="lds-ripple">
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger alert-dismissible">
                        <small>{error}</small>
                        <button
                            type="button"
                            className="btn-close p-2"
                            style={{ fontSize: "0.6rem" }}
                            data-bs-dismiss="alert"
                            aria-label="Close"
                            onClick={closeAlert}
                        ></button>
                    </div>
                )}
                <div className="w-100 d-block">
                    <label htmlFor="username" className="form-label text-muted">
                        Username
                    </label>
                    <input
                        className="form-control form-control-lg"
                        type="text"
                        id="username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="w-100 d-block mt-3">
                    <label htmlFor="password" className="form-label text-muted">
                        Password
                    </label>
                    <input
                        className="form-control form-control-lg"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="w-100 d-block mt-4 text-end">
                    <button type="submit" className="btn btn-primary">
                        Sign-in
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
