// B5.12 - Movie Manager. Reloading the page restores the starting movies.

// Represents one movie using the same properties as B4.
class Movie {
    // Stores the movieId, title, year and rating supplied to the constructor.
    constructor(movieId, title, year, rating) {
        this.movieId = movieId;
        this.title = title;
        this.year = year;
        this.rating = rating;
    }
}

// Stores the movie array and provides its main operations.
class MovieList {
    // Stores the supplied array of movies.
    constructor(movies) {
        this.movies = movies;
    }

    // Searches sequentially for movieId and returns its movie or null.
    searchById(movieId) {
        // Tracks the movie currently being checked.
        for (let index = 0; index < this.movies.length; index++) {
            if (this.movies[index].movieId === movieId) {
                return this.movies[index];
            }
        }
        return null;
    }

    // Adds movie if its ID is unused; returns whether the addition succeeded.
    addMovie(movie) {
        if (this.searchById(movie.movieId) !== null) {
            return false;
        }
        this.movies.push(movie);
        return true;
    }

    // Updates an existing movie and returns whether it was found.
    updateMovie(movie) {
        // Stores the matching movie object.
        const existingMovie = this.searchById(movie.movieId);
        if (existingMovie === null) {
            return false;
        }
        existingMovie.title = movie.title;
        existingMovie.year = movie.year;
        existingMovie.rating = movie.rating;
        return true;
    }

    // Deletes the movie with movieId and returns whether it was found.
    deleteMovie(movieId) {
        // Tracks the array position to remove.
        for (let index = 0; index < this.movies.length; index++) {
            if (this.movies[index].movieId === movieId) {
                this.movies.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    // Returns movies whose titles contain searchText, ignoring letter case.
    searchByTitle(searchText) {
        // Stores the matching movies.
        const matches = [];
        // Checks each movie against the search text.
        for (const movie of this.movies) {
            if (movie.title.toLowerCase().includes(searchText.toLowerCase())) {
                matches.push(movie);
            }
        }
        return matches;
    }
}

// Compares firstMovie and secondMovie by title from A to Z.
function compareTitlesAscending(firstMovie, secondMovie) {
    return firstMovie.title.toLowerCase().localeCompare(secondMovie.title.toLowerCase());
}

// Compares firstMovie and secondMovie by title from Z to A.
function compareTitlesDescending(firstMovie, secondMovie) {
    return compareTitlesAscending(secondMovie, firstMovie);
}

// Compares firstMovie and secondMovie by rating, highest first.
function compareRatings(firstMovie, secondMovie) {
    return secondMovie.rating - firstMovie.rating;
}

// Stores the ten starting movies from B4.
const movieList = new MovieList([
    new Movie(105, "Spirited Away", 2001, 10),
    new Movie(110, "A Silent Voice", 2016, 10),
    new Movie(101, "Howl's Moving Castle", 2004, 8),
    new Movie(108, "Akira", 1988, 7),
    new Movie(103, "Castle in the Sky", 1986, 7),
    new Movie(107, "Princess Mononoke", 1997, 8),
    new Movie(104, "Perfect Blue", 1998, 9),
    new Movie(109, "Your Name", 2016, 9),
    new Movie(102, "Weathering with You", 2019, 7),
    new Movie(106, "Garden of words", 2013, 8)
]);

// Stores the HTML elements used by the script.
const elements = {
    dialog: document.getElementById("maintenance-dialog"),
    form: document.getElementById("movie-form"),
    action: document.getElementById("movie-action"),
    movieId: document.getElementById("movie-id"),
    title: document.getElementById("movie-title"),
    year: document.getElementById("movie-year"),
    rating: document.getElementById("movie-rating"),
    heading: document.getElementById("dialog-heading"),
    help: document.getElementById("dialog-help"),
    submit: document.getElementById("submit-movie-button"),
    formMessage: document.getElementById("maintenance-message"),
    pageMessage: document.getElementById("page-message"),
    idResult: document.getElementById("id-search-result"),
    searchId: document.getElementById("search-id"),
    searchTitle: document.getElementById("search-title"),
    tableBody: document.getElementById("movie-table-body"),
    count: document.getElementById("list-count")
};

// Displays the supplied movies in the table.
function displayMovies(movies) {
    elements.tableBody.textContent = "";
    // Creates one row for each movie.
    for (const movie of movies) {
        // Stores the new row and the values to display in it.
        const row = document.createElement("tr");
        const values = [movie.movieId, movie.title, movie.year, movie.rating];
        // Adds each value as a text cell, keeping entered titles separate from HTML.
        for (let index = 0; index < values.length; index++) {
            const cell = document.createElement("td");
            cell.textContent = values[index];
            if (index >= 2) {
                cell.className = "numeric";
            }
            row.appendChild(cell);
        }
        elements.tableBody.appendChild(row);
    }
    elements.count.textContent = "Showing " + movies.length + " of " + movieList.movies.length + " movies";
}

// Opens the form using the action stored on the clicked button.
function openMaintenance(event) {
    elements.form.reset();
    elements.action.value = event.currentTarget.dataset.openAction;
    setMaintenanceMode();
    elements.dialog.showModal();
}

// Closes the pop-up without saving changes.
function closeMaintenance() {
    elements.dialog.close();
}

// Adjusts the form for the selected action; Delete needs only the ID.
function setMaintenanceMode() {
    // Stores whether the Delete action is selected.
    const isDelete = elements.action.value === "delete";
    elements.title.disabled = isDelete;
    elements.year.disabled = isDelete;
    elements.rating.disabled = isDelete;
    elements.submit.classList.toggle("delete-button", isDelete);
    elements.heading.textContent = "Movie maintenance";
    elements.help.textContent = "Add needs a new ID. Update needs an existing ID and revised details. Delete needs only an existing ID.";
    elements.formMessage.textContent = "";
}

// Applies the selected action after the browser has checked the form inputs.
function saveMovie(event) {
    event.preventDefault();
    // Reads the entered ID and selected action.
    const movieId = Number(elements.movieId.value);
    const action = elements.action.value;
    // Records whether the requested operation succeeds.
    let success = false;
    if (action === "delete") {
        success = movieList.deleteMovie(movieId);
    } else {
        // Creates the movie from the completed input fields.
        const movie = new Movie(movieId, elements.title.value.trim(), Number(elements.year.value), Number(elements.rating.value));
        if (movie.title === "") {
            elements.formMessage.textContent = "Enter a movie title.";
            return;
        }
        if (action === "add") {
            success = movieList.addMovie(movie);
        } else {
            success = movieList.updateMovie(movie);
        }
    }
    if (!success) {
        elements.formMessage.textContent = "Check the Movie ID. Add needs a new ID; Update and Delete need an existing ID.";
        return;
    }
    refreshMovies();
    elements.pageMessage.textContent = "Movie list updated.";
    closeMaintenance();
}

// Searches for the entered ID and displays the movie or a no-results message.
function searchById(event) {
    event.preventDefault();
    // Stores the movie matching the entered ID.
    const movie = movieList.searchById(Number(elements.searchId.value));
    if (movie === null) {
        elements.idResult.textContent = "0 results";
    } else {
        elements.idResult.textContent = movie.movieId + ": " + movie.title +
            " (" + movie.year + "), rating " + movie.rating + "/10";
    }
}

// Displays movies containing the entered title text.
function searchByTitle(event) {
    event.preventDefault();
    displayMovies(movieList.searchByTitle(elements.searchTitle.value.trim()));
}

// Shows all current movies and clears the previous search results.
function refreshMovies() {
    elements.searchTitle.value = "";
    elements.searchId.value = "";
    elements.idResult.textContent = "Enter a Movie ID to see its details.";
    displayMovies(movieList.movies);
    // Clears the selected sort indicator after a refresh or maintenance change.
    for (const button of document.querySelectorAll("[data-sort]")) {
        button.setAttribute("aria-pressed", "false");
    }
}

// Sorts the array according to the clicked button, then displays all movies.
function sortMovies(event) {
    // Reads the chosen sort order.
    const order = event.currentTarget.dataset.sort;
    if (order === "title-ascending") {
        movieList.movies.sort(compareTitlesAscending);
    } else if (order === "title-descending") {
        movieList.movies.sort(compareTitlesDescending);
    } else {
        movieList.movies.sort(compareRatings);
    }
    refreshMovies();
    event.currentTarget.setAttribute("aria-pressed", "true");
}

// Connects the maintenance buttons to the function that opens the form.
for (const button of document.querySelectorAll("[data-open-action]")) {
    button.addEventListener("click", openMaintenance);
}
// Connects each sorting button to the sorting function.
for (const button of document.querySelectorAll("[data-sort]")) {
    button.addEventListener("click", sortMovies);
}
elements.form.addEventListener("submit", saveMovie);
elements.action.addEventListener("change", setMaintenanceMode);
document.getElementById("close-dialog-button").addEventListener("click", closeMaintenance);
document.getElementById("cancel-dialog-button").addEventListener("click", closeMaintenance);
document.getElementById("id-search-form").addEventListener("submit", searchById);
document.getElementById("title-search-form").addEventListener("submit", searchByTitle);
document.getElementById("refresh-button").addEventListener("click", refreshMovies);

// Displays the starting movie list.
displayMovies(movieList.movies);