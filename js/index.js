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
const volumeControl = document.querySelector('.volume_control_container');
const volumeProgress = document.querySelector('.volume_input');
const volumeValue = document.querySelector('.volume_value');

let isRandom = false;
let isRepeat = false;
let currentSongIndex = 0;

const playlist = [
    {author: 'Linkin Park', name: 'A Place for My Head', full_name: 'Linkin Park - A Place for My Head'},
    {author: 'Linkin Park', name: 'Breaking the Habit', full_name: 'Linkin Park - Breaking the Habit'},
    {author: 'Linkin Park', name: 'Faint', full_name: 'Linkin Park - Faint'},
    {author: 'Linkin Park', name: 'In the End', full_name: 'Linkin Park - In the End'},
    {author: 'Linkin Park', name: 'Lost', full_name: 'Linkin Park - Lost'},
    {author: 'Linkin Park', name: 'Numb', full_name: 'Linkin Park - Numb'},
    {author: 'Linkin Park', name: 'One Step Closer', full_name: 'Linkin Park - One Step Closer'},
    {author: 'Linkin Park', name: 'Papercut', full_name: 'Linkin Park - Papercut'},
    {author: 'Linkin Park', name: 'With You', full_name: 'Linkin Park - With You'},
    {author: 'Linkin Park', name: 'X-Ecutioner Style', full_name: 'Linkin Park - X-Ecutioner Style'},
]

// Загружаем выбранную песню
function loadSong(song) {
    songAuthor.innerHTML = song.author;
    songName.innerHTML = song.name;
    player.src = `./audio/${song.full_name}.mp3`;
}

loadSong(playlist[currentSongIndex]);

// Play
function playAudio() {
    player.play();
    playButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
}

// Pause
function pauseAudio() {
    player.pause();
    playButton.classList.remove('hidden')
    pauseButton.classList.add('hidden');
}

// Следующая песня
function nextAudio() {
    if (isRepeat === true) {
        currentSongIndex = currentSongIndex;  
    } else {
        if (isRandom === true) {
            currentSongIndex = Math.ceil(Math.random() * playlist.length);
        } else {
            currentSongIndex++
        }
    }
    
    if (currentSongIndex === playlist.length) {
        currentSongIndex = 0;
    }

    loadSong(playlist[currentSongIndex]);
    pauseAudio();
    playAudio();
}

// Предыдущая песня
function prevAudio() {
    if (currentSongIndex === 0) { 
        currentSongIndex = playlist.length;
    }

    if (isRepeat === true) {
        currentSongIndex = currentSongIndex;  
    } else {
        if (isRandom === true) {
            currentSongIndex = Math.ceil(Math.random() * playlist.length);
        } else {
            currentSongIndex--
        }
    }

    loadSong(playlist[currentSongIndex]);
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
                    <img src="./assets/icons/white-play.png" data-id="${i}" id="play-icon" alt="" />
                    <img src="./assets/icons/write-pause.png" id="pause-icon" alt="" />
                </div>
            </div>
        `
    }
    
    const playIcons = document.querySelectorAll('#play-icon');
    const pauseIcons = document.querySelectorAll('#pause-icon');

    // При клике на play получаем id выбранного элемента
    playIcons.forEach((icon) => icon.addEventListener('click', (e) => {
        playIcons.forEach((icon) => icon.classList.remove('hidden'));
        icon.classList.add('hidden');
        pauseIcons.forEach((icon) => icon.classList.remove('hidden'));

        const { id } = e.target.dataset;
        currentSongIndex = id;
        loadSong(playlist[currentSongIndex]);
        playAudio();
    }))

    // При клике на pause
    pauseIcons.forEach((icon) => icon.addEventListener('click', () => {
        pauseIcons.forEach((icon) => icon.classList.remove('hidden'));
        icon.classList.add('hidden');
        playIcons.forEach((icon) => icon.classList.remove('hidden'));

        pauseAudio();
    }))
}

initPlaylist();

// Отключить звук
function volumeOff() {
    volumeOnButton.classList.add('hidden');
    volumeOffButton.classList.remove('hidden');

    volumeProgress.value = 0;
    volumeProgress.min = 0;
    player.volume = 0;
    volumeValue.innerHTML = `0%`;
}

// Включить звук
function volumeOn() {
    volumeOnButton.classList.remove('hidden');
    volumeOffButton.classList.add('hidden');
}

// Показать контейнер с регулировкой громкости
function visibleVolume() {
    volumeControl.style.display = 'flex';
}

// Скрыть контейнер с регулировкой громкости
function hiddenVolume() {
    volumeControl.style.display = 'none';
}

// Настройка звука
function setVolume() {
    const value = volumeProgress.value;
    player.volume = value / 100;
    volumeValue.innerHTML = `${value}%`;

    if (+value === 0) {
        volumeOff();
    } else {
        volumeOn();
    }
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
document.querySelector('.volume_icons_container').addEventListener('mouseover', visibleVolume);
document.querySelector('.volume_icons_container').addEventListener('mouseout', hiddenVolume);
volumeProgress.addEventListener('click', setVolume);