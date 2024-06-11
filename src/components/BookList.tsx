import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getAllBooks, deleteBook, Book } from '../services/BookService';
import {
    TextField,
    IconButton,
    Typography,
    Box,
    Grid,
    Card as MuiCard,
    CardMedia,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Collapse,
    Slider,
    Button,
    CardContent,
    MenuItem // Importiere MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import './BookList.css';

const genresList = [
    'Fantasy',
    'Krimi',
    'Horror',
    'Liebesroman',
    'Science Fiction',
    'Sachbuch'
];
const sizesList = ['Small', 'Medium', 'Large'];

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [categoryOpen, setCategoryOpen] = useState<boolean>(true);
    const [sizeOpen, setSizeOpen] = useState<boolean>(true);
    const [releaseRange, setReleaseRange] = useState<number[]>([2000, 2024]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>(genresList);
    const [selectedSizes, setSelectedSizes] = useState<string[]>(sizesList);
    const [showFilter, setShowFilter] = useState<boolean>(true);
    const [sortOption, setSortOption] = useState<string>(''); // State für Sortierungsoption
    const [loading, setLoading] = useState<boolean>(true); // State für das Laden der Bücher
    const [visibleBooks, setVisibleBooks] = useState<Book[]>([]); // Sichtbare Bücher für Infinite Scroll
    const [hasMore, setHasMore] = useState<boolean>(true); // Hat mehr Bücher zum Laden
    const navigate = useNavigate();

    const filterRef = useRef<HTMLDivElement>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        loadBooks();
    }, []);

    useEffect(() => {
        filterBooks();
    }, [searchQuery, books, releaseRange, selectedGenres, selectedSizes]);

    useEffect(() => {
        if (!loading && hasMore) {
            loadMoreBooks();
        }
    }, [filteredBooks, loading]);

    const loadBooks = async () => {
        setLoading(true);
        const booksData = await getAllBooks();
        if (Array.isArray(booksData)) {
            setBooks(booksData);
            // Lade die Buchbilder und speichere sie im State
            const images: { [key: number]: string } = {};
            booksData.forEach(book => {
                if (book.img && !images[book.id]) {
                    images[book.id] = book.img;
                }
            });
            setLoading(false);
        } else {
            console.error("Expected an array of books");
        }
    };

    const handleDelete = async (id: number) => {
        await deleteBook(id);
        loadBooks();
    };

    const handleGenreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const genre = event.target.name;
        setSelectedGenres((prevSelectedGenres) =>
            prevSelectedGenres.includes(genre)
                ? prevSelectedGenres.filter((g) => g !== genre)
                : [...prevSelectedGenres, genre]
        );
    };

    const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const size = event.target.name;
        setSelectedSizes((prevSelectedSizes) =>
            prevSelectedSizes.includes(size)
                ? prevSelectedSizes.filter((s) => s !== size)
                : [...prevSelectedSizes, size]
        );
    };

    const getSizeLabel = (pages: number) => {
        if (pages < 200) return 'Small';
        if (pages >= 200 && pages < 400) return 'Medium';
        return 'Large';
    };

    const filterBooks = () => {
        const query = searchQuery.toLowerCase();

        const filtered = books.filter(book => {
            const releaseYear = book.releasedate.getUTCFullYear();
            const sizeLabel = getSizeLabel(book.pages);
            return (
                (book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query)) &&
                releaseYear >= releaseRange[0] &&
                releaseYear <= releaseRange[1] &&
                (selectedGenres.length === 0 || selectedGenres.includes(book.genres)) &&
                (selectedSizes.length === 0 || selectedSizes.includes(sizeLabel))
            );
        });

        setFilteredBooks(filtered);
        setVisibleBooks(filtered.slice(0, 30));
    };

    const handleBookClick = (id: number) => {
        console.log(id)
        navigate(`/book/${id}`);
    };

    const handleAddBookClick = () => {
        navigate('/add-book');
    };

    const handleCategoryToggle = () => {
        setCategoryOpen(!categoryOpen);
    };

    const handleSizeToggle = () => {
        setSizeOpen(!sizeOpen);
    };

    const handleReleaseRangeChange = (event: Event, newValue: number | number[]) => {
        setReleaseRange(newValue as number[]);
    };


    const loadMoreBooks = () => {
        if (visibleBooks.length >= filteredBooks.length) {
            setHasMore(false);
            return;
        }
        const nextBooks = filteredBooks.slice(visibleBooks.length, visibleBooks.length + 30);
        setVisibleBooks(prevBooks => [...prevBooks, ...nextBooks]);
    };

    const lastBookRef = useCallback(
        (node: HTMLElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMoreBooks();
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const Card: React.FC<{
        id: number
        title: string;
        description: string;
        author: string;
        pages: number;
        img: string;
    }> = ({ title, description, author, img , id}) => (
        <MuiCard className={`card ${loading ? 'loading' : ''}`} >
            <CardMedia
                component="img"
                height="200"
                image={img}
                alt={title}
                className="card__image"
            />
            <div className="card__overlay" >
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h3" className="header-title" gutterBottom>
                    Library Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddBookClick}
                >
                    Add Book
                </Button>
            </Box>

            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button className="filters__btn" onClick={() => setShowFilter(!showFilter)}>
                    <span className="show">Show</span>
                    <span className="hide">Hide</span>&nbsp;Filters
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="black">
                        <path d="M3 8L21 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M3 17H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M17 5L17 11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M8 14L8 20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </Button>
            </Box>

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

            <Box display="flex">
                <CSSTransition
                    in={showFilter}
                    timeout={300}
                    classNames="filter"
                    unmountOnExit
                    nodeRef={filterRef}
                >
                    <div ref={filterRef} className="filter-menu">
                        <Typography variant="h6" gutterBottom onClick={handleCategoryToggle}>
                            Type {categoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </Typography>
                        <Collapse in={categoryOpen}>
                            <FormGroup>
                                {genresList.map((genre) => (
                                    <FormControlLabel
                                        key={genre}
                                        control={<Checkbox checked={selectedGenres.includes(genre)} onChange={handleGenreChange} name={genre} />}
                                        label={genre}
                                    />
                                ))}
                            </FormGroup>
                        </Collapse>
                        <hr />
                        <Typography variant="h6" gutterBottom onClick={handleSizeToggle}>
                            Book Size {sizeOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </Typography>
                        <Collapse in={sizeOpen}>
                            <FormGroup>
                                {sizesList.map((size) => (
                                    <FormControlLabel
                                        key={size}
                                        control={<Checkbox checked={selectedSizes.includes(size)} onChange={handleSizeChange} name={size} />}
                                        label={size}
                                    />
                                ))}
                            </FormGroup>
                        </Collapse>
                        <hr />
                        <Typography variant="h6" gutterBottom>
                            Release Year
                        </Typography>
                        <Slider
                            value={releaseRange}
                            onChange={handleReleaseRangeChange}
                            valueLabelDisplay="auto"
                            min={1900}
                            max={2024}
                        />
                    </div>
                </CSSTransition>

                <div className={`cards-container ${!showFilter ? 'full-width' : ''}`}>
                    <Grid className="conny-ponny" container spacing={4}>
                        {visibleBooks.map((book, index) => {
                            if (index === visibleBooks.length - 1) {
                                return (
                                    <Grid className="boss-con" item key={book.id} xs={12} sm={6} md={4} ref={lastBookRef}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a href="#"  className={`card`} onClick={() => handleBookClick(book.id)}>
                                            <Card
                                                id={book.id}
                                                title={book.title}
                                                description={book.description}
                                                author={book.author}
                                                img={book.img} // Verwende das Bild aus dem State
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
                                );
                            } else {
                                return (
                                    <Grid className="boss-con"  item key={book.id} xs={12} sm={6} md={4}>
                                        <a href="#" className={`card`} onClick={() => handleBookClick(book.id)}>
                                            <Card
                                                id={book.id}
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
                                );
                            }
                        })}
                    </Grid>
                </div>
            </Box>
        </div>
    );
};

export default BookList;
