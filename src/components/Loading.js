import React from "react";

function Loading({ loading }) {
    return (
        <div className="container">
            <div className="row">
                {loading && (
                    <div className="col-12 py-5 text-center">
                        <div className="lds-ripple">
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Loading;
