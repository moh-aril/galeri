import React from 'react';

const SearchBar = ({ searchInput, handleSearchChange }) => {
  return (
    <form className="form-inline my-2 my-lg-0">
      <input
        className="form-control mr-sm-2"
        type="search"
        placeholder="Search..."
        value={searchInput}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;