import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, Book } from '../services/BookService';
import { Container, Typography, Box, Button, Card, CardContent, CardMedia, Grid, Paper } from '@mui/material';

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
        <Container>
            <Button variant="contained" color="primary" onClick={() => navigate('/')} style={{ margin: '20px 0' }}>
                Back to Home
            </Button>
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <CardMedia
                            component="img"
                            height="400"
                            image={book.img}
                            alt={book.title}
                            sx={{
                                borderRadius: 2,
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: 6,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <CardContent sx={{ animation: 'fadeIn 1s ease-in-out' }}>
                            <Typography variant="h4" gutterBottom>{book.title}</Typography>
                            <Typography variant="h6" gutterBottom>by {book.author}</Typography>
                            <Typography variant="body1" gutterBottom>{book.description}</Typography>
                            <Typography variant="body2" color="textSecondary">Pages: {book.pages}</Typography>
                        </CardContent>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default BookDetail;
