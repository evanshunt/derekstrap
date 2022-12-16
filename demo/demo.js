import './js/breakpoints';

document.querySelectorAll('pre code').forEach((block) => {
    fetch(block.dataset.src)
        .then((response) => response.text())
        .then((data) => block.innerHTML = data)
        .then(()=> hljs.highlightElement(block));
});