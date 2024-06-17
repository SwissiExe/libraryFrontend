import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, updateBook, Book } from '../services/BookService';
import { getReviewsByBookId, addReview, getAverageRatingByBookId, Review, NewReview } from '../services/ReviewService';
import {Container, Typography, Box, Button, CardMedia, Paper, TextField, IconButton, MenuItem} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import './BookDetail.css';


interface GenreSelectorProps {
    initialGenre: string;
}

const genres = [
    'Fantasy',
    'Krimi',
    'Horror',
    'Liebesroman',
    'Science Fiction',
    'Sachbuch'
];


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
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [bookEdit, setBookEdit] = useState<Book | null>(null);
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
        setBookEdit({
            ...book!,
            [name]: value
        });
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

    const handleBookUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (bookEdit && id) {
            await updateBook(bookEdit);
            const updatedBook = await getBookById(parseInt(id));
            setBook(updatedBook);
            setIsEditFormOpen(false); // Close the form after submission
        }
    };

    const handleOpenReviewForm = () => {
        setIsReviewFormOpen(true);
    };

    const handleCloseReviewForm = () => {
        setIsReviewFormOpen(false);
    };

    const handleOpenEditForm = () => {
        setBookEdit(book);
        setIsEditFormOpen(true);
    };

    const handleCloseEditForm = () => {
        setIsEditFormOpen(false);
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
                                    <button onClick={handleOpenEditForm} className="details-Edit-Button"><img className="details-Edit-Button-img" src="https://static-00.iconduck.com/assets.00/edit-icon-511x512-ir85i9io.png" alt="buttonpng"/></button>
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
                                        variant="outlined"
                                        color="secondary"
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
                                        sx={{ color: (hoverRating || newReview.rating) >= value ? 'gold' : 'grey' }}
                                        onMouseEnter={() => setHoverRating(value)}
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
            {isEditFormOpen && bookEdit && (
                <div className="review-form-overlay">
                    <Box className="review-form-container">
                        <IconButton
                            onClick={handleCloseEditForm}
                            className="close-button"
                        >
                            <CloseIcon />
                        </IconButton>
                        <form onSubmit={handleBookUpdate} className="add-review-form">
                            <Typography variant="h6" gutterBottom>
                                Edit Book
                            </Typography>
                            <TextField
                                id="book-title"
                                label="Title"
                                name="title"
                                className="detail-input-color"
                                value={bookEdit.title}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                id="book-author"
                                label="Author"
                                name="author"
                                className="detail-input-color"
                                value={bookEdit.author}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                id="book-description"
                                label="Description"
                                name="description"
                                className="detail-input-color"
                                value={bookEdit.description}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                            />
                            <TextField
                                id="book-pages"
                                label="Pages"
                                name="pages"
                                type="number"
                                className="detail-input-color"
                                value={bookEdit.pages}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <GenreSelector initialGenre={bookEdit.genres} />
                            <Button type="submit" variant="contained" color="primary">
                                Update
                            </Button>
                        </form>
                    </Box>
                </div>
            )}
        </>
    );
};
export default BookDetail;

const GenreSelector: React.FC<GenreSelectorProps> = ({ initialGenre }) => {
    const [genre, setGenre] = useState<string>(initialGenre);
    return (
        <TextField
            id="genre-select"
            select
            name="genre"
            label="Genre"
            variant="outlined"
            fullWidth
            className="detail-input-color"
            margin="normal"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
        >
            {genres.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
        </TextField>
    );
};
