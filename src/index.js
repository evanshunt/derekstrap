import debounce from "./debounce";
import setUserAgent from "./setUserAgent";
import Breakpoints from "./Breakpoints";

const Derekstrap = {
    init: function () {
        setUserAgent();
    },
    debounce: debounce,
    Breakpoints: Breakpoints
}

export default Derekstrap;