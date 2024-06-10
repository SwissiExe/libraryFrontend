import React, { useState } from 'react';
import { IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import './NavigationMenu.css'; // Import custom CSS for additional styling

const NavigationMenu: React.FC = () => {
    const [expanded, setExpanded] = useState(false);

    const toggleMenu = () => {
        setExpanded(!expanded);
    };

    const handleAddBookClick = () => {
        // Aktion für das Hinzufügen eines Buchs
        setExpanded(false);
    };

    const handleSearchClick = () => {
        // Aktion für die Suche nach Büchern
        setExpanded(false);
    };

    return (
        <div className="navigation-menu-container">
            <IconButton
                onClick={toggleMenu}
                color="inherit"
                size="large"
                className={`menu-button ${expanded ? 'expanded' : ''}`}
            >
                {expanded ? <CloseIcon /> : <AddIcon />}
            </IconButton>
            {expanded && (
                <div className="menu-items">
                    <Button onClick={handleAddBookClick} startIcon={<AddIcon />}>
                        Add Book
                    </Button>
                    <Button onClick={handleSearchClick} startIcon={<SearchIcon />}>
                        Search Books
                    </Button>
                </div>
            )}
        </div>
    );
};

export default NavigationMenu;
