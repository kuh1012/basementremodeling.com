const loadScripts = (src) => {
    let script = document.createElement("script");
    script.src = src;
    script.setAttribute("async","")
    script.setAttribute("defer","")
    document.getElementsByTagName("head")[0].appendChild(script);
}

const loadCss = (href) => {
    if(document.createStyleSheet) {
        document.createStyleSheet(href);
      }
      else {
        var styles = `@import url("${href}");`;
        var newSS=document.createElement('link');
        newSS.rel='stylesheet';
        newSS.href=href;
        document.getElementsByTagName("head")[0].appendChild(newSS);
      }
}

const loadPageScripts = () => {
    const scripts = document.querySelectorAll(`.scriptToLoadAfterPageIsReady`);
    let json;
    for (let script of scripts) {
        json = JSON.parse(JSON.stringify(script.dataset))
        loadScripts(json.scriptsrc);
        script.remove();
    }
}

const lazyLoadImages = () => {
    const imagesToLoadLazily = document.querySelectorAll(`.lazyLoading`);
    let json;
    for (let node of imagesToLoadLazily) {
        node.classList.remove('lazyLoading');
        json = JSON.parse(JSON.stringify(node.dataset))
        for (let property of Object.keys(json)) {
            if (property.includes('src')){
                node[property] = json[property];
                delete node.dataset[property];
            }
        }
    }
}

window.addEventListener('load',e => {
    loadPageScripts();
    loadCss("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
    loadScripts("https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js");
    
})
//loadScripts("https://apis.google.com/js/api:client.js");
//loadScripts("https://connect.facebook.net/en_US/sdk.js#version=v2.2&appId=214466760546212&xfbml=false&autoLogAppEvents=true");

document.addEventListener("DOMContentLoaded", function() {
    var canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.href);
    document.head.appendChild(canonical);
});
