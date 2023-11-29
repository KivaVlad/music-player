const player = document.querySelector('audio');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const songAuthor = document.querySelector('.audio_author');
const songName = document.querySelector('.audio_name');
const progress = document.querySelector('.progress__bar');
const currentSongTime = document.querySelector('.player__current-time');
const totalSongTime = document.querySelector('.player__total-time');
const randomButton = document.getElementById('random');
const randomActiveButton = document.getElementById('random-active');
const repeatButton = document.getElementById('repeat');
const repeatActiveButton = document.getElementById('repeat-active');
const playlistContainer = document.querySelector('.list');
const openPlaylistButton = document.getElementById('open-playlist');
const closePlaylistButton = document.getElementById('close-playlist');
const volumeOnButton = document.getElementById('volume-on');
const volumeOffButton = document.getElementById('volume-off');

let isPlaying = false;
let isPaused = true;
let isRandom = false;
let isRepeat = false;
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
    isPlaying = true;
    isPaused = false;
    player.play();
    playButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
}

// Pause
function pauseAudio() {
    isPlaying = false;
    isPaused = true;
    player.pause();
    playButton.classList.remove('hidden')
    pauseButton.classList.add('hidden');
}

// Следующая песня
function nextAudio() {
    if (isRepeat === true) {
        currentSong = currentSong;  
    } else {
        if (isRandom === true) {
            currentSong = Math.ceil(Math.random() * playlist.length);
        } else {
            currentSong++
        }
    }
    
    if (currentSong === playlist.length) {
        currentSong = 0;
    }

    loadSong(playlist[currentSong]);
    pauseAudio();
    playAudio();
}

// Предыдущая песня
function prevAudio() {
    if (currentSong === 0) { 
        currentSong = playlist.length;
    }

    if (isRepeat === true) {
        currentSong = currentSong;  
    } else {
        if (isRandom === true) {
            currentSong = Math.ceil(Math.random() * playlist.length);
        } else {
            currentSong--
        }
    }

    loadSong(playlist[currentSong]);
    pauseAudio();
    playAudio();
}

// Progress bar
function updateProgress(e) {
    const {duration, currentTime} = e.srcElement;
    const prograssPercent = Math.ceil((currentTime / duration) * 100);

    if (prograssPercent > 0) { 
        progress.value = prograssPercent;
    }

    currentTime > 0 ? currentSongTime.innerHTML = formattedSeconds(currentTime) : currentSongTime.innerHTML = '00:00';
    currentTime > 0 ? totalSongTime.innerHTML = formattedSeconds(duration) : totalSongTime.innerHTML = '00:00';
}

// Перемотка при клике в progress bar
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

// Случайное воспроизведение
function randomAudio() {
    isRandom = true;
    isRepeat = false;
    iconsClasses();
}

// Отменить случайное воспроизведение
function cancelRandomAudio() {
    isRandom = false;
    iconsClasses();
}

// Повтор одного трека
function repeatAudio() {
    isRepeat = true;
    isRandom = false;
    iconsClasses()
}

// Отменить повтор трека
function cancelRepeatAudio() {
    isRepeat = false;
    iconsClasses()
}

// Меняем классы иконок
function iconsClasses() {
    if (isRandom === true) {
        randomButton.classList.add('hidden');
        randomActiveButton.classList.remove('hidden');
        repeatButton.classList.remove('hidden');
        repeatActiveButton.classList.add('hidden');
    } else {
        randomButton.classList.remove('hidden');
        randomActiveButton.classList.add('hidden');
    }

    if (isRepeat === true) {
        repeatButton.classList.add('hidden');
        repeatActiveButton.classList.remove('hidden');
        randomButton.classList.remove('hidden');
        randomActiveButton.classList.add('hidden');
    } else {
        repeatButton.classList.remove('hidden');
        repeatActiveButton.classList.add('hidden');
    }
}

// Открыть плейлист
function openPlaylist() {
    const listContainer = document.getElementById('playlist');
    listContainer.classList.remove('playlist');
    listContainer.classList.add('playlist_active');
}

// Закрыть плейлист
function closePlaylist() {
    const listContainer = document.getElementById('playlist');
    listContainer.classList.remove('playlist_active');
    listContainer.classList.add('playlist');
}

// Отрисовываем плейлист
function initPlaylist() {
    for (let i = 0; i < playlist.length; i++) {
        playlistContainer.innerHTML += 
        `
            <div class="playlist_item">
                <h4 class="song_title">${playlist[i].full_name}</h4>
                <div class="playlist_item__icon_wrapper">
                    <img src="./assets/icons/white-play.png" id="play-icon" alt="" />
                    <img src="./assets/icons/write-pause.png" id="pause-icon" alt="" />
                </div>
            </div>
        `
    }
    
    const playlistItems = document.querySelectorAll('.playlist_item');
    const playIcons = document.querySelectorAll('#play-icon');
    const pauseIcons = document.querySelectorAll('#pause-icon');

    // При клике на поле получаем индекс выбранной песни
    playlistItems.forEach((item) => item.addEventListener('click', () => {
        const currentAudioTitle = item.innerText;
        const currentAudioIndex = playlist.findIndex((song) => song.full_name === currentAudioTitle);
        currentSong = currentAudioIndex;
        
        if (isPlaying === true) {
            loadSong(playlist[currentSong]);
            playAudio();
        }

        if (isPaused === true) {
            pauseAudio();
        }
    }))

    // При клике на play
    playIcons.forEach((icon) => icon.addEventListener('click', () => {
        playIcons.forEach((icon) => icon.classList.remove('hidden'));
        icon.classList.add('hidden');
        pauseIcons.forEach((icon) => icon.classList.remove('hidden'));
        isPlaying = true;
        isPaused = false;
    }))

    // При клике на pause
    pauseIcons.forEach((icon) => icon.addEventListener('click', () => {
        pauseIcons.forEach((icon) => icon.classList.remove('hidden'));
        icon.classList.add('hidden');
        playIcons.forEach((icon) => icon.classList.remove('hidden'));
        isPlaying = false;
        isPaused = true;
    }))
}

initPlaylist();

// Отключить звук
function volumeOff() {
    volumeOnButton.classList.add('hidden');
    volumeOffButton.classList.remove('hidden');
}

// Включить звук
function volumeOn() {
    volumeOnButton.classList.remove('hidden');
    volumeOffButton.classList.add('hidden');
}


playButton.addEventListener('click', playAudio);
pauseButton.addEventListener('click', pauseAudio);
nextButton.addEventListener('click', nextAudio);
prevButton.addEventListener('click', prevAudio);
player.addEventListener('timeupdate', updateProgress);
player.addEventListener('ended', nextAudio);
progress.addEventListener('click', setProgress);
randomButton.addEventListener('click', randomAudio);
randomActiveButton.addEventListener('click', cancelRandomAudio);
repeatButton.addEventListener('click', repeatAudio);
repeatActiveButton.addEventListener('click', cancelRepeatAudio);
openPlaylistButton.addEventListener('click', openPlaylist);
closePlaylistButton.addEventListener('click', closePlaylist);
volumeOnButton.addEventListener('click', volumeOff);
volumeOffButton.addEventListener('click', volumeOn);