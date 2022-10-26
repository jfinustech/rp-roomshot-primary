import { useState } from "react";
import { BiSearch, BiTrash } from "react-icons/bi";
function Search({ searchParams, setSearchParams }) {
    const [search, setSearch] = useState(searchParams.get("search") ?? "");

    return (
        <div className="container-fluid container-lg mb-4">
            <div className="row">
                <form className="col-12">
                    <div className="input-group">
                        <input
                            type="text"
                            name="search"
                            className="form-control border-secondary"
                            placeholder="Search..."
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            className="btn btn-outline-secondary border-secondary"
                            type="button"
                            id="button-addon2"
                            onClick={(e) => {
                                e.preventDefault();
                                setSearchParams({ search });
                            }}
                        >
                            <BiSearch />
                        </button>
                    </div>
                </form>
                {searchParams.get("search") !== "" &&
                    searchParams.get("search") && (
                        <div className="col-12 mt-4">
                            <div className="d-flex justify-content-start align-items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSearchParams("");
                                    }}
                                    className="btn btn-xs btn-outline-primary py-1 px-3 d-flex justify-content-start align-items-center"
                                >
                                    <BiTrash />
                                    <span className="ps-3 ms-3 border-start border-secondary">
                                        {searchParams.get("search")}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}

export default Search;
