export interface Book {
    id: number;
    title: string;
    description: string;
    author: string;
    pages: number;
    img: string;
}

const API_URL = 'http://localhost:8080/api';

export const getAllBooks = async (): Promise<Book[]> => {
    const response = await fetch(`${API_URL}/get/books`);
    return response.json();
};

export const getBookById = async (id: number): Promise<Book> => {
    const response = await fetch(`${API_URL}/get/book/${id}`);
    return response.json();
};

export const addBook = async (book: Book): Promise<Book> => {
    const response = await fetch(`${API_URL}/add/book`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
    });
    return response.json();
};

export const deleteBook = async (id: number): Promise<void> => {
    await fetch(`${API_URL}/delete/book/${id}`, {
        method: 'DELETE',
    });
};
