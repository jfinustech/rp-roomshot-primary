import { useState, useEffect, useRef } from "react";
import { BiTrash } from "react-icons/bi";

import axios from "axios";
import loadinggif from "../assets/loading.gif";
import { md } from "../aux/modal";
import placeholder from "../assets/placeholder_lg.jpg";

const setShapes = (shapestring) => {
    if (!shapestring || shapestring === "") return [];
    const shapeArray = [];
    shapestring.split(",").map((shape) => {
        const splitshape = shape.split("|");
        return shapeArray.push({ id: splitshape[1], shape: splitshape[0] });
    });
    return shapeArray;
};

const splitImages = (image) => {
    if (image === "") return [];
    const images = image.split(",");
    let result = [];
    images.map((img) => {
        const link = img.split("|")[0];
        const primary = img.split("|")[1] === "0" ? false : true;
        const shape = img.split("|")[2];
        const deleted = img.split("|")[3] === "0" ? true : false;
        return result.push({ image: link, primary, shape, deleted });
    });

    return result;
};

const isScrollable = (ele) => {
    // Compare the height to see if the element has scrollable content
    if (!ele.current) return;
    const timeout = setTimeout(() => {
        const selector = ele.current
            .closest(".leftright-sticky")
            .querySelector(".scrollable-indicator");
        if (ele.current.scrollHeight > ele.current.clientHeight) {
            selector.style.display = "block";
        } else {
            selector.style.display = "none";
        }
        clearTimeout(timeout);
    }, 500);
};

const goToImage = (image) => {
    if (image === "" || !image) return;
    const imageContainer = document.querySelector(`[data-image="${image}"]`);
    imageContainer.classList.add("shadow");
    imageContainer.scrollIntoView();
    setTimeout(() => {
        imageContainer.classList.remove("shadow");
    }, 3000);
};

function GalleryItem({ item, shapes, handleCollapse }) {
    const [itemData, setItemData] = useState();
    const [shapeList, setShapeList] = useState();
    const [updatedItemData, setUpdatedItemData] = useState([]);
    const [expand, setExpand] = useState(false);
    const [expandSide, setExpanSide] = useState("");
    const inputData = useRef();

    const scrollableRef = useRef();

    const handleClick = async (
        e,
        e_shpe_val = "",
        e_image_val = "",
        e_fn_val = ""
    ) => {
        const shapeValue =
            e_shpe_val === "" ? e.target.dataset.shape : e_shpe_val;
        const imageValue =
            e_image_val === ""
                ? e.target
                      .closest(".inputwrapper")
                      .querySelector("input.varinput").value
                : e_image_val;
        const fnValue = e_fn_val === "" ? e.target.dataset.fn : e_fn_val;
        const loadingContainer =
            e?.target
                ?.closest(".image-wrapper")
                ?.querySelector(".imageloading") ?? "";

        if (loadingContainer !== "") loadingContainer.style.display = "block";
        const url = "https://sandbx.rugpal.com/office/jay/f.asp";

        await axios
            .get(url, {
                params: {
                    img: encodeURIComponent(imageValue),
                    shape: encodeURIComponent(shapeValue),
                    fn: encodeURIComponent(fnValue),
                },
            })
            .then((d) => {
                if (d.data?.hasOwnProperty("message")) {
                    return alert(d.data.message);
                }

                const newImageArray = [];
                itemData.map((img) => {
                    if (img.image === d.data.image) {
                        return newImageArray.push({
                            image: d.data.image,
                            primary: d.data.primary === "0" ? false : true,
                            shape: d.data.shape,
                            deleted: d.data.deleted === "0" ? true : false,
                        });
                    }
                    return newImageArray.push(img);
                });

                setUpdatedItemData(newImageArray);
            })
            .catch((er) => {
                alert(er);
            })
            .finally(() => {
                // loadingContainer.removeAttribute("style");
                if (loadingContainer !== "")
                    loadingContainer.removeAttribute("style");
            });
    };

    const handleDelete = async (e) => {
        const imageValue = e.target
            .closest(".inputwrapper")
            .querySelector("input.varinput").value;

        const url = "https://sandbx.rugpal.com/office/jay/g.asp";

        await axios
            .get(url, {
                params: {
                    img: encodeURIComponent(imageValue),
                },
            })
            .then((d) => {
                switch (d.data.message) {
                    case "Invalid inquery":
                        alert(d.data.message);
                        break;
                    case "update failed":
                        alert(d.data.message);
                        break;
                    default:
                        const newImageArray = [];
                        itemData.map((img) => {
                            if (img.image === d.data.image) {
                                return newImageArray.push({
                                    image: d.data.image,
                                    primary:
                                        d.data.primary === "0" ? false : true,
                                    shape: d.data.shape,
                                    deleted:
                                        d.data.deleted === "0" ? true : false,
                                });
                            }
                            return newImageArray.push(img);
                        });

                        setUpdatedItemData(newImageArray);
                }
            })
            .catch((er) => {
                alert(er);
            });
    };

    const handleExpand = (side) => {
        if (expand && expandSide !== side) {
            setExpanSide(side);
        } else {
            setExpand((prev) => !prev);
            setExpanSide(side);
        }
    };

    useEffect(() => {
        const imageInfo = splitImages(item);
        setShapeList(setShapes(shapes));
        setItemData(imageInfo);
        isScrollable(scrollableRef);
        window.addEventListener("resize", () => {
            isScrollable(scrollableRef);
        });

        return () => {
            window.removeEventListener("resize", isScrollable(scrollableRef));
        };
    }, [item, shapes]);

    useEffect(() => {
        if (updatedItemData.length > 0) {
            setItemData(updatedItemData);
            isScrollable(scrollableRef);
        }
    }, [updatedItemData]);

    return (
        <div className="row g-md-5 thumb_item_wrapper">
            <div
                className={`col-12 mb-5 ${
                    expand && expandSide === "left" ? "col-md-6" : "col-md-2"
                }`}
            >
                <div
                    className="d-sticky sticky-top leftright-sticky"
                    ref={scrollableRef}
                    style={{ top: 30 }}
                >
                    <h6
                        className="mb-4 d-flex justify-content-between align-items-center cursor-pointer"
                        onClick={(e) => handleExpand("left")}
                    >
                        Primaries
                        <small
                            className="text-secondary scrollable-indicator"
                            style={{ fontSize: "60%", display: "none" }}
                        >
                            SCROLL
                        </small>
                    </h6>

                    {itemData?.filter((z) => z.primary && !z.deleted).length ===
                        0 && (
                        <small
                            className="text-secondary d-block"
                            style={{ fontSize: "80%" }}
                        >
                            Nothing selected yet.
                        </small>
                    )}

                    <div className="row h-100">
                        {itemData
                            ?.filter((z) => z.primary && !z.deleted)
                            .map((primg, i) => (
                                <div
                                    className={`mb-3 col-12 ${
                                        expand && expandSide === "left"
                                            ? "col-md-6"
                                            : "col-md-12"
                                    }`}
                                    key={i * 5651}
                                >
                                    <div className="d-block pb-3 border-bottom image-wrapper h-100">
                                        <div
                                            className="imageloading"
                                            style={{
                                                backgroundImage: `url(${loadinggif})`,
                                            }}
                                        ></div>
                                        <div className="row align-items-end h-100">
                                            <div className="col-3 col-md-5">
                                                <img
                                                    src={primg.image}
                                                    alt={primg.shape}
                                                    className="img-fluid"
                                                    onClick={() =>
                                                        goToImage(primg.image)
                                                    }
                                                />
                                            </div>
                                            <div className="col-9 col-md-7">
                                                <small className="text-secondary">
                                                    {primg.shape === "" ? (
                                                        <span
                                                            className="text-danger"
                                                            style={{
                                                                backgroundColor:
                                                                    "yellow",
                                                            }}
                                                        >
                                                            Shape?
                                                        </span>
                                                    ) : (
                                                        primg.shape
                                                    )}
                                                </small>
                                                <div className="d-flex w-100 pt-2">
                                                    <button
                                                        className="btn  btn-sm btn-outline-danger py-1 px-2 m-0 trash-btn d-flex justify-content-center align-items-center"
                                                        onClick={(e) =>
                                                            handleClick(
                                                                e,
                                                                primg.shape,
                                                                primg.image,
                                                                "primary"
                                                            )
                                                        }
                                                    >
                                                        <BiTrash />
                                                        {/* <span
                                                    className="ms-1"
                                                    style={{ fontSize: "80%" }}
                                                >
                                                    Remove
                                                </span> */}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <button
                        className="btn btn-outline-secondary btn-sm w-100 mt-5"
                        onClick={(e) => handleCollapse(e)}
                    >
                        Collapse
                    </button>
                </div>
            </div>
            <div className={`col-12 ${expand ? "col-md-4" : "col-md-8"}`}>
                <div className="row g-2 g-sm-3 g-md-4">
                    {itemData?.map((d, i) => (
                        <div
                            className={`col-12 ${expand ? "" : "col-sm-6"}`}
                            key={i}
                        >
                            <div
                                className={`image-wrapper w-100 h-100 border rounded-1 border-1 ${
                                    d.shape !== ""
                                        ? d.primary
                                            ? "border-info bg-info-light"
                                            : "border-success bg-success-light"
                                        : d.primary
                                        ? "border-info bg-info-light"
                                        : "border-secondary"
                                } 
                                ${d.deleted ? "item_deleted" : ""}`}
                                data-image={d.image}
                            >
                                <div className="row">
                                    <div className="col-6">
                                        <div
                                            className="bg-white position-relative d-flex justify-content-center align-items-center flex-column rounded p-2 overflow-hidden"
                                            style={{
                                                width: "90%",
                                                height: "90%",
                                                marginLeft: "5%",
                                                marginTop: "5%",
                                            }}
                                        >
                                            <div
                                                className="imageloading"
                                                style={{
                                                    backgroundImage: `url(${loadinggif})`,
                                                }}
                                            ></div>
                                            <img
                                                src={d.image}
                                                className="img-fluid"
                                                alt={`${Math.random()}`}
                                                onClick={() =>
                                                    md(
                                                        !d.image
                                                            ? placeholder
                                                            : d.image
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex flex-column gap-2 p-2 gap-md-3 p-md-3 inputwrapper">
                                            <button
                                                onClick={(e) => handleClick(e)}
                                                data-fn="primary"
                                                className={`btnfunc btn btn-sm ${
                                                    d.primary
                                                        ? "btn-info"
                                                        : "btn-outline-info"
                                                }`}
                                                disabled={d.deleted}
                                            >
                                                Primary
                                            </button>
                                            {shapeList.map((sh) => (
                                                <div
                                                    className="w-100"
                                                    key={sh.id + i}
                                                >
                                                    <button
                                                        disabled={d.deleted}
                                                        className={`btnfunc btn btn-sm w-100 ${
                                                            d.shape === sh.shape
                                                                ? "btn-success"
                                                                : "btn-outline-secondary"
                                                        }`}
                                                        onClick={(e) =>
                                                            handleClick(e)
                                                        }
                                                        data-shape={sh.shape}
                                                        data-fn="update"
                                                    >
                                                        {sh.shape}
                                                    </button>
                                                </div>
                                            ))}
                                            {d.deleted ? (
                                                <button
                                                    onClick={(e) =>
                                                        handleDelete(e)
                                                    }
                                                    className="btn btn-outline-success btn-sm"
                                                >
                                                    Revert
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) =>
                                                        handleDelete(e)
                                                    }
                                                    className="btn btn-outline-danger btn-sm"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                            <input
                                                className="varinput"
                                                type="hidden"
                                                ref={inputData}
                                                value={d.image}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="border-top p-2 mt-2 w-100 d-flex">
                                    {d.deleted ? (
                                        <button className="btn btn-outline-danger btn-sm">
                                            Reverse
                                        </button>
                                    ) : (
                                        <button className="btn btn-outline-danger btn-sm">
                                            Delete
                                        </button>
                                    )}
                                </div> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={`ol-12 col-md-2 mb-5 ${
                    expand && expandSide === "right" ? "col-md-6" : "col-md-2"
                }`}
            >
                <div
                    className="d-sticky sticky-top leftright-sticky"
                    ref={scrollableRef}
                    style={{ top: 30 }}
                >
                    <h6
                        className="mb-4 d-flex justify-content-between align-items-center cursor-pointer"
                        onClick={(e) => handleExpand("right")}
                    >
                        Shapes
                        <small
                            className="text-secondary scrollable-indicator"
                            style={{ fontSize: "60%", display: "none" }}
                        >
                            SCROLL
                        </small>
                    </h6>

                    {itemData?.filter(
                        (z) => z.shape !== "" && !z.primary && !z.deleted
                    ).length === 0 && (
                        <small
                            className="text-secondary d-block"
                            style={{ fontSize: "80%" }}
                        >
                            Nothing selected yet. This will not include Primary
                            shapes.
                        </small>
                    )}

                    <div className="row h-100">
                        {itemData
                            ?.filter(
                                (z) =>
                                    z.shape !== "" && !z.primary && !z.deleted
                            )
                            .map((primg, i) => (
                                <div
                                    className={`mb-3 col-12 ${
                                        expand && expandSide === "right"
                                            ? "col-md-6"
                                            : "col-md-12"
                                    }`}
                                    key={i * 68984}
                                >
                                    <div className="d-block pb-3 border-bottom image-wrapper h-100">
                                        <div
                                            className="imageloading"
                                            style={{
                                                backgroundImage: `url(${loadinggif})`,
                                            }}
                                        ></div>
                                        <div className="row align-items-end h-100">
                                            <div className="col-3 col-md-5">
                                                <img
                                                    src={primg.image}
                                                    alt={primg.shape}
                                                    className="img-fluid"
                                                    onClick={() =>
                                                        goToImage(primg.image)
                                                    }
                                                />
                                            </div>
                                            <div className="col-9 col-md-7">
                                                <small className="text-secondary">
                                                    {primg.shape}
                                                    {primg.primary && (
                                                        <span
                                                            className="d-block text-info"
                                                            style={{
                                                                fontSize: "80%",
                                                            }}
                                                        >
                                                            Primary
                                                        </span>
                                                    )}
                                                </small>
                                                <button
                                                    className="btn mt-2 btn-sm btn-outline-danger py-1 px-2 m-0 trash-btn d-flex justify-content-center align-items-center"
                                                    onClick={(e) =>
                                                        handleClick(
                                                            e,
                                                            primg.shape,
                                                            primg.image,
                                                            "update"
                                                        )
                                                    }
                                                >
                                                    <BiTrash />
                                                    {/* <span
                                                className="ms-1"
                                                style={{ fontSize: "80%" }}
                                            >
                                                Remove
                                            </span> */}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <button
                        className="btn btn-outline-secondary btn-sm w-100 mt-5"
                        onClick={(e) => handleCollapse(e)}
                    >
                        Collapse
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GalleryItem;
