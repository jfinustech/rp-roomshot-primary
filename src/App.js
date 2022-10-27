import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";
import Gallery from "./components/Gallery";
import Errors from "./components/Errors";
import Search from "./components/Search";
import axios from "axios";
import Pagination from "./components/Pagination";

function App() {
    const [loading, setLoading] = useState(false);
    const [gallery, setGallery] = useState();
    const [errors, setErrors] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") ?? "");

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

        setSearch(searchParams.get("search") ?? "");
    }, [searchParams]);

    return (
        <>
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
                    <Pagination
                        current_page={searchParams.get("page") ?? 1}
                        maxpage={gallery ? gallery[0].total_page : 1}
                        handleQuery={handleQuery}
                    />
                </>
            )}
        </>
    );
}

export default App;