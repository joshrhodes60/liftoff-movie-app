import React, { useEffect, useState } from "react";
import Movie from "./components/Movie";

const GENRE_API =
  "https://api.themoviedb.org/3/genre/movie/list?api_key=04c35731a5ee918f014970082a0088b1";

// const API_KEY = "api_key=04c35731a5ee918f014970082a0088b1";
const BASE_URL = "https://api.themoviedb.org/3";
// const API_URL =
// BASE_URL + "/discover/movie/?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
// const searchURL = BASE_URL + "/search/movie?" + API_KEY;
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const FEATURED_API =
  "https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&with_genres=28";

const SEARCH_API =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const tagsEl = document.getElementById("tags");

let selectedGenre = [35];
// setGenre();
function setGenre() {
  tagsEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener("click", () => {
      if (selectedGenre.length === 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id === genre.id) {
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      getMovies(FEATURED_API + encodeURI(selectedGenre.join(",")));
      highlightSelection();
    });
    tagsEl.append(t);
  });
}

function highlightSelection() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("highlight");
  });
  clearBtn();
  if (selectedGenre.length !== 0) {
    selectedGenre.forEach((id) => {
      const highlightedTag = document.getElementById(id);
      highlightedTag.classList.add("hightlight");
    });
  }
}

function clearBtn() {
  let clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.classList.add("highlight");
  } else {
    let clear = document.createElement("div");
    clear.classList.add("tag", "highlight");
    clear.id = "clear";
    clear.innerText = "clear x";
    clear.addEventListener("click", () => {
      selectedGenre = [];
      setGenre();
      getMovies(FEATURED_API);
    });
    tagsEl.append(clear);
  }
}

getMovies(FEATURED_API);

function getMovies(API) {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      if (data.results.length !== 0) {
        showMovies(data.results);
      } else {
        main.innerHTML = '<h1 class= "no-results> No Results Found</h1>';
      }
      showMovies(data.results);
    });
}

function showMovies(data) {
  main.innerHTML = "";

  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
     <img src= "${
       poster_path
         ? IMG_URL + poster_path
         : "http://via.placeholder.com/1080x1580"
     }" alt="${title}">

    <div class="movie-info">
      <h3>${title}</h3>
      <span class = "${getColor(vote_average)}">${vote_average}</span>
    </div>

    <div class="overview">
      ${overview};
      
    </div>`;

    main.appendChild(movieEl);
  });
}

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchterm = search.value;

  if (searchterm) {
    getMovies(SEARCH_API + searchterm);
  } else {
    getMovies(FEATURED_API);
  }
});

function App() {
  const [movies, setMovies] = useState([]);
  const [movieMaster, setMovieMaster] = useState([]);
  const [selectedGen, setSelectedGen] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  // const [genre, setGenre] = useState([]);
  // const [list, setList] = useState([]);

  useEffect(async () => {
    getter(setMovies, FEATURED_API);
    getter(setMovieMaster, FEATURED_API);
    // getter(setGenre, GENRE_API);
    // getter(setList, LIST_API);
  }, []);

  const getter = (setFunction, API) => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        setFunction(data.results);
      });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (searchTerm) {
      getter(setMovies, SEARCH_API + searchTerm);
      setSearchTerm("");
    }
  };

  const setGenreMovies = (id) => {
    const newMovies = movieMaster.filter((mov) =>
      mov.genre_ids.includes(id)
    );
    setSelectedGen(id);
    console.log(newMovies);
    setMovies(newMovies);
  };

  const handleOnChange = (e) => {
    setSearchTerm(e.target.value);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre = [];
    setGenre();
    if (searchTerm) {
      getMovies(SEARCH_API + searchTerm);
    } else {
      getMovies(FEATURED_API);
    }
  });

  return (
    <>
      <header>
        <h1>&#128576; MOTION PICTURE MADNESS &#128576;</h1>
        <form onSubmit={handleOnSubmit}>
          <input
            className="search"
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleOnChange}
          />
        </form>
      </header>
      <div id="tags">
        <div
          onClick={() => setGenreMovies(28)}
          className="tag"
          style={{ backgroundColor: selectedGen == 28 ? "red" : null }}
        >
          Action
        </div>
        <div  onClick={() => setGenreMovies(12)}className="tag" style={{ backgroundColor: selectedGen == 12 ? "red" : null }}>Adventure</div>
        <div  onClick={() => setGenreMovies(18)}className="tag" style={{ backgroundColor: selectedGen == 18 ? "red" : null }}>Drama</div>
        <div  onClick={() => setGenreMovies(35)}className="tag" style={{ backgroundColor: selectedGen == 35 ? "red" : null }}>Comedy</div>
      </div>
      <div className="movie-container">
        {movies.length > 0 &&
          movies.map((movie) => <Movie key={movie.id} {...movie} />)}
      </div>
    </>
  );
}

export default App;
