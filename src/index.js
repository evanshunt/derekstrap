import debounce from "./debounce";
import setUserAgent from "./setUserAgent";
import Breakpoints from "./Breakpoints";

const Derekstrap = {
    init: function () {
        setUserAgent();
    }
}

export {debounce, Derekstrap, Breakpoints};