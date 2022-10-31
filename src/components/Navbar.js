import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div className="" style={{ backgroundColor: "slateGray" }}>
            <div className="container-fluid py-3 mb-4">
                <div className="row">
                    <div className="col-12">
                        <h4 className="p-0 m-0 text-white">
                            <Link
                                to="/rp-roomshot-primary/"
                                className="text-white text-decoration-none"
                            >
                                RP ROOMSHOTS
                            </Link>
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
