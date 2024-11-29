let songs = [];
let currentSongIndex = 0;
const playlists = [];

const songsList = document.getElementById("songs-list");
const genreFilter = document.getElementById("genre-filter");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const artistName = document.getElementById("artist-name");
const audioPlayer = document.getElementById("audio-player");
const playlistsDiv = document.getElementById("playlists");
const toggleBtn = document.getElementById("toggle");
const searchBar = document.getElementById("search-bar"); // Added search bar element

// Fetch songs from JSON
fetch("songs.json")
  .then((response) => response.json())
  .then((data) => {
    songs = data;
    showSongs(); // Initially load all songs
  })
  .catch((error) => console.error("Error loading songs:", error));

// Show songs function with search filter support
function showSongs(genre = "all", searchQuery = "") {
  songsList.innerHTML = "";

  // Filter songs based on genre and search query
  const filteredSongs = songs
    .filter((song) => genre === "all" || song.genre === genre) // Filter by genre
    .filter((song) => {
      return (
        song.name.toLowerCase().includes(searchQuery) || // Match by song name
        song.artist.toLowerCase().includes(searchQuery) // Match by artist name
      );
    });

  // Render the filtered songs list
  filteredSongs.forEach((song, index) => {
    const button = document.createElement("button");
    button.textContent = `${song.name} - ${song.artist}`;
    button.addEventListener("click", () => selectSong(index)); // Play song when clicked
    songsList.appendChild(button);
  });
}

// Function to handle selecting a song to play
function selectSong(index) {
  currentSongIndex = index;
  const song = songs[index];
  songImage.src = song.img;
  songName.textContent = song.name;
  artistName.textContent = song.artist;
  audioPlayer.src = song.source;
  audioPlayer.play();
}

// Event listener for the "Next" button
document.getElementById("next").addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  selectSong(currentSongIndex);
});

// Event listener for the "Prev" button
document.getElementById("prev").addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  selectSong(currentSongIndex);
});

// Event listener for creating a new playlist
document.getElementById("create-playlist").addEventListener("click", () => {
  const playlistName = document
    .getElementById("new-playlist-name")
    .value.trim();
  if (playlistName && !playlists.find((pl) => pl.name === playlistName)) {
    playlists.push({ name: playlistName, songs: [] });
    renderPlaylists();
  }
});

// Function to render the playlists
function renderPlaylists() {
  playlistsDiv.innerHTML = "";
  playlists.forEach((playlist, index) => {
    const div = document.createElement("div");
    div.textContent = playlist.name;
    div.addEventListener("click", () => showPlaylistSongs(index));
    playlistsDiv.appendChild(div);
  });
}

// Event listener for adding a song to a playlist
document.getElementById("add-to-playlist").addEventListener("click", () => {
  const playlistName = prompt("Enter playlist name:");

  const playlist = playlists.find((pl) => pl.name === playlistName);

  if (playlist) {
    const currentSong = songs[currentSongIndex];
    if (!playlist.songs.includes(currentSong)) {
      playlist.songs.push(currentSong);
      alert(`${currentSong.name} added to "${playlist.name}"`);
    } else {
      alert(`${currentSong.name} is already in "${playlist.name}"`);
    }
  } else {
    // If playlist doesn't exist, prompt to create one
    const createNew = confirm(
      `Playlist "${playlistName}" doesn't exist. Do you want to create it?`
    );
    if (createNew) {
      const newPlaylist = {
        name: playlistName,
        songs: [songs[currentSongIndex]],
      };
      playlists.push(newPlaylist);
      renderPlaylists();
      alert(
        `Playlist "${playlistName}" created and ${songs[currentSongIndex].name} added to it.`
      );
    }
  }
});

// Function to show songs from a selected playlist
function showPlaylistSongs(index) {
  const playlist = playlists[index];
  songsList.innerHTML = "";
  playlist.songs.forEach((song) => {
    const button = document.createElement("button");
    button.textContent = `${song.name} - ${song.artist}`;
    button.addEventListener("click", () => selectSong(songs.indexOf(song)));
    songsList.appendChild(button);
  });
}

// Event listener for dark mode toggle
toggleBtn.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

// Event listener for genre filter change
genreFilter.addEventListener("change", (e) => {
  const selectedGenre = e.target.value;
  showSongs(selectedGenre, searchBar.value); // Update song list based on genre and search query
});

// Event listener for search bar input
searchBar.addEventListener("input", () => {
  const searchQuery = searchBar.value.toLowerCase(); // Get search query
  showSongs(genreFilter.value, searchQuery); // Filter songs by genre and search query
});

// Initialize the song list with all songs when the page loads
document.addEventListener("DOMContentLoaded", () => {
  showSongs();
});
