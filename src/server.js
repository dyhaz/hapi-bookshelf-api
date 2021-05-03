const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
    });

    await server.register([
        require('inert'),
        require('vision'),
        {
            plugin: require('hapi-swaggered'),
            options: {
                cors: true,
                tags: {
                    'books': 'Books API',
                    'login': 'Login'
                },
                info: {
                    title: 'Books API',
                    description: 'Powered by node, hapi, joi, hapi-swaggered, hapi-swaggered-ui and swagger-ui',
                    version: '1.0'
                }
            }
        },
        {
            plugin: require('hapi-swaggered-ui'),
            options: {
                title: 'Example API',
                path: '/docs',
                authorization: {
                    field: 'apiKey',
                    scope: 'header',
                    // valuePrefix: 'bearer '// prefix incase
                    defaultValue: 'demoKey',
                    placeholder: 'Enter your apiKey here'
                },
                swaggerOptions: {
                    validatorUrl: null
                }
            }
        }
    ]);

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();
