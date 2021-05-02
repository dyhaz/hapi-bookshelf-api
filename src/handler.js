const books = require("./books");
const { nanoid } = require('nanoid');
const LodashPick = require('lodash.pick');
const LodashMap = require('lodash.map');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, finished, reading } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const insertedAt = new Date().toISOString();
    const updatedAt = createdAt;
    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, finished, reading, id, createdAt, insertedAt, updatedAt,
    };

    if (newBook.readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((b) => b.id === id).length > 0 && newBook.name;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: newBook.name ? 'Buku gagal ditambahkan' : 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(newBook.name ? 500 : 400);
    return response;
};

const getAllBooksHandler = (request, h) => ({
    status: 'success',
    data: {
        books: books.map(b => ({id: b.id, name: b.name, publisher: b.publisher}))
    },
});

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, finished, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookHandler = (request, h) => {
    const { id } = request.params;
    const isAvailable = books.filter((b) => b.id === id).length > 0;

    if (isAvailable) {
        const index = books.findIndex((book) => book.id === id);

        if (index !== -1) {
            books.splice(index, 1);
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
};

const getDetailBookById = (request, h) => {
    const { bookId } = request.params;
    const isAvailable = books.filter((b) => b.id === bookId).length > 0;

    if (isAvailable) {
        return {
            status: 'success',
            data: {
                book: books.filter((b) => b.id === bookId)[0]
            }
        }
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }
}

module.exports = { addBookHandler, getAllBooksHandler, deleteBookHandler, editBookByIdHandler, getDetailBookById };
