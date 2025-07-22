document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audio = new Audio();
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const volumeSlider = document.getElementById('volume-slider');
    const playlistEl = document.getElementById('playlist');
    const songTitleEl = document.querySelector('.song-title');
    const artistEl = document.querySelector('.artist');
    const albumArtEl = document.querySelector('.album-art');
    const musicPlayer = document.querySelector('.music-player');

    // Song data
    const songs = [
        {
            title: "Blinding Lights",
            artist: "The Weekend",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            cover: "https://source.unsplash.com/random/300x300/?theweeknd"
        },
        {
            title: "Save Your Tears",
            artist: "The Weekend",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            cover: "https://source.unsplash.com/random/300x300/?pop"
        },
        {
            title: "Stay",
            artist: "The Kid LAROI, Justin Bieber",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            cover: "https://source.unsplash.com/random/300x300/?justinbieber"
        },
        {
            title: "Good 4 U",
            artist: "Olivia Rodrigo",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            cover: "https://source.unsplash.com/random/300x300/?oliviarodrigo"
        },
        {
            title: "Levitating",
            artist: "Dua Lipa",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            cover: "https://source.unsplash.com/random/300x300/?dualipa"
        }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;

    // Initialize the player
    function initPlayer() {
        loadSong(currentSongIndex);
        renderPlaylist();
        
        // Set initial volume
        audio.volume = volumeSlider.value;
    }

    // Load song
    function loadSong(index) {
        const song = songs[index];
        audio.src = song.src;
        songTitleEl.textContent = song.title;
        artistEl.textContent = song.artist;
        albumArtEl.src = song.cover;
        
        // Highlight current song in playlist
        const playlistItems = playlistEl.querySelectorAll('li');
        playlistItems.forEach(item => item.classList.remove('playing'));
        playlistItems[index].classList.add('playing');
    }

    // Play song
    function playSong() {
        isPlaying = true;
        musicPlayer.classList.add('playing');
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audio.play();
    }

    // Pause song
    function pauseSong() {
        isPlaying = false;
        musicPlayer.classList.remove('playing');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        audio.pause();
    }

    // Previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }

    // Next song
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }

    // Update progress bar
    function updateProgress(e) {
        if (isPlaying) {
            const { duration, currentTime } = e.srcElement;
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            // Update time display
            const durationMinutes = Math.floor(duration / 60);
            let durationSeconds = Math.floor(duration % 60);
            if (durationSeconds < 10) {
                durationSeconds = `0${durationSeconds}`;
            }
            
            // Avoid NaN display
            if (durationSeconds) {
                durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
            }
            
            const currentMinutes = Math.floor(currentTime / 60);
            let currentSeconds = Math.floor(currentTime % 60);
            if (currentSeconds < 10) {
                currentSeconds = `0${currentSeconds}`;
            }
            currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
        }
    }

    // Set progress when clicking on progress bar
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // Render playlist
    function renderPlaylist() {
        playlistEl.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = `${song.title} - ${song.artist}`;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });
            playlistEl.appendChild(li);
        });
    }

    // Event listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    audio.addEventListener('loadedmetadata', updateProgress);

    progressContainer.addEventListener('click', setProgress);

    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value;
    });

    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            isPlaying ? pauseSong() : playSong();
        } else if (e.code === 'ArrowRight') {
            audio.currentTime += 5;
        } else if (e.code === 'ArrowLeft') {
            audio.currentTime -= 5;
        } else if (e.code === 'ArrowUp') {
            volumeSlider.value = Math.min(parseFloat(volumeSlider.value) + 0.1, 1);
            audio.volume = volumeSlider.value;
        } else if (e.code === 'ArrowDown') {
            volumeSlider.value = Math.max(parseFloat(volumeSlider.value) - 0.1, 0);
            audio.volume = volumeSlider.value;
        }
    });

    // Initialize the player
    initPlayer();
});
