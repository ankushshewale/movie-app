import React from "react";

function TrendingMovies({ trendingMovies }) {
  return (
    <section className="trending" aria-labelledby="trending-title">
      <h2 id="trending-title">Trending Movies</h2>
      <ul>
        {trendingMovies.map((movie, index) => (
          <li key={movie.$id}>
            <p aria-hidden="true">{index + 1}</p>
            <img src={movie.poster_url} alt={movie.$id} />
            <span
              className="sr-only"
              aria-label={`Trending movie rank: ${index + 1}`}
            >
              Trending movie rank: {index + 1}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TrendingMovies;
