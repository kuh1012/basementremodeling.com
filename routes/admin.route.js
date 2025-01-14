const createAdminRoutes = (app) => {

    // app.use(`/admin*`,(request, response, next) => {
    //     // if (!request.data['userID'] || !request.data['isAdmin']) {
    //     //     return response.status(404).redirect(`/404`);
    //     // }
    //     // return next();
    // });

    const pages = [
        { URL: `/admin`, route: `admin.route` },
        { URL: `/admin/landings`, route: `landings.route` },
        { URL: `/admin/portfolio`, route: `portfolio.route` },
        { URL: `/admin/basement-ideas`, route: `ideas.route` },
        { URL: `/admin/how-it-works`, route: `how-it-works.route` },
        { URL: `/admin/about-us`, route: `about-us.route` },
        { URL: `/admin/upload`, route: `upload.route` },
        { URL: `/admin/other`, route: `other.route` },
        { URL: `/admin/clients`, route: `clients.route` },
        { URL: `/admin/settings`, route: `settings.route` },
        { URL: `/admin/services`, route: `services.route` }
    ];

    pages.forEach((routeData) => {
        app.use(routeData.URL, require(`./admin/${routeData.route}`));
    });

};

module.exports = createAdminRoutes;