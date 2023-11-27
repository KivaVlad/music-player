const player = document.querySelector('audio');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const songAuthor = document.querySelector('.audio_author');
const songName = document.querySelector('.audio_name');
const progress = document.querySelector('.player__seek-slider-value');
const currentSongTime = document.querySelector('.player__current-time');
const totalSongTime = document.querySelector('.player__total-time');
let currentSong = 0;

const playlist = [
    {author: 'Linkin Park', name: 'A Place for My Head', full_name: 'Linkin Park - A Place for My Head'},
    {author: 'Linkin Park', name: 'Breaking the Habit', full_name: 'Linkin Park - Breaking the Habit'},
    {author: 'Linkin Park', name: 'Faint', full_name: 'Linkin Park - Faint'},
    {author: 'Linkin Park', name: 'In the End', full_name: 'Linkin Park - In the End'},
    {author: 'Linkin Park', name: 'Numb', full_name: 'Linkin Park - Numb'},
    {author: 'Linkin Park', name: 'One Step Closer', full_name: 'Linkin Park - One Step Closer'},
    {author: 'Linkin Park', name: 'With You', full_name: 'Linkin Park - With You'},
]

// Загружаем выбранную песню
function loadSong(song) {
    songAuthor.innerHTML = song.author;
    songName.innerHTML = song.name;
    player.src = `./audio/${song.full_name}.mp3`;
}

loadSong(playlist[currentSong]);

// Play
function playAudio() {
    player.play();
    playButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
}

// Pause
function pauseAudio() {
    player.pause();
    playButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
}

// Следующая песня
function nextAudio() {
    currentSong++
    if (currentSong === playlist.length) currentSong = 0;
    loadSong(playlist[currentSong]);
    pauseAudio();
    playAudio();
}

// Предыдущая песня
function prevAudio() {
    if (currentSong === 0) currentSong = playlist.length;
    currentSong--
    loadSong(playlist[currentSong]);
    pauseAudio();
    playAudio();
}

// Progress bar
function updateProgress(e) {
    const {duration, currentTime} = e.srcElement;
    const prograssPercent = Math.ceil((currentTime / duration) * 100);

    if (prograssPercent > 0) progress.value = prograssPercent;
    currentSongTime.innerHTML = formattedSeconds(currentTime) || '00:00';
    totalSongTime.innerHTML = formattedSeconds(duration) || '00:00';
}

// Set Progress
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = player.duration;
    player.currentTime = (clickX / width) * duration;
}

// Переводим время 
function formattedSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    return formattedTime;
}


playButton.addEventListener('click', playAudio);
pauseButton.addEventListener('click', pauseAudio);
nextButton.addEventListener('click', nextAudio);
prevButton.addEventListener('click', prevAudio);
player.addEventListener('timeupdate', updateProgress);
player.addEventListener('ended', nextAudio);
progress.addEventListener('click', setProgress);