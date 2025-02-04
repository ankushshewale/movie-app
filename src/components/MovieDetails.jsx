import React from "react";

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
    spoken_languages, //english_name
    vote_average,
    budget,
  },
  onClose,
}) {
  const releaseYear = release_date.split("-")[0];
  return (
    <div className="modal-overlay">
      <button className="modal-close" title="Close" onClick={onClose}>
        X
      </button>
      <div className="modal">
        <div className="movieDetails">
          <h2 className="movieTitle">
            {title} <small className="releaseYear">({releaseYear})</small>
          </h2>
          <h3 className="movieSubTitle">{tagline}</h3>
          <img
            className="backdropImage"
            src={
              backdrop_path
                ? `https://image.tmdb.org/t/p/w500/${backdrop_path}`
                : `/no-movie.svg`
            }
            alt={title}
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
                  {production_companies.map((company) => company.name + ", ")}
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
              {vote_average > 0 && (
                <li>
                  <strong>Rating:</strong> {vote_average.toFixed(1)}/10
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
