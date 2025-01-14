const express = require(`express`);
const compression = require('compression');
const expressHbs = require(`express-handlebars`);
const app = express();
const hbs = require(`hbs`);
const cookieParser = require(`cookie-parser`);
const setRequest = require("./middlewares/request.middleware");
const settingsData = require("./middlewares/settings.middleware");
const loginMiddleware = require("./middlewares/login.middleware");
const createPageRoutes = require("./routes/pages.route");
const createAPIRoutes = require("./routes/api.route");
const createAdminRoutes = require("./routes/admin.route");
const proxy = require("express-http-proxy")
const logger = require('./middlewares/logger.middleware');

require(`dotenv`).config();
const { LOCAL } = process.env;

// handlebars options
app.engine(`hbs`, expressHbs({
    layoutsDir: `views/layouts`,
    defaultLayout: `layout`,
    extname: `hbs`,
    helpers: {
        mylist: function (values, options) {
            let cleaned = values.split('\n').join(' ').split('\r').join(' ')
            try {
                let arr = eval(cleaned);
                let ret = "";
                let last = false;
                let first = true;
                for (var i = 0; i < arr.length; i++) {
                    if (i == arr.length - 1) {
                        last = true;
                    }
                    ret += options.fn({ ...arr[i], '_last': last, '_first': first });
                    first = false;
                }
                return ret;
            } catch (error) {
                throw new Error(`MyList helper eval error. Values: ${values}`)
            }
        }
    }
}));

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(compression());
// static source path
app.use(`/public`, express.static(__dirname + `/public`, {
    cacheControl: true, 
    setHeaders: function (res, path) {
        res.setHeader("Cache-Control", "max-age=31536000");
    }
}));
app.use(`/robots.txt`, express.static(__dirname + `/robots.txt`));
app.use(`/sitemap.xml`, express.static(__dirname + `/sitemap.xml`));
app.use(`/data-mock`, express.static(__dirname + `/data-mock`));
app.use(`/bootstrap`, express.static(__dirname + `/node_modules/bootstrap`));

// middleware
app.use(express.json({ extended: true }));
app.use(cookieParser('secretKeyBasementRemodelingDotCom'));
app.use(setRequest);
app.use(loginMiddleware);
app.use(settingsData);



// pages routes
createPageRoutes(app);

// API routes
createAPIRoutes(app);

// API routes
createAdminRoutes(app);


app.use((request, response, next) => {
    response.status(404).redirect(`/404`);
});


const PORT = process.env.PORT || 8888;
const HOST = process.env.HOST
let server = app.listen(PORT, HOST);
server.setTimeout(500000);


process
    .on('uncaughtException', function (err) {
        logger.log({ 'level': 'error', 'message': err.stack, 'inputs': [...arguments][0] })
        process.exit(1);
    })
    .on('unhandledRejection', (reason, p) => {
        logger.log({ 'level': 'error', 'message': `Unhandled rejection ${reason.stack} at ${p}`, 'inputs': [...arguments][0] })
        process.exit(1);
    })
