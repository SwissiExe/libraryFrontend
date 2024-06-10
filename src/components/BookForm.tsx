import React, { useEffect, useState } from 'react';
import { getAllBooks, deleteBook, Book } from '../services/BookService';
import {
    TextField,
    IconButton,
    Container,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Paper,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import './BookList.css'; // Import custom CSS for additional styling

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const navigate = useNavigate();
    const theme = useTheme();
    const isDarkMode = useMediaQuery(theme.breakpoints.up('sm'));

    useEffect(() => {
        loadBooks();
    }, []);

    useEffect(() => {
        filterBooks();
    }, [searchQuery, books]);

    const loadBooks = async () => {
        const books = await getAllBooks();
        setBooks(books);
    };

    const handleDelete = async (id: number) => {
        await deleteBook(id);
        loadBooks();
    };

    const filterBooks = () => {
        const query = searchQuery.toLowerCase();
        setFilteredBooks(
            books.filter(book =>
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query)
            )
        );
    };

    const handleBookClick = (id: number) => {
        navigate(`/book/${id}`);
    };

    const handleAddBookClick = () => {
        navigate('/add-book');
    };

    const handleSearchClick = () => {
        // Handle navigation to search page
        navigate('/search');
    };

    return (
        <Container className={`book-list-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <Paper className="header" elevation={3}>
                <Typography variant="h3" className="header-title" gutterBottom>
                    Library Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddBookClick}
                    className="add-book-button"
                >
                    Add New Book
                </Button>
            </Paper>
            <Box my={4} className="search-box">
                <TextField
                    label="Search by Title or Author"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="search-field"
                />
            </Box>
            <Grid container spacing={4}>
                {filteredBooks.map(book => (
                    <Grid item key={book.id} xs={12} sm={6} md={4}>
                        <Card
                            className={`book-card ${isDarkMode ? 'dark-mode' : ''}`}
                            onClick={() => handleBookClick(book.id)}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={book.img}
                                alt={book.title}
                                className="card-media"
                            />
                            <CardContent>
                                <Typography variant="h6" className="card-title" gutterBottom>
                                    {book.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="card-author">
                                    {book.author}
                                </Typography>
                            </CardContent>
                            <IconButton
                                edge="end"
                                className={`delete-button ${isDarkMode ? 'dark-mode' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(book.id);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box className="overlay-container">
                <IconButton className="add-book-overlay" onClick={handleAddBookClick}>
                    <AddIcon />
                </IconButton>
                <IconButton className="search-overlay" onClick={handleSearchClick}>
                    <SearchIcon />
                </IconButton>
            </Box>
        </Container>
    );
};

export default BookList;
