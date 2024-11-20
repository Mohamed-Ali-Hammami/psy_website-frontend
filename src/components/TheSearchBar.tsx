"use client";
import React from 'react';
import styles from '../styles/SearchBar.module.css'; // Import the CSS module

interface SearchBarProps {
  searchTerm: string; // Current search term
  onSearchChange: (term: string) => void; // Function to update search term
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value); // Update the search term in the parent component
  };

  return (
    <div className={styles['search-box']}>
      <input 
        type="text" 
        placeholder="Search by product name" 
        className={styles['search-input']} 
        value={searchTerm} // Controlled input
        onChange={handleInputChange} // Handle input change
      />
    </div>
  );
};

export default SearchBar;
