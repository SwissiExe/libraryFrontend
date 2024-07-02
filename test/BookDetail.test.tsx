import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { getReviewsByBookId, addReview, getAverageRatingByBookId, Review } from '../../services/ReviewService';
import { Book, getBookById, updateBook } from "../../services/BookService";
import BookDetail from "../BookDetail";

jest.mock('../../services/BookService');
jest.mock('../../services/ReviewService');

const bookMock: Book = {
    id: 1,
    title: 'Mock Book Title',
    author: 'Mock Author',
    description: 'Mock Description',
    img: 'mock-image-url',
    pages: 100,
    genres: 'Fantasy',
    releasedate: new Date()
};

const reviewsMock: Review[] = [
    { id: 1, bookId: 1, name: 'Reviewer 1', rating: 5, comment: 'Great book!' },
    { id: 2, bookId: 1, name: 'Reviewer 2', rating: 4, comment: 'Good read.' }
];

const averageRatingMock = 4.5;

describe('BookDetail Component', () => {
    beforeEach(() => {
        (getBookById as jest.Mock).mockResolvedValue(bookMock);
        (getReviewsByBookId as jest.Mock).mockResolvedValue(reviewsMock);
        (getAverageRatingByBookId as jest.Mock).mockResolvedValue(averageRatingMock);
    });

    test('renders book details correctly', async () => {
        render(
            <Router>
                <BookDetail />
            </Router>
        );

        await screen.findByText('Mock Book Title');
        await screen.findByText('by Mock Author');
        await screen.findByText('Mock Description');
        await screen.findByText('Pages: 100');
        await screen.findByText('Genres: Fantasy');
    });

    test('renders reviews correctly', async () => {
        render(
            <Router>
                <BookDetail />
            </Router>
        );

        await screen.findByText('Reviewer 1');
        await screen.findByText('Great book!');
        await screen.findByText('Reviewer 2');
        await screen.findByText('Good read.');
    });

    test('opens and closes review form', async () => {
        render(
            <Router>
                <BookDetail />
            </Router>
        );

        fireEvent.click(await screen.findByText('Write a Review'));

        expect(await screen.findByText('Add a Review')).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText('close'));

        await waitFor(() => expect(screen.queryByText('Add a Review')).not.toBeInTheDocument());
    });

    test('submits a new review', async () => {
        (addReview as jest.Mock).mockResolvedValue({});

        render(
            <Router>
                <BookDetail />
            </Router>
        );

        fireEvent.click(await screen.findByText('Write a Review'));

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Reviewer' } });
        fireEvent.change(screen.getByLabelText('Comment'), { target: { value: 'Amazing book!' } });

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(addReview).toHaveBeenCalledWith({
                bookId: 1,
                name: 'New Reviewer',
                rating: 5,
                comment: 'Amazing book!'
            }, 1);
        });
    });

    test('opens and closes edit form', async () => {
        render(
            <Router>
                <BookDetail />
            </Router>
        );

        fireEvent.click(await screen.findByAltText('buttonpng'));

        expect(await screen.findByText('Edit Book')).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText('close'));

        await waitFor(() => expect(screen.queryByText('Edit Book')).not.toBeInTheDocument());
    });

    test('updates book details', async () => {
        (updateBook as jest.Mock).mockResolvedValue({});

        render(
            <Router>
                <BookDetail />
            </Router>
        );

        fireEvent.click(await screen.findByAltText('buttonpng'));

        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Book Title' } });
        fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Updated Author' } });

        fireEvent.click(screen.getByText('Update'));

        await waitFor(() => {
            expect(updateBook).toHaveBeenCalledWith({
                ...bookMock,
                title: 'Updated Book Title',
                author: 'Updated Author'
            });
        });
    });
});
