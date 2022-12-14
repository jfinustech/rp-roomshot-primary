import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import GalleryItem from "./GalleryItem";
import { BiPlus, BiMinus } from "react-icons/bi";

const handleCollapse = (e) => {
    e.preventDefault();
    const shift = e.shiftKey;
    const container = e.currentTarget.closest(".partial-container");

    if (container.classList.contains("do_collapse")) {
        if (shift) {
            document
                .querySelectorAll(".partial-container")
                .forEach((element) => {
                    element.classList.remove("do_collapse");
                });
        } else {
            container.classList.remove("do_collapse");
        }
    } else {
        if (shift) {
            document
                .querySelectorAll(".partial-container")
                .forEach((element) => {
                    element.classList.add("do_collapse");
                });
        } else {
            container.classList.add("do_collapse");
        }
        container.scrollIntoView();
    }
};

function Gallery({ gallery }) {
    const [collection] = useState(gallery);
    const [searchParams] = useSearchParams();
    const containerRef = useRef();

    if (!collection || collection.lenght === 0) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-info">
                            {searchParams?.get("search") ? (
                                <>
                                    No Record Found for{" "}
                                    <b>{searchParams?.get("search")}</b>!
                                </>
                            ) : (
                                <>No Data Found!</>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row">
                {collection.map((item) => (
                    <div
                        className="col-12 mb-5 partial-container"
                        key={item.key}
                        ref={containerRef}
                    >
                        <div className="p-3 p-md-5 border rounded">
                            <div className="d-flex justify-content-between align-items-start mb-5">
                                <div className="">
                                    <h5>Collection: {item.collectionName}</h5>
                                    <span className="d-block d-md-inline-block text-dark">
                                        <span className="text-secondary">
                                            DesignID:
                                        </span>{" "}
                                        {item.designID}
                                    </span>
                                    <span className="d-block d-md-inline-block ms-0 ms-md-3 ps-0 ps-md-3 text-dark border-start ">
                                        <span className="text-secondary">
                                            Color:
                                        </span>{" "}
                                        {item.designColor}
                                    </span>
                                </div>

                                <button
                                    className="btn btn-sm btn-outline-primary rounded-pill p-0 m-0 d-flex justify-content-center align-items-center"
                                    onClick={(e) => handleCollapse(e)}
                                    style={{
                                        width: 34,
                                        height: 34,
                                        fontSize: 20,
                                    }}
                                >
                                    <span className="arrow-up p-0 m-0">
                                        <BiMinus
                                            style={{
                                                marginBottom: 3,
                                            }}
                                        />
                                    </span>
                                    <span className="arrow-down d-none p-0 m-0">
                                        <BiPlus
                                            style={{
                                                marginBottom: 2,
                                            }}
                                        />
                                    </span>
                                </button>
                            </div>
                            <GalleryItem
                                item={item.images}
                                shapes={item.shapes}
                                handleCollapse={handleCollapse}
                                itemid={item.key}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Gallery;
