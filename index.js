import debounce from "./scripts/debounce";
import setUserAgent from "./scripts/setUserAgent";

const Derekstrap = {
    init: function () {
        setUserAgent();
    }
}

export {debounce, Derekstrap}