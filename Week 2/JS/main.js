/*
 * Student: Brandon Scheirer
 * Date: November 2, 2026
 * Assignment: Week 2 - JSON and Bootstrap
 * Purpose: Read singer data from JSON, create table rows, and provide a live search filter.
 */

"use strict";

// Valid JSON text: each entry describes one singer and their details.
// JSON.parse converts that text into an object JavaScript can use.
// Keeping the JSON directly in this file means index.html also works when
// opened locally, where fetching a separate .json file can be blocked.
const singersJson = `{
  "artists": [
    {
      "name": "Adele",
      "genre": "Pop / Soul",
      "songs": ["Hello", "Rolling in the Deep"],
      "hometown": "London, England"
    },
    {
      "name": "Billie Eilish",
      "genre": "Alternative Pop",
      "songs": ["bad guy", "Happier Than Ever"],
      "hometown": "Los Angeles, USA"
    },
    {
      "name": "Bruno Mars",
      "genre": "Pop / R&B",
      "songs": ["24K Magic", "Just the Way You Are"],
      "hometown": "Honolulu, USA"
    },
    {
      "name": "Ed Sheeran",
      "genre": "Pop",
      "songs": ["Perfect", "Shape of You"],
      "hometown": "Framlingham, England"
    },
    {
      "name": "Olivia Rodrigo",
      "genre": "Pop Rock",
      "songs": ["drivers license", "good 4 u"],
      "hometown": "Temecula, USA"
    },
    {
      "name": "The Weeknd",
      "genre": "R&B / Pop",
      "songs": ["Blinding Lights", "Save Your Tears"],
      "hometown": "Toronto, Canada"
    }
  ]
}`;

// Parsed JSON object and artist array used by both the table and search.
const singerData = JSON.parse(singersJson);
const artists = singerData.artists;

// Cache relevant HTML elements after defer has allowed the page to parse.
const tableBody = document.getElementById("artistRows");
const artistSearch = document.getElementById("artistSearch");
const artistCount = document.getElementById("artistCount");
const resultStatus = document.getElementById("resultStatus");

/**
 * renderArtists(visibleArtists)
 * Input: array of singer objects (may be filtered).
 * Output: replaces all tbody rows and updates the count / status message.
 * Creates elements using textContent so JSON data is treated as text, not HTML.
 */
function renderArtists(visibleArtists) {
  tableBody.replaceChildren();

  if (visibleArtists.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 5;
    emptyCell.className = "empty-results text-center";
    emptyCell.textContent = "No matches found. Try a different search.";
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
  } else {
    const fragment = document.createDocumentFragment();

    visibleArtists.forEach((artist, index) => {
      const row = document.createElement("tr");

      const numberCell = document.createElement("td");
      numberCell.className = "number-cell";
      numberCell.textContent = String(index + 1).padStart(2, "0");

      const nameCell = document.createElement("td");
      nameCell.className = "artist-name";
      nameCell.textContent = artist.name;

      const genreCell = document.createElement("td");
      const genrePill = document.createElement("span");
      genrePill.className = "genre-pill";
      genrePill.textContent = artist.genre;
      genreCell.appendChild(genrePill);

      const songsCell = document.createElement("td");
      songsCell.className = "songs-cell";
      // The songs array is from the JSON object's nested song list.
      artist.songs.forEach((song, songIndex) => {
        if (songIndex > 0) {
          const divider = document.createElement("span");
          divider.className = "song-divider";
          divider.textContent = " · ";
          divider.setAttribute("aria-hidden", "true");
          songsCell.appendChild(divider);
        }
        const songText = document.createElement("span");
        songText.textContent = song;
        songsCell.appendChild(songText);
      });

      const hometownCell = document.createElement("td");
      hometownCell.className = "hometown-cell";
      hometownCell.textContent = artist.hometown;

      row.append(numberCell, nameCell, genreCell, songsCell, hometownCell);
      fragment.appendChild(row);
    });

    tableBody.appendChild(fragment);
  }

  // Display feedback for both the full list and filtered results.
  const count = visibleArtists.length;
  artistCount.textContent = `${String(count).padStart(2, "0")} ${count === 1 ? "ARTIST" : "ARTISTS"}`;
  resultStatus.textContent = count === artists.length
    ? `Showing all ${count} featured artists`
    : `Showing ${count} of ${artists.length} artists`;
}

/**
 * filterArtists()
 * Input: the current search field value.
 * Output: redraws only the artists whose details contain the search text.
 */
function filterArtists() {
  const searchTerm = artistSearch.value.trim().toLocaleLowerCase();
  const matchingArtists = artists.filter((artist) => {
    const searchableFields = [artist.name, artist.genre, artist.hometown, ...artist.songs];
    return searchableFields.some((value) => value.toLocaleLowerCase().includes(searchTerm));
  });
  renderArtists(matchingArtists);
}

// Load all entries immediately, then update on each input / clear action.
renderArtists(artists);
artistSearch.addEventListener("input", filterArtists);
artistSearch.addEventListener("search", filterArtists);
