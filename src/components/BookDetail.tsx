import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, Book } from '../services/BookService';
import { Container, Typography, Box, Button, CardMedia, Paper } from '@mui/material';
import './BookDetail.css';

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            if (id) {
                const bookData = await getBookById(parseInt(id));
                setBook(bookData);
            }
        };
        fetchBook();
    }, [id]);

    if (!book) {
        return <div>Loading...</div>;
    }

    return (

        <Container className="container-bookDetail">
            <Button variant="contained" color="primary" onClick={() => navigate('/')} className="button">
                Back to Home
            </Button>
            <Paper elevation={3} className="paper">
                <CardMedia
                    component="img"
                    height="400"
                    image={book.img}
                    alt={book.title}
                    className="card-media"
                />
                <Box sx={{ marginLeft: 4 }}>
                    <Typography variant="h4" gutterBottom className="typography-title">
                        {book.title}
                    </Typography>
                    <Typography variant="h6" gutterBottom className="typography-author">
                        by {book.author}
                    </Typography>
                    <Typography variant="body1" gutterBottom className="typography-description">
                        {book.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="typography-info">
                        Pages: {book.pages}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="typography-info">
                        Genres: {book.genres}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default BookDetail;
