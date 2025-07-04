let songs = [];
let currentSong = 0;
const baseUrl = "https://cdn.mcalec.dev/audio";
async function loadSongs() {
  try {
    const response = await fetch('https://cdn.mcalec.dev/web/json/wav-songs.json');
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
  const playImg = t.querySelector(".music-icon.play");
  async function o() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songs.length);
    } while (newIndex === currentSong && songs.length > 1);
    currentSong = newIndex;
    e.src = `${baseUrl}${songs[currentSong].src}`;
    e.play();
    t.setAttribute("title", "Pause the current song.");
    t.classList.add("paused");
    if (playImg) playImg.src = "/img/music/pause.png";
    s.style.display = "block";
    n.textContent = songs[currentSong].title;
    n.setAttribute("title", songs[currentSong].title);
  }
  currentSong = Math.floor(Math.random() * songs.length);
  e.src = `${baseUrl}${songs[currentSong].src}`;
  n.setAttribute("title", songs[currentSong].title);
  if (playImg) playImg.src = "/img/music/play.png";
  t.setAttribute("title", "Unpause the current song.");
  t.classList.remove("paused");
  t.addEventListener("click", async function () {
    if (e.paused) {
      await e.play();
      t.classList.add("paused");
      t.setAttribute("title", "Pause the current song.");
      if (playImg) playImg.src = "/img/music/pause.png";
      s.style.display = "block";
      n.textContent = songs[currentSong].title;
      n.setAttribute("title", songs[currentSong].title);
    } else {
      e.pause();
      t.classList.remove("paused");
      t.setAttribute("title", "Unpause the current song.");
      if (playImg) playImg.src = "/img/music/play.png";
    }
  });
  s.addEventListener("click", o);
  e.volume = 0.75;
  e.addEventListener("ended", o);
}
loadSongs();
