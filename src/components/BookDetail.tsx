import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, Book } from '../services/BookService';
import { getReviewsByBookId, addReview, getAverageRatingByBookId, Review, NewReview } from '../services/ReviewService';
import {Container, Typography, Box, Button, CardMedia, Paper, TextField, IconButton} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import './BookDetail.css';
import CloseIcon from "@mui/icons-material/Close";

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState<NewReview>({
        bookId: 0,
        name: '',
        rating: 5,
        comment: ''
    });
    const [averageRating, setAverageRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookAndReviews = async () => {
            if (id) {
                const bookData = await getBookById(parseInt(id));
                setBook(bookData);
                const reviewData = await getReviewsByBookId(parseInt(id));
                setReviews(reviewData);
                setNewReview(prevState => ({ ...prevState, bookId: parseInt(id) }));
                const avgRating = await getAverageRatingByBookId(parseInt(id));
                setAverageRating(avgRating);
            }
        };
        fetchBookAndReviews();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewReview({
            ...newReview,
            [name]: value
        });
    };

    const handleRatingChange = (newRating: number) => {
        setNewReview({
            ...newReview,
            rating: newRating
        });
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            await addReview(newReview, parseInt(id));
            const updatedReviews = await getReviewsByBookId(parseInt(id));
            setReviews(updatedReviews);
            setNewReview({ bookId: parseInt(id), name: '', rating: 5, comment: '' });
            const avgRating = await getAverageRatingByBookId(parseInt(id));
            setAverageRating(avgRating);
            setIsReviewFormOpen(false); // Close the form after submission
        }
    };

    const handleOpenReviewForm = () => {
        setIsReviewFormOpen(true);
    };

    const handleCloseReviewForm = () => {
        setIsReviewFormOpen(false);
    };

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Container className={`container-bookDetail ${isReviewFormOpen ? 'blur' : ''}`}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/')}
                    className="back-button"
                >
                    Back to Home
                </Button>
                <Box className="center-content">
                    <div className="body-Details">
                        <Paper elevation={3} className="paper">
                            <Box className="media-container">
                                <CardMedia
                                    component="img"
                                    height="400"
                                    image={book.img}
                                    alt={book.title}
                                    className="card-media"
                                />
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: '1', alignItems: 'flex-start', paddingLeft: '25px' }}>
                                <div className="typography-title-group">
                                <Typography variant="h4" gutterBottom className="typography-title">
                                    {book.title}
                                </Typography>
                                    <button className="details-Edit-Button"><img className="details-Edit-Button-img" src="https://static-00.iconduck.com/assets.00/edit-icon-511x512-ir85i9io.png" alt="buttonpng"/></button>
                                </div>
                                <Typography variant="h6" gutterBottom className="typography-author">
                                    by {book.author}
                                </Typography>
                                <Typography variant="body1" gutterBottom className="typography-description">
                                    {book.description}
                                </Typography>

                                <div className="container-footer-details-card">
                                    <div className="detail-book-footer">
                                        <Typography variant="body2">Average Rating:</Typography>
                                        <Box className="rating-box">
                                            {[1, 2, 3, 4, 5].map(value => (
                                                <StarIcon
                                                    key={value}
                                                    sx={{ color: value <= averageRating ? 'gold' : 'grey' }}
                                                />
                                            ))}
                                        </Box>
                                        <Typography variant="body2" color="textSecondary" className="typography-info">
                                            Pages: {book.pages}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" className="typography-info">
                                            Genres: {book.genres}
                                        </Typography>

                                    </div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="write-review-button"
                                        onClick={handleOpenReviewForm}
                                    >
                                        Write a Review
                                    </Button>
                                </div>
                            </Box>
                        </Paper>
                        <Box className="center-content-sub">
                            <h3 className="Review-title">Reviews</h3>
                            {reviews.map(review => (
                                <Box key={review.id} className="review-item">
                                    <div className="horizontal-line"></div>
                                    <Box className="review-content">
                                        <Typography variant="h6" className="review-name">
                                            {review.name}
                                        </Typography>
                                        <Box className="review-rating">
                                            {[1, 2, 3, 4, 5].map(value => (
                                                <StarIcon
                                                    key={value}
                                                    sx={{ color: value <= review.rating ? 'gold' : 'grey' }}
                                                />
                                            ))}
                                        </Box>
                                        <Typography variant="body1" className="review-comment">
                                            {review.comment}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </div>
                </Box>
            </Container>
            {isReviewFormOpen && (
                <div className="review-form-overlay">
                    <Box className="review-form-container">
                        <IconButton
                            onClick={handleCloseReviewForm}
                            className="close-button"
                        >
                            <CloseIcon />
                        </IconButton>
                        <form onSubmit={handleReviewSubmit} className="add-review-form">
                            <Typography variant="h6" gutterBottom>
                                Add a Review
                            </Typography>
                            <TextField
                                id="reviewer-name"
                                label="Name"
                                name="name"
                                value={newReview.name}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"

                            />
                            <Box className="rating-box">
                                {[1, 2, 3, 4, 5].map(value => (
                                    <StarIcon
                                        key={value}
                                        sx={{color: (hoverRating || newReview.rating) >= value ? 'gold' : 'grey'}}
                                        onMouseEnter={() => setHoverRating(value)}
                                        onMouseLeave={() => setHoverRating(null)}
                                        onClick={() => handleRatingChange(value)}
                                    />
                                ))}
                            </Box>
                            <TextField
                                id="review-comment"
                                label="Comment"
                                name="comment"
                                value={newReview.comment}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                className="input-Detail-View"
                                multiline
                                rows={4}
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </form>
                    </Box>
                </div>
            )}
        </>
    );
};

export default BookDetail;
