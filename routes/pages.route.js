const createPageRoutes = (app) => {

    const pages = [
        { URL: `/portfolio`, route: `portfolio.route` },
        { URL: `/project`, route: `project.route` },
        { URL: `/basement-ideas`, route: `ideas.route` },
        { URL: `/services`, route: `services.route` },
        { URL: `/how-it-works`, route: `how-it-works.route` },
        { URL: `/about-us`, route: `about-us.route` },
        { URL: `/instant-quote`, route: `instant-quote.route` },
        { URL: `/sign`, route: `sign.route` },
        { URL: `/profile`, route: `profile.route` },
        { URL: `/instagram`, route: `instagram.route` },
        { URL: `/thank-you`, route: `thank-you.route` },
        { URL: `/leave-a-review`, route: `review.route` },
        { URL: `/book`, route: `book.route` },
        { URL: `/`, route: `home.route` },
        { URL: `/404`, route: `404.route` },
        { URL: `/`, route: `redirect.route` },
        { URL: `/`, route: `links.route` }
    ];

    pages.forEach((routeData) => {
        app.use(routeData.URL, require(`./pages/${routeData.route}`));
    });

};

module.exports = createPageRoutes;