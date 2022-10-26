import { useState, useEffect, useRef } from "react";
import axios from "axios";
import loadinggif from "../assets/loading.gif";

const splitImages = (image) => {
    if (image === "") return [];
    const images = image.split(",");
    let result = [];
    images.map((img) => {
        const link = img.split("|")[0];
        const primary = img.split("|")[1] === "0" ? false : true;
        return result.push({ image: link, primary });
    });

    return result;
};

function GalleryItem({ item }) {
    const [itemData, setItemData] = useState();
    const [updatedItemData, setUpdatedItemData] = useState([]);
    const [loading, setLoading] = useState();

    const inputData = useRef();

    const handleClick = async (e) => {
        // console.log(e);
        setLoading(true);
        const target = e.currentTarget;
        const value = target.querySelector("input").value;
        const url = "https://sandbx.rugpal.com/office/jay/f.asp";
        const loadingcontainer =
            target.children[0].querySelector(".imageloading");
        loadingcontainer.style.display = "block";
        await axios
            .get(url, {
                params: { img: encodeURIComponent(value) },
            })
            .then((d) => {
                switch (d.data.message) {
                    case "updated":
                        const prevdata = splitImages(item);
                        prevdata.map((z) => (z.primary = false));
                        prevdata.filter((zz) =>
                            zz.image === value ? (zz.primary = true) : false
                        );
                        setUpdatedItemData(prevdata);
                        break;
                    default:
                        alert(d.data.message);
                }
            })
            .catch((er) => {
                alert(er);
            })
            .finally(() => {
                setLoading(false);
                loadingcontainer.removeAttribute("style");
            });
    };

    useEffect(() => {
        const imageInfo = splitImages(item);
        setItemData(imageInfo);
    }, [item]);

    useEffect(() => {
        if (updatedItemData.length > 0) {
            setItemData(updatedItemData);
        }
    }, [updatedItemData]);

    return (
        <div className="row g-3">
            {itemData?.map((d, i) => (
                <div className="col-6 col-md-4 col-lg-3" key={i}>
                    <div
                        className={`image-wrapper d-flex justify-content-center align-items-center w-100 h-100 border border-2 ${
                            d.primary ? "border-success " : "border-light"
                        }`}
                        onClick={(e) => handleClick(e)}
                    >
                        <div className="p-3 position-relative">
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
                            <input
                                className="varinput"
                                type="hidden"
                                ref={inputData}
                                value={d.image}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GalleryItem;
