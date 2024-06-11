import React, { useState } from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Paper,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../services/BookService';
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

        // Convert releaseDate to a Date object
        const releaseDateObj = new Date(releasedate);
        console.log(releaseDateObj.getFullYear())
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
        <Container maxWidth="sm">
            <Paper elevation={3} className="form-container">
                <Typography variant="h4" gutterBottom>
                    Add New Book
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <TextField
                        label="Author"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={4}
                    />
                    <TextField
                        label="Pages"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={pages}
                        onChange={(e) => setPages(parseInt(e.target.value))}
                        required
                    />
                    <TextField
                        select
                        label="Genre"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        required
                    >
                        {genres.map((genre) => (
                            <MenuItem key={genre} value={genre}>
                                {genre}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Image URL"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={img}
                        onChange={(e) => setImg(e.target.value)}
                    />
                    <TextField
                        label="Release Date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={releasedate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                        required
                    />
                    <Box mt={3}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Add Book
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default BookForm;
