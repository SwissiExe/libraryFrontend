import React, { useEffect, useState } from 'react';
import { getAllBooks, deleteBook, Book } from '../services/BookService';
import {
    TextField,
    IconButton,
    Container,
    Typography,
    Box,
    Button,
    Card as MuiCard,
    CardContent,
    CardMedia,
    Grid,
    Paper,
    Menu,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import './BookList.css';

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

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
        navigate('/search');
        handleClose();
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const Card: React.FC<{
        title: string;
        description: string;
        author: string;
        pages: number;
        img: string;
    }> = ({ title, description, author, img }) => (
        <MuiCard className="card">
            <CardMedia
                component="img"
                height="200"
                image={img}
                alt={title}
                className="card__image"
            />
            <div className="card__overlay">
                <div className="card__header">
                    <div className="card__header-text">
                        <Typography variant="h6" className="card__title">
                            {title}
                        </Typography>
                        <Typography variant="body2" className="card__author">
                            {author}
                        </Typography>
                    </div>
                </div>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p" className="card__description">
                        {description}
                    </Typography>
                </CardContent>
            </div>
        </MuiCard>
    );

    return (
        <div className="container">
                <Typography variant="h3" className="header-title" gutterBottom>
                    Library Management
                </Typography>
           

            <Box my={4} className="search-box">
                <TextField
                    label="Search by Title or Author"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="search-field"
                    color="primary"
                />
            </Box>
            <div className="content">
                <div className="filter-menu">
                        <Typography variant="h6" gutterBottom>
                            Type
                        </Typography>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Gift" />
                            <FormControlLabel control={<Checkbox />} label="Indoor" />
                            <FormControlLabel control={<Checkbox />} label="Outdoor" />
                        </FormGroup>
                        <Typography variant="h6" gutterBottom>
                            Size
                        </Typography>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Small" />
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Medium" />
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Large" />
                        </FormGroup>

                </div>
                <div className="cards-container">
                    <Grid container spacing={4}>
                        {filteredBooks.map(book => (
                            <Grid item key={book.id} xs={12} sm={6} md={4}>
                                <a href="" className={`card`} onClick={() => handleBookClick(book.id)}>
                                    <Card
                                        title={book.title}
                                        description={book.description}
                                        author={book.author}
                                        img={book.img}
                                        pages={book.pages}
                                    />
                                    <IconButton
                                        edge="end"
                                        className={`delete-button`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(book.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </a>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default BookList;
