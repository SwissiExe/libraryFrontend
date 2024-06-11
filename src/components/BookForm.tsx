import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../services/BookService';
import {
    Container,
    Typography,
    Box,
    Button,
    TextField,
    MenuItem,
    Grid
} from '@mui/material';
import './BookForm.css';

const genres = [
    'Fantasy',
    'Krimi',
    'Horror',
    'Liebesroman',
    'Science Fiction',
    'Sachbuch'
];

const BookForm: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [pages, setPages] = useState<number>(0);
    const [genre, setGenre] = useState<string>('');
    const [img, setImg] = useState<string>('');
    const [releasedate, setReleaseDate] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const releaseDateObj = new Date(releasedate);
        const newBook = {
            id: 0,
            title,
            author,
            description,
            pages,
            genres: genre,
            img,
            releasedate: releaseDateObj
        };

        await addBook(newBook);
        navigate('/');
    };

    return (
        <div className="login-root">
            <Container component="main" maxWidth="sm">
                <Box className="Boxi" style={{ minHeight: '100vh', flexGrow: 1 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate('/')}
                        className="back-button"
                    >
                        Back to Home
                    </Button>
                    <Box className="boxi-moxi">
                        <Typography component="h1" variant="h5">
                            Add New Book
                        </Typography>
                    </Box>
                    <form className="formi" onSubmit={handleSubmit}>
                        <Box className="book-container">
                            <Box className="page left-page">
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="title"
                                    label="Title"
                                    name="title"
                                    autoFocus
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="author"
                                    label="Author"
                                    name="author"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="pages"
                                    label="Pages"
                                    name="pages"
                                    type="number"
                                    value={pages}
                                    onChange={(e) => setPages(parseInt(e.target.value))}
                                />
                                <TextField
                                    select
                                    label="Genre"
                                    variant="outlined"
                                    fullWidth
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
                            </Box>
                            <Box className="page right-page">
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="description"
                                    label="Description"
                                    name="description"
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="img"
                                    label="Image URL"
                                    name="img"
                                    value={img}
                                    onChange={(e) => setImg(e.target.value)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="releasedate"
                                    label="Release Date"
                                    name="releasedate"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={releasedate}
                                    onChange={(e) => setReleaseDate(e.target.value)}
                                />
                            </Box>
                        </Box>
                        <Grid className="butto-zone">
                            <Button type="submit" variant="contained" color="primary">
                                Add Book
                            </Button>
                        </Grid>
                    </form>

                </Box>
            </Container>
        </div>
    );
};

export default BookForm;
