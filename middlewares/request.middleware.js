const setRequest = (request, response, next) => {
    let webp = request.cookies.webp === 'true';
    if ((request.headers.accept || "").includes('image/webp')) {
        webp = true;
    }
    request.data = {webp: webp};
    if (request.path.includes(".html")) {
        return response.status(301).redirect(`${request.path.replace(".html","")}`);
    }
    next();
};

module.exports = setRequest;