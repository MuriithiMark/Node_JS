const http = require("node:http");

const reqUtils = require("./utils/reqUtils");
const jsonData = require("./data/events.json");

const port = 8000;
const products = [
    {
        id: 1,
        category: 'Phones',
        name: 'Xiomi',
        price: 600
    },
    {
        id: 2,
        category: 'Fruit',
        name: 'Orange',
        price: 2
    },
    {
        id: 3,
        category: 'Vehicles',
        name: 'Subaru Forester',
        price: 20000
    }
]

/**
 * @type {{
 *      path: string,
 *      method?: string,
 *      action: (req: http.IncomingMessage, 
 *          res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }) => void
 *      }[]}
 */
const routes = [
    {
        path: '/',
        action: (req, res) => {
            res.write(`Home Page`)
        }
    },
    {
        path: '/products',
        action: (req, res) => {
            res.setHeader('Content-Type', 'application/json')
            res.write(JSON.stringify(products))
        }
    },
    {
        path: '/products/:productId',
        action: (req, res) => {
            const productId = Number(req.params.productId);
            const product = products.find((product) => product.id === productId);
            if (!product) {
                res.write(JSON.stringify({
                    status: 'fail',
                    message: 'product not found'
                }))
                return;
            }
            res.write(JSON.stringify(product))
        }
    },
    {
        path: '/products/:category/:productId',
        action: (req, res) => {
            const productId = Number(req.params.productId);
            const category = req.params.category;
            const product = products.find((product) =>
                product.id === productId &&
                product.category.toLowerCase() === category.toLowerCase()
            );
            if (!product) {
                res.write(JSON.stringify({
                    status: 'fail',
                    message: 'product not found'
                }))
                return;
            }
            res.write(JSON.stringify(product))
        }
    },

    // MAIN ASSIGNMENT
    {
        path: "/events",
        action: (req, res) => {
            res.setHeader('Content-Type', 'application/json')
            res.write(JSON.stringify(jsonData))
        }

    },
    {
        path: "/events/:eventId",
        action: (req, res) => {

            const eventId = Number(req.params.eventId);
            const event = jsonData.find((event) => event.id === eventId);
            if(!event) {
                res.setHeader('Content-Type', 'application/json')
                res.write(JSON.stringify({
                    status: 'fail',
                    message: 'no such event'
                }))
            }

            res.write(JSON.stringify(event));
        }
    }
]

const server = http.createServer((req, res) => {
    console.info(`\n${req.method} ${req.url}`)

    // Path processing and mapping
    const currentPath = routes.find((route) => {
        if (req.url === route.path) {
            return true;
        }
        const templatePath = route.path.split('/');
        const realPath = req.url.split('/');
        if (realPath.length !== templatePath.length) {
            return false
        }
        // by default true, unless match fail
        let truthCheck = false;

        for (let i = 0; i < templatePath.length; i++) {
            if (templatePath[i].startsWith(':')) {
                continue;
            }
            if (templatePath[i] !== realPath[i]) {
                return false;
            }
            truthCheck = true;
        }

        if(truthCheck) {
            // Retrieve Params if any
            req = reqUtils(req, route.path)
        }

        return truthCheck;
    });

    if (!currentPath) {
        res.setHeader('status', 404)
        res.write('page not found')
        res.end()
        // guarantee no proceed
        return;
    }

    // TODO handle route methods: GET, POST, PUT, DELETE

    currentPath.action(req, res);
    res.end()
})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}\n`)
})