import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { BiTrash, BiMinus, BiUpArrowAlt } from "react-icons/bi";
import { MainContext } from "../MainContext";
import loadinggif from "../assets/loading.gif";
import GalleryItemEach from "./GalleryItemEach";

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
    const currentPop = document.querySelector(".shadow-pop");
    let timeout = null;
    if (currentPop) {
        currentPop.classList.remove("shadow-pop");
        if (timeout && timeout !== null) {
            clearTimeout(timeout);
        }
    }
    const imageContainer = document.querySelector(`[data-image="${image}"]`);
    imageContainer.classList.add("shadow-pop");
    imageContainer.scrollIntoView();
    timeout = setTimeout(() => {
        imageContainer.classList.remove("shadow-pop");
    }, 3000);
};

const handleScrollUp = (e) => {
    e.preventDefault();
    e.target.closest(".partial-container").scrollIntoView();
};

function GalleryItem({ item, shapes, handleCollapse, itemid }) {
    const [itemData, setItemData] = useState();
    const [shapeList, setShapeList] = useState();
    const [updatedItemData, setUpdatedItemData] = useState([]);
    const [expand, setExpand] = useState(false);
    const [expandSide, setExpanSide] = useState("");
    const { hideDeleted, setHideDeleted } = useContext(MainContext);

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

    const ax_delete = (imageValue) => {
        const url = "https://sandbx.rugpal.com/office/jay/g.asp";

        if (imageValue === "") {
            return new Promise((reject) => reject("Invlaid data provided"));
        }
        return axios.get(url, {
            params: {
                img: encodeURIComponent(imageValue),
            },
        });
    };

    const handleDelete = async (e, imagelink = "") => {
        const imageValue =
            imagelink === ""
                ? e.target
                      .closest(".inputwrapper")
                      .querySelector("input.varinput").value
                : imagelink;

        await ax_delete(imageValue)
            .then((d) => {
                switch (d.data.message) {
                    case "Invalid inquery":
                        alert(d.data.message);
                        break;
                    case "update failed":
                        alert(d.data.message);
                        break;
                    default:
                        const newData = itemData.map((img) => {
                            if (img.image === imageValue) {
                                return {
                                    ...img,
                                    deleted:
                                        d.data.deleted === "0" ? true : false,
                                };
                            }
                            return img;
                        });
                        setUpdatedItemData(newData);
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

    const handleDeleteToggle = (e) => {
        localStorage.setItem("hidedeleted", !hideDeleted);
        setHideDeleted(!hideDeleted);
    };

    const handleDeleteAll = async (e) => {
        e.preventDefault();
        const container = e.target.closest(".thumb_item_wrapper");
        const btns = container.querySelectorAll(".g_delete_btn");
        const loading = document.createElement("div");
        loading.classList.add("loading_cover");
        loading.innerHTML =
            '<div class="lds-ripple"><div></div><div></div></div>';

        container.appendChild(loading);
        let newData = updatedItemData.length > 0 ? updatedItemData : itemData;

        for (let [index, btn] of btns.entries()) {
            if (!btn.closest(".g_selected")) {
                const link = btn.dataset.image;

                await ax_delete(link).then((d) => {
                    switch (d.data.message) {
                        case "Invalid inquery":
                            console.error(d.data.message);
                            break;
                        case "update failed":
                            console.error(d.data.message);
                            break;
                        default:
                            newData.find((f) => {
                                if (f.image === link) {
                                    return (f.deleted =
                                        d.data.deleted === "0" ? true : false);
                                }
                                return false;
                            });
                    }
                });
            }
            if (index >= btns.length - 1) {
                loading.remove();
            }
        }

        setUpdatedItemData({ ...[newData] });
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
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                            className="btn btn-outline-secondary btn-sm w-100 mt-5"
                            onClick={(e) => handleCollapse(e)}
                            titl="Collaps"
                        >
                            <BiMinus />
                        </button>
                        <button
                            className="btn btn-outline-secondary btn-sm w-100 mt-5"
                            onClick={(e) => handleScrollUp(e)}
                            titl="Scroll Up"
                        >
                            <BiUpArrowAlt />
                        </button>
                    </div>
                </div>
            </div>
            <div className={`col-12 ${expand ? "col-md-4" : "col-md-8"}`}>
                <div className="d-block mb-5">
                    <button
                        className="btn btn-outline-danger btn-sm px-4"
                        onClick={(e) => handleDeleteAll(e)}
                    >
                        Delete All Non-Selected Images
                    </button>
                    <small
                        className="d-block text-secondary mt-2"
                        style={{ fontSize: "80%" }}
                    >
                        <BiUpArrowAlt
                            style={{ fontSize: 17 }}
                            className="text-danger"
                        />
                        This will delete all images that are not assigned as
                        primary or specific shape
                    </small>
                </div>
                <div
                    className={`row g-2 g-sm-3 g-md-4 ${
                        hideDeleted ? "hide_deleted_images" : ""
                    }`}
                >
                    {itemData?.map((d, i) => (
                        <GalleryItemEach
                            key={i}
                            d={d}
                            i={i}
                            expand={expand}
                            loadinggif={loadinggif}
                            handleClick={handleClick}
                            shapeList={shapeList}
                            handleDelete={handleDelete}
                        />
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

                    <div className="d-block w-100 mb-3">
                        <div
                            className="d-flex justify-content-start align-items-center border border-start-0 border-end-0 p-2 w-100"
                            title="Toggle deleted items visibility"
                        >
                            <span>
                                <input
                                    className="tgl tgl-light"
                                    id={itemid}
                                    type="checkbox"
                                    onChange={(e) => handleDeleteToggle(e)}
                                    checked={hideDeleted}
                                    value={hideDeleted}
                                />
                                <label
                                    className="tgl-btn"
                                    htmlFor={itemid}
                                ></label>
                            </span>
                            <label
                                htmlFor={itemid}
                                className="text-secondary d-inline-block ms-2 user-select-none cursor-pointer"
                                style={{ fontSize: "70%" }}
                            >
                                Hide Deleted
                            </label>
                        </div>
                    </div>

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

                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                            className="btn btn-outline-secondary btn-sm w-100 mt-5"
                            onClick={(e) => handleCollapse(e)}
                            titl="Collaps"
                        >
                            <BiMinus />
                        </button>
                        <button
                            className="btn btn-outline-secondary btn-sm w-100 mt-5"
                            onClick={(e) => handleScrollUp(e)}
                            titl="Scroll Up"
                        >
                            <BiUpArrowAlt />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GalleryItem;
