// In your project write
// import breakpointList from '../styles/main.scss';
// import { Breakpoints } from '@evanshunt/derekstrap';
import breakpointList from '../demo.scss';
import { Breakpoints } from '../../src/index';

Breakpoints.init(breakpointList);

const currentBreakpoint = document.querySelector('#currentBreakpoint');

if (currentBreakpoint) {
    currentBreakpoint.innerHTML = Breakpoints.getCurrent();

    window.addEventListener('breakpointChange', (event) => {
        currentBreakpoint.innerHTML = event.detail.breakpoint;
    });
}
