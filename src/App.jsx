import React, { Children, useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite";
import { createPortal } from "react-dom";
import MovieDetails from "./components/MovieDetails";
import Header from "./components/Header";
import TrendingMovies from "./components/TrendingMovies";

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

      if (query && data.results.length === 0) {
        setErrorMessage("No Movies Found");
        return;
      }

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
    try {
      const endpoint = `${API_BASE_URL}/movie/${movieId}`;
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
        <Header />

        <TrendingMovies trendingMovies={trendingMovies} />

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <li key={movie.id}>
                  <MovieCard
                    movie={movie}
                    onClick={() => handleMovieClick(movie.id)}
                  />
                </li>
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
