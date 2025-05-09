import React, { useRef, useEffect } from "react";

function MovieDetails({
  movie: {
    title,
    tagline,
    overview,
    backdrop_path,
    genres,
    release_date,
    production_companies,
    revenue,
    runtime,
    original_language,
    spoken_languages, //english_name
    vote_average,
    budget,
  },
  onClose,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

     // Handle Escape key to close modal
     const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  return (
    <div className="modal-overlay">
      <button
        className="modal-close"
        title="Close"
        onClick={onClose}
        aria-label="Close movie details"
        ref={closeButtonRef}
      >
        X
      </button>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-title"
      >
        <div className="movieDetails">
          <h2 id="movie-title" className="movieTitle">
            {title}
          </h2>
          <div className="content">
            <div className="rating">
              <img src="star.svg" alt="" aria-hidden="true" />
              <span className="sr-only">Rating for {title}</span>
              <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            </div>
            <span aria-hidden="true">•</span>
            <span className="sr-only">Language for {title} is</span>
            <p className="lang">{original_language.toUpperCase()}</p>
            <span aria-hidden="true">•</span>
            <p className="year">
              <span className="sr-only">Release date for {title}</span>
              {release_date ? release_date.split("-")[0] : "N/A"}
            </p>
          </div>
          <h3 className="movieSubTitle">{tagline}</h3>
          <img
            className="backdropImage"
            src={
              backdrop_path
                ? `https://image.tmdb.org/t/p/w500/${backdrop_path}`
                : `/no-movie.svg`
            }
            alt=""
            aria-hidden="true"
          />
          <div className="movieInfo">
            {genres && genres.length > 0 && (
              <div className="genreTag">
                {genres.map((genre) => (
                  <span className="genreItem" key={genre.id}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            <ul className="movieParam">
              {overview && <li>{overview}</li>}
              {production_companies.length > 0 && (
                <li>
                  <b>Production By :</b>{" "}
                  {production_companies.map((c) => c.name).join(", ")}
                </li>
              )}
              {budget > 0 && (
                <li>
                  <strong>Budget: </strong>${budget}
                </li>
              )}
              {revenue > 0 && (
                <li>
                  <strong>Revenue: </strong> ${revenue}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
