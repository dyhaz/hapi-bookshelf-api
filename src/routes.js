const {addBookHandler, getAllBooksHandler, deleteBookHandler, editBookByIdHandler, getDetailBookById} = require("./handler");
const Joi = require('joi');
const Boom = require('@hapi/boom');

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Homepage';
        },
    },
    {
        method: 'GET',
        path: '/about',
        handler: (request, h) => {
            return 'About page';
        },
    },
    {
        method: 'GET',
        path: '/users/{username?}',
        handler: (request, h) => {
            const { username = 'stranger' } = request.params;
            return `Hello, ${username}!`;
        },
    },
    {
        method: 'POST',
        path: '/login',
        handler: (request, h) => {
            const { username, password } = request.payload;
            return `Welcome ${username}!`;
        },
        options: {
            tags: ['api'],
            description: 'Login',
            notes: 'Login',
            validate: {
                payload: Joi.object({
                    username: Joi.string().min(3).max(100),
                    password: Joi.string().min(6)
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
        options: {
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            description: 'Add new books',
            notes: 'Add new books',
            validate: {
                payload: Joi.object({
                    name: Joi.string(),
                    author: Joi.string().required(),
                    year: Joi.number().required().greater(1800),
                    summary: Joi.string().required(),
                    publisher: Joi.string().required(),
                    pageCount: Joi.number().required(),
                    readPage: Joi.number().required(),
                    finished: Joi.bool().default(false),
                    reading: Joi.bool()
                }).meta({ className: 'Book' })
            }
        }
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
        options: {
            tags: ['api'],
            description: 'Get all books',
            notes: 'Get all books'
        }
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getDetailBookById,
        options: {
            tags: ['api'],
            description: 'Get detail books',
            notes: 'Get detail books'
        }
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: editBookByIdHandler,
        options: {
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            description: 'Add new books',
            notes: 'Add new books',
            validate: {
                payload: Joi.object({
                    name: Joi.string(),
                    author: Joi.string().required(),
                    year: Joi.number().required().greater(1800),
                    summary: Joi.string().required(),
                    publisher: Joi.string().required(),
                    pageCount: Joi.number().required(),
                    readPage: Joi.number().required(),
                    finished: Joi.bool().default(false),
                    reading: Joi.bool()
                }).meta({ className: 'Book' })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookHandler,
        options: {
            tags: ['api'],
            description: 'Delete books',
            notes: 'Delete books',
            validate: {
                params: Joi.object({
                    bookId: Joi.string().required()
                })
            }
        }
    },
    {
        method: '*',
        path: '/{any*}',
        handler: (request, h) => {
            return 'Halaman tidak ditemukan';
        },
    },
];

module.exports = routes;
