import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import BookForm from './components/BookForm';

const App: React.FC = () => {
    return (
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route path="/" element={<BookList />} />
                    <Route path="/book/:id" element={<BookDetail />} />
                    <Route path="/add-book" element={<BookForm />} />
                </Routes>
            </Router>
        </React.StrictMode>
    );
};

export default App;
