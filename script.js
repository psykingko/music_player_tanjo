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

// Fetch songs from JSON
fetch("songs.json")
  .then((response) => response.json())
  .then((data) => {
    songs = data;
    showSongs();
  })
  .catch((error) => console.error("Error loading songs:", error));

function showSongs(genre = "all") {
  songsList.innerHTML = "";
  const filteredSongs =
    genre === "all" ? songs : songs.filter((song) => song.genre === genre);
  filteredSongs.forEach((song, index) => {
    const button = document.createElement("button");
    button.textContent = `${song.name} - ${song.artist}`;
    button.addEventListener("click", () => selectSong(index));
    songsList.appendChild(button);
  });
}

function selectSong(index) {
  currentSongIndex = index;
  const song = songs[index];
  songImage.src = song.img;
  songName.textContent = song.name;
  artistName.textContent = song.artist;
  audioPlayer.src = song.source;
  audioPlayer.play();
}

document.getElementById("next").addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  selectSong(currentSongIndex);
});

document.getElementById("prev").addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  selectSong(currentSongIndex);
});

document.getElementById("create-playlist").addEventListener("click", () => {
  const playlistName = document
    .getElementById("new-playlist-name")
    .value.trim();
  if (playlistName && !playlists.find((pl) => pl.name === playlistName)) {
    playlists.push({ name: playlistName, songs: [] });
    renderPlaylists();
  }
});

function renderPlaylists() {
  playlistsDiv.innerHTML = "";
  playlists.forEach((playlist, index) => {
    const div = document.createElement("div");
    div.textContent = playlist.name;
    div.addEventListener("click", () => showPlaylistSongs(index));
    playlistsDiv.appendChild(div);
  });
}

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
    // If playlist doesn't exist
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

toggleBtn.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

// Initialize
genreFilter.addEventListener("change", (e) => showSongs(e.target.value));
