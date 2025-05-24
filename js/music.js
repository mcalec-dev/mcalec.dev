let songs = [];
let currentSong = 0;
const baseUrl = "https://cdn.mcalec.dev/audio";
async function loadSongs() {
  try {
    const response = await fetch('/json/songs.json');
    songs = await response.json();
    initMusic();
  } catch (error) {
    console.error('Error loading songs:', error);
  }
}
async function initMusic() {
  if (songs.length === 0) return;
  const e = document.getElementById("music-src"),
        t = document.getElementById("music"),
        s = document.getElementById("music-skip"),
        n = document.getElementById("music-info");
    async function o() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songs.length);
    } while (newIndex === currentSong && songs.length > 1);
      currentSong = newIndex;
      e.src = `${baseUrl}${songs[currentSong].src}`;
      e.play();
      t.setAttribute("title", "Unpause the current song.");
      t.classList.add("paused");
      s.style.display = "block";
      n.textContent = songs[currentSong].title;
      n.setAttribute("title", songs[currentSong].title);
    }
    currentSong = Math.floor(Math.random() * songs.length);
    e.src = `${baseUrl}${songs[currentSong].src}`;
    n.setAttribute("title", songs[currentSong].title);
    t.addEventListener("click", async function () {
    if (e.paused) {
      e.play();
      t.classList.add("paused");
      t.setAttribute("title", "Pause the current song.")
      s.style.display = "block";
      n.textContent = songs[currentSong].title;
      n.setAttribute("title", songs[currentSong].title);
    } else {
      e.pause();
      t.classList.remove("paused");
      t.setAttribute("title", "Unpause the current song.");
    }
  });
  s.addEventListener("click", o);
  e.volume = 0.75;
  e.addEventListener("ended", o);
}
loadSongs();
