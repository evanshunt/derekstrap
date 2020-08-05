import debounce from "debounce";

const Breakpoints = {
    breakpoints: {},
    noUnitBreakpoints: {},
    currentBreakpoint: '',
    init: function (breakpoints) {
        this.breakpoints = breakpoints;
        this.noUnitBreakpoints = Object.fromEntries(
            Object.entries(this.breakpoints).map(
                ([key, value]) => [key, Number(value.replace(/\D/g, ''))]
            )
        );

        this.currentBreakpoint = this.getCurrent();
        window.addEventListener('resize', this.eventEmitter);
    },
    getCurrent: function () {
        const width = window.innerWidth;
        const breakpoint = Object.entries(this.noUnitBreakpoints).reduce((accumulator, entry) => {
            if (accumulator && width < accumulator[1]) {
                accumulator = null;
            }

            if (width >= entry[1] && accumulator && accumulator[1] < entry[1]) {
                return entry;
            }

            return accumulator;
        });

        return breakpoint ? breakpoint[0] : null;
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
        }
    }, 50),
};

export default Breakpoints;