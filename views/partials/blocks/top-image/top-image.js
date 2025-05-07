let initialHeight; // Store the initial height with the address bar visible

function setInitialHeight() {
    // Capture the initial height (before any address bar disappearance)
    initialHeight = window.innerHeight;

    // Apply this initial height to your blocks
    document.documentElement.style.setProperty('--slider-container', `${initialHeight / 2 - 32.5 - 5}px`);
    document.documentElement.style.setProperty('--text-block', `${initialHeight / 2 - 32.5 - 2.5}px`);

    // Optionally log to verify the initial height
    console.log('Initial Height Captured:', initialHeight);
}

// Wait for the page load to capture the height initially
window.addEventListener('load', () => {
    setInitialHeight(); // Capture the initial height once the page starts loading

    // Prevent changes to the block height, even if the address bar disappears
    window.addEventListener('scroll', () => {
        document.documentElement.style.setProperty('--slider-container', `${initialHeight / 2 - 32.5 - 5}px`);
        document.documentElement.style.setProperty('--text-block', `${initialHeight / 2 - 32.5 - 2.5}px`);
    });
});
