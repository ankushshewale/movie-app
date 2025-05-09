import React from "react";

function MovieCard({
  movie: { title, vote_average, poster_path, release_date, original_language },
  onClick = () => {},
}) {
  return (
    <button className="movie-card" onClick={onClick}>
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : `/no-movie.svg`
        }
        alt=""
        aria-hidden="true"
        width="250px"
        height="375px"
      />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="" role="presentation" aria-hidden="true" />
            <p>
              <span className="sr-only">Rating for {title}</span>
              {vote_average ? vote_average.toFixed(1) : "N/A"}
            </p>
          </div>
          <span aria-hidden="true">•</span>
          <p className="lang">
            <span className="sr-only">Language for {title} is</span>
            {original_language.toUpperCase()}
          </p>
          <span aria-hidden="true">•</span>
          <p className="year">
            <span className="sr-only">Release year for {title}</span>
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </button>
  );
}

export default MovieCard;
