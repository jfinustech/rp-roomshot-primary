import axios from "axios";
import { useRef, useState } from "react";

// const fetchdata = (time) => {
//     return new Promise((resolve) => {
//         console.log("called");
//         setTimeout(resolve, time);
//     });
// };

const INNIT_DATA = "Innit";

const getData = (did) => {
    const url = "https://sandbx.rugpal.com/office/jay/e.asp";
    return axios.get(url, {
        params: {
            search: did,
            page: 1,
        },
    });
};

function Test() {
    const [data, setData] = useState(INNIT_DATA);
    const btn = useRef([]);

    const did_array = [
        "1000-8800-9200",
        "1002-8800-9200",
        "1003-8800-9200",
        "1004-8800-9200",
        "1005-8800-9200",
        "1006-8800-9200",
        "1023-8800-9200",
    ];

    const run = async () => {
        btn.current.forEach((e) => (e.disabled = true));
        btn.current.disabled = true;
        setData((prev) => `${prev} \nLoading...`);

        let cnt = 0;

        for (let did of did_array) {
            await getData(did).then((e) =>
                setData((prev) => `${prev}\n${e.data[0].key}`)
            );
            cnt++;
            console.log(cnt);
        }

        if (cnt >= did_array.length) {
            btn.current.forEach((e) => (e.disabled = false));
        }
    };

    return (
        <div style={{ padding: 100 }}>
            <pre className="container">{data}</pre>
            <div>
                <button
                    onClick={() => run()}
                    ref={(el) => (btn.current[0] = el)}
                    style={{ marginRight: 15 }}
                >
                    Refresh
                </button>
                <button
                    onClick={() => setData(INNIT_DATA)}
                    ref={(el) => (btn.current[1] = el)}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}

export default Test;
