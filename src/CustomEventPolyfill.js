export default (() => {
    if (typeof window.CustomEvent === 'function') {
        return window.CustomEvent;
    }

    return function CustomEvent (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
})();
