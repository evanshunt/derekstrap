import debounce from "./debounce";

const Breakpoints = {
    breakpoints: {},
    current: [],
    currentBreakpoint: '',
    init: function (breakpoints) {
        this.breakpoints = breakpoints;

        this.currentBreakpoint = this.getCurrent();
        this.current = this.get();
        window.addEventListener('resize', this.eventEmitter);
    },
    // returns the single current breakpoint, or null if none has been reached.
    getCurrent: function () {
        const breakpoint = Object.entries(this.breakpoints).reduce((accumulator, entry) => {
            if (accumulator && !(window.matchMedia('(min-width:' + accumulator[1] + ')').matches)) {
                accumulator = null;
            }
            if (
                window.matchMedia('(min-width:' + entry[1] + ')').matches
                && accumulator
                && Number(accumulator[1].replace(/\D/g, '')) < Number(entry[1].replace(/\D/g, ''))
            ) {
                return entry;
            }

            return accumulator;
        });
        return breakpoint ? breakpoint[0] : null;
    },
    // returns an array of applicable breakpoints allowing javascript
    // written on a mobile first structure
    get: function () {
        return Object.entries(this.breakpoints).filter((entry) => {
            if (window.matchMedia('(min-width:' + entry[1] + ')').matches) {
                return true;
            }
        }).map((entry) => {
            return entry[0];
        });
    },
    minWidth: function ($breakpoint) {
        return window.matchMedia('(min-width:' + this.breakpoints[$breakpoint] + ')').matches;
    },
    eventEmitter: debounce(() => {
        const newBreakpoint = Breakpoints.getCurrent();
        if (newBreakpoint !== Breakpoints.currentBreakpoint) {
            window.dispatchEvent(new CustomEvent('breakpointChange', {
                detail: {
                    breakpoint: newBreakpoint,
                    lastBreakpoint: Breakpoints.currentBreakpoint
                }
            }));
            Breakpoints.currentBreakpoint = newBreakpoint;
            Breakpoints.current = Breakpoints.get();
        }
    }, 50),
};

export default Breakpoints;
