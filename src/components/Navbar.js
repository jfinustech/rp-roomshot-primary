import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";

function Navbar({ setUserLoggedIn, loading }) {
    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem("auth");
        setUserLoggedIn(false);
    };

    return (
        <div className="" style={{ backgroundColor: "slateGray" }}>
            <div className="container-fluid py-3 mb-4">
                <div className="row">
                    <div className="col-6">
                        <h4 className="p-0 m-0 text-white">
                            <Link
                                to="/rp-roomshot-primary/"
                                className="text-white text-decoration-none"
                            >
                                RP ROOMSHOTS
                            </Link>
                        </h4>
                    </div>
                    <div className="col-6 text-end">
                        {!loading && (
                            <button
                                type="button"
                                onClick={logout}
                                className="btn btn-outline-light btn-sm"
                            >
                                Log-out
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
