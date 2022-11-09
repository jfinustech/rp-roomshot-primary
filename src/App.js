import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";
import Gallery from "./components/Gallery";
import Errors from "./components/Errors";
import Search from "./components/Search";
import axios from "axios";
import Pagination from "./components/Pagination";
import { MainContext } from "./MainContext";

function App() {
    const [loading, setLoading] = useState(false);
    const [gallery, setGallery] = useState();
    const [errors, setErrors] = useState("");
    const [hideDeleted, setHideDeleted] = useState(false);
    const [hideAssigned, setHideAssigned] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") ?? "");

    const providerValue = useMemo(
        () => ({ hideDeleted, setHideDeleted, hideAssigned, setHideAssigned }),
        [hideDeleted, setHideDeleted, hideAssigned, setHideAssigned]
    );

    const handleQuery = (q) => {
        const new_query = {
            ...Object.fromEntries(searchParams.entries()),
            ...q,
        };
        setSearchParams(new_query);
    };

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const url = "https://sandbx.rugpal.com/office/jay/e.asp";
            await axios
                .get(url, {
                    params: {
                        search: searchParams.get("search"),
                        page: searchParams.get("page"),
                    },
                })
                .then((d) => {
                    setGallery(d.data);
                })
                .catch((er) => {
                    setErrors(er);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        fetch();

        const loacl_show_deleted = localStorage.getItem("hidedeleted");
        if (loacl_show_deleted)
            setHideDeleted(loacl_show_deleted === "true" ? true : false);

        const loacl_show_assigned = localStorage.getItem("hideassigned");
        if (loacl_show_assigned)
            setHideAssigned(loacl_show_assigned === "true" ? true : false);

        setSearch(searchParams.get("search") ?? "");
    }, [searchParams]);

    return (
        <MainContext.Provider value={providerValue}>
            <Navbar />
            <Search
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                search={search}
                setSearch={setSearch}
                loading={loading}
            />
            <Loading loading={loading} />
            {!loading && errors !== "" && <Errors errors={errors} />}
            {!loading && errors === "" && (
                <>
                    <Gallery gallery={gallery} />
                    {gallery && gallery.length > 0 && (
                        <Pagination
                            current_page={searchParams.get("page") ?? 1}
                            maxpage={gallery ? gallery[0].total_page : 1}
                            handleQuery={handleQuery}
                        />
                    )}
                </>
            )}
        </MainContext.Provider>
    );
}

export default App;
