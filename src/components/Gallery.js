import { useState } from "react";
import GalleryItem from "./GalleryItem";
function Gallery({ gallery }) {
    const [collection] = useState(gallery);

    if (!collection || collection.lenght === 0) {
        return (
            <div className="container-fluid container-lg">
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-info">No Data Found!</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid container-lg">
            <div className="row">
                {collection.map((item) => (
                    <div className="col-12 mb-5" key={item.key}>
                        <div className="p-5 border">
                            <div className="d-flex justify-content-start flex-column mb-5">
                                <h5>Collection: {item.collectionName}</h5>
                                <span>DesignID: {item.designID}</span>
                                <span>Color: {item.designColor}</span>
                            </div>
                            <GalleryItem
                                item={item.images}
                                shapes={item.shapes}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Gallery;
