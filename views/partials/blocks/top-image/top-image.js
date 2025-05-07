function getDeviceHeight() {
    // Total screen height (device screen height)
    var screenHeight = window.screen.height;

    // Visible viewport height (the height of the viewport, which may change as the address bar hides/shows)
    var viewportHeight = window.innerHeight;

    // Check if the address bar is visible (address bar takes up part of the screen)
    if (viewportHeight < screenHeight) {
        // Address bar is appearing (visible)
        console.log('Address bar is appearing. Device height:', screenHeight);
        return screenHeight; // Full device screen height when the address bar is visible
    } else {
        // Address bar is disappearing (not visible)
        console.log('Address bar is disappearing. Device height:', viewportHeight);
        return viewportHeight; // Height of the device without the address bar when it disappears
    }
}

function setInnerHeight() {
    console.log('ss', `${window.innerHeight}`);
    document.documentElement.style.setProperty('--slider-container', `${getDeviceHeight() / 2 - 32.5 - 5}px`);
    document.documentElement.style.setProperty('--text-block', `${getDeviceHeight() / 2 - 32.5 - 2.5}px`);
}

window.addEventListener('load', setInnerHeight);