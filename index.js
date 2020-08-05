import debounce from "./scripts/debounce";
import setUserAgent from "./scripts/setUserAgent";
import Breakpoints from "./scripts/Breakpoints";

const Derekstrap = {
    init: function () {
        setUserAgent();
    }
}

export {debounce, Derekstrap, Breakpoints}