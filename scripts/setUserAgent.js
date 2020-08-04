function setUserAgent() {
    document.documentElement.setAttribute('data-useragent', navigator.userAgent);
}

export default setUserAgent;