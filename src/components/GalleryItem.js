import { useState, useEffect, useRef } from "react";
import axios from "axios";
import loadinggif from "../assets/loading.gif";

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
        return result.push({ image: link, primary, shape });
    });

    return result;
};

function GalleryItem({ item, shapes }) {
    const [itemData, setItemData] = useState();
    const [shapeList, setShapeList] = useState();
    const [updatedItemData, setUpdatedItemData] = useState([]);
    const inputData = useRef();

    const handleClick = async (
        e,
        e_shpe_val = "",
        e_primary_val = "",
        e_image_val = ""
    ) => {
        const shapeValue =
            e_shpe_val === "" ? e.target.dataset.shape : e_shpe_val;
        const primaryValue =
            e_primary_val === "" ? e.target.dataset.isprimary : e_primary_val;
        const imageValue =
            e_image_val === ""
                ? e.target
                      .closest(".inputwrapper")
                      .querySelector("input.varinput").value
                : e_image_val;
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
                    primary: encodeURIComponent(primaryValue),
                },
            })
            .then((d) => {
                switch (d.data.message) {
                    case "does not exist":
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
                                });
                            }
                            return newImageArray.push(img);
                        });

                        setUpdatedItemData(newImageArray);
                }
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

    useEffect(() => {
        const imageInfo = splitImages(item);
        setShapeList(setShapes(shapes));
        setItemData(imageInfo);
    }, [item, shapes]);

    useEffect(() => {
        if (updatedItemData.length > 0) {
            setItemData(updatedItemData);
        }
    }, [updatedItemData]);

    return (
        <div className="row g-md-5">
            <div className="col-12 col-md-3 mb-5">
                <div className="d-sticky sticky-top" style={{ top: 30 }}>
                    <h6>Selected Images</h6>

                    {itemData?.filter((z) => z.primary).length === 0 && (
                        <small className="text-secondary">
                            Nothing Selected
                        </small>
                    )}

                    {itemData
                        ?.filter((z) => z.primary)
                        .map((primg, i) => (
                            <div
                                className="d-block py-3 border-bottom image-wrapper"
                                key={i * 5651}
                            >
                                <div
                                    className="imageloading"
                                    style={{
                                        backgroundImage: `url(${loadinggif})`,
                                    }}
                                ></div>
                                <div className="row align-items-center">
                                    <div className="col-3 col-md-5">
                                        <img
                                            src={primg.image}
                                            alt={primg.shape}
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="col-9 col-md-7">
                                        <small className="text-secondary">
                                            {primg.shape}
                                        </small>
                                        <div className="d-flex w-100 pt-2">
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={(e) =>
                                                    handleClick(
                                                        e,
                                                        primg.shape,
                                                        primg.primary ? "1" : 0,
                                                        primg.image
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className="col-12 col-md-9">
                <div className="row g-2 g-sm-3 g-md-4">
                    {itemData?.map((d, i) => (
                        <div className="col-12 col-sm-6" key={i}>
                            <div
                                className={`image-wrapper w-100 h-100 border rounded-1 border-1 ${
                                    d.primary
                                        ? "border-success bg-success-light"
                                        : "border-secondary"
                                }`}
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
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex flex-column gap-2 p-2 gap-md-3 p-md-3 inputwrapper">
                                            {shapeList.map((sh) => (
                                                <div
                                                    className="w-100"
                                                    key={sh.id + i}
                                                >
                                                    <button
                                                        className={`btn btn-sm w-100 ${
                                                            d.shape === sh.shape
                                                                ? "btn-success"
                                                                : "btn-outline-secondary"
                                                        }`}
                                                        onClick={(e) =>
                                                            handleClick(e)
                                                        }
                                                        data-shape={sh.shape}
                                                        data-isprimary={
                                                            d.shape === sh.shape
                                                                ? "1"
                                                                : "0"
                                                        }
                                                    >
                                                        {sh.shape}
                                                    </button>
                                                </div>
                                            ))}
                                            <input
                                                className="varinput"
                                                type="hidden"
                                                ref={inputData}
                                                value={d.image}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GalleryItem;
