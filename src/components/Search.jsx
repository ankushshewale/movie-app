import React from "react";

function Search({ searchTerm, setSearchTerm }) {
  return (
    <search className="search">
      <div>
        <img src="search.svg" alt="search" aria-hidden="true" />
        <label htmlFor="movieSearch" className="sr-only">
          Search movies
        </label>
        <input
          type="search"
          id="movieSearch"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
    </search>
  );
}

export default Search;
