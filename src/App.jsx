import React, { Children, useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite";
import { createPortal } from "react-dom";
import MovieDetails from "./components/MovieDetails";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endPoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
        : `${API_BASE_URL}/discover/movie`;
      const response = await fetch(endPoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch Movies");
      }
      const data = await response.json();
      if (data.response === "False") {
        setErrorMessage(data.error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }
      console.log("Movie List :", data.results);
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log("Error fetching Movies: ", error);
      setErrorMessage("Error fetching movies, Please try Again");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovieDetails = async (movieId) => {
    // setIsLoading(true);

    try {
      const endpoint = `${API_BASE_URL}/movie/${movieId}`; // Append videos and credits for more details
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();
      console.log("Selected Movie Details: ", data.original_title, "\n", data);
      setSelectedMovie(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setErrorMessage("Error fetching movie details. Please try again.");
    } finally {
      // setIsLoading(false);
    }
  };
  const handleMovieClick = (movieId) => {
    fetchMovieDetails(movieId);
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <div key={movie.id} onClick={() => handleMovieClick(movie.id)}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </ul>
          )}
        </section>

        {selectedMovie &&
          createPortal(
            <MovieDetails
              movie={selectedMovie}
              onClose={() => setSelectedMovie(null)}
            />,
            document.body
          )}
      </div>
    </main>
  );
}

export default App;
