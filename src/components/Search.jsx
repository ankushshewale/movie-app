import React from "react";

function Search({ searchTerm, setSearchTerm }) {
  return (
    <search className="search">
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
    </search>
  );
}

export default Search;
