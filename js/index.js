const player = document.querySelector('audio');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const songAuthor = document.getElementById('song_author');
const songName = document.getElementById('song_name');
const progress = document.getElementById('progress_bar');
const currentSongTime = document.getElementById('song_time_counter');
const totalSongTime = document.getElementById('song_total-time');
const randomButton = document.getElementById('random');
const randomActiveButton = document.getElementById('random-active');
const repeatButton = document.getElementById('repeat');
const repeatActiveButton = document.getElementById('repeat-active');
const volumeProgress = document.getElementById('player-volume');
const volumeValueContainer = document.querySelector('.player-song__volume_value');
const volumeValue = document.getElementById('volume-value');
const playlistContainer = document.querySelector('.playlist');

let isPlaying = false;
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

const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#0079FF',
    progressColor: '#697C9A',
    hideScrollbar: true,
    barWidth: 3,
    height: 70,
    media: player,
})


function init() {
    // Загружаем выбранную песню
    function loadSong(song) {
        songAuthor.innerHTML = song.author;
        songName.innerHTML = song.name;
        wavesurfer.load(`./audio/${song.full_name}.mp3`);

        if (isPlaying === true) {
            wavesurfer.on('ready', () => wavesurfer.play());
        }
    }

    loadSong(playlist[currentSongIndex]);

    // Отрисовываем плейлист
    for (let i = 0; i < playlist.length; i++) {
        playlistContainer.innerHTML += 
        `
            <div class="playlist-audio__container">
                <div class="playlist-audio__name-wrapper">
                    <div class="player-nav__play-pause__container">
                        <img src="./assets/icons/play.png" alt="play" id="play" data-id="${i}" />
                        <img src="./assets/icons/pause.png" alt="pause" class="hidden" id="pause" />
                    </div>
                    <h4 class="playlist-audio__song_title">${playlist[i].full_name}</h4>
                </div>
            </div>
        `
    }

    
    // Кнопки play & pause
    const playButtons = document.querySelectorAll('#play');
    const pauseButtons = document.querySelectorAll('#pause');


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

        playButtons.forEach((btn) => {
            btn.classList.remove('hidden');
            
            const id = btn.dataset.id;
            if (currentSongIndex === +id) {
                btn.classList.add('hidden');
                pauseButtons.forEach((btn) => btn.classList.remove('hidden'));
            }

            if (btn.dataset?.set) btn.classList.add('hidden');
            
        })

        isPlaying = true;
        player.play();
        loadSong(playlist[currentSongIndex]);
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

        playButtons.forEach((btn) => {
            btn.classList.remove('hidden');

            const id = btn.dataset.id;
            if (currentSongIndex === +id) {
                btn.classList.add('hidden');
                pauseButtons.forEach((btn) => btn.classList.remove('hidden'));
            }

            if (btn.dataset?.set) btn.classList.add('hidden');
        })

        isPlaying = true;
        player.play();
        loadSong(playlist[currentSongIndex]);
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


    // Форматируем время 
    function formattedSeconds(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        return formattedTime;
    }


    // Перемотка при клике в progress bar
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = player.duration;
        player.currentTime = (clickX / width) * duration;
    }


    // Настройка звука
    function setVolume() {
        const value = volumeProgress.value;
        player.volume = value / 100;
        volumeValue.innerHTML = `${value}%`;
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


    // при клике на play
    playButtons.forEach((btn) => btn.addEventListener('click', (e) => {
        const { id } = e.target.dataset;

        if (id) {
            currentSongIndex = +id;
            loadSong(playlist[currentSongIndex]);
        }

        playButtons.forEach((btn) => btn.classList.remove('hidden'));
        btn.classList.add('hidden');
        playButtons.forEach((btn) => {
            if (btn.dataset?.set) btn.classList.add('hidden');

            const id = btn.dataset.id;
            if (currentSongIndex === +id) btn.classList.add('hidden');

        });
        pauseButtons.forEach((btn) => btn.classList.remove('hidden'));

        isPlaying = true;
        player.play();
    }))


    // при клике на pause
    pauseButtons.forEach((btn) => btn.addEventListener('click', () => {
        pauseButtons.forEach((btn) => btn.classList.remove('hidden'));
        btn.classList.add('hidden');
        playButtons.forEach((btn) => btn.classList.remove('hidden'));

        isPlaying = false;
        player.pause();
    }))


    // EventListeners
    prevButton.addEventListener('click', prevAudio);
    nextButton.addEventListener('click', nextAudio);
    player.addEventListener('ended', nextAudio);
    player.addEventListener('timeupdate', updateProgress);
    progress.addEventListener('click', setProgress);
    randomButton.addEventListener('click', randomAudio);
    randomActiveButton.addEventListener('click', cancelRandomAudio);
    repeatButton.addEventListener('click', repeatAudio);
    repeatActiveButton.addEventListener('click', cancelRepeatAudio);
    volumeProgress.addEventListener('click', setVolume);
    volumeProgress.addEventListener('mousemove', () => volumeValueContainer.style.display = 'flex');
    volumeProgress.addEventListener('mouseout', () => volumeValueContainer.style.display = 'none');
    volumeValue.innerHTML = `${volumeProgress.value}%`;
}

init();