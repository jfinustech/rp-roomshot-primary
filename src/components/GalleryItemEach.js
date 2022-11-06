import { md } from "../aux/modal";
import placeholder from "../assets/placeholder_lg.jpg";

function GalleryItemEach({
    d,
    i,
    expand,
    loadinggif,
    handleClick,
    shapeList,
    handleDelete,
}) {
    return (
        <div
            className={`${d.deleted ? "g_item_wrapper_deleted" : ""} col-12 ${
                expand ? "" : "col-sm-6"
            }`}
        >
            <div
                className={`image-wrapper w-100 h-100 border rounded-1 border-1 ${
                    d.shape !== ""
                        ? d.primary
                            ? "border-info bg-info-light g_selected"
                            : "border-success bg-success-light g_selected"
                        : d.primary
                        ? "border-info bg-info-light g_selected"
                        : "border-secondary"
                } ${d.deleted ? "item_deleted" : ""}`}
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
                                    md(!d.image ? placeholder : d.image)
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
                                    d.primary ? "btn-info" : "btn-outline-info"
                                }`}
                                disabled={d.deleted}
                            >
                                Primary
                            </button>
                            {shapeList.map((sh) => (
                                <div className="w-100" key={sh.id + i}>
                                    <button
                                        disabled={d.deleted}
                                        className={`btnfunc btn btn-sm w-100 ${
                                            d.shape === sh.shape
                                                ? "btn-success"
                                                : "btn-outline-secondary"
                                        }`}
                                        onClick={(e) => handleClick(e)}
                                        data-shape={sh.shape}
                                        data-fn="update"
                                    >
                                        {sh.shape}
                                    </button>
                                </div>
                            ))}
                            {d.deleted ? (
                                <button
                                    onClick={(e) => handleDelete(e)}
                                    className="btn btn-outline-success btn-sm"
                                >
                                    Revert
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => handleDelete(e)}
                                    className="btn btn-outline-danger btn-sm g_delete_btn"
                                    data-image={d.image}
                                >
                                    Delete
                                </button>
                            )}
                            <input
                                className="varinput"
                                type="hidden"
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
    );
}

export default GalleryItemEach;
