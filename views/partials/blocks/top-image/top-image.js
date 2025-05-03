// function setInnerHeight() {
//     console.log('ss', `${window.innerHeight}`);
//     document.documentElement.style.setProperty('--slider-container', `${window.innerHeight / 2 - 32.5 - 5}px`);
//     document.documentElement.style.setProperty('--text-block', `${window.innerHeight / 2 - 32.5 - 2.5}px`);
// }

// window.addEventListener('resize', setInnerHeight);

let initialHeight = window.innerHeight;

window.addEventListener('resize', () => {
    const currentHeight = window.innerHeight;

    if (currentHeight > initialHeight) {
        console.log("address bar likely hidden");
    } else if (currentHeight < initialHeight) {
        console.log("address bar likely shown");
    }

    initialHeight = currentHeight;
})