const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const next = $('.btn-next');
const prev = $('.btn-prev');
const song = $('.song');
const random = $('.btn-random');
const repeat = $('.btn-repeat');
const playList = $('.playlist');

const app = {
    currentIndex: 0,  
    isplaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Khác biệt to lớn',
            song_id: 0,
            singer: 'Trịnh Thanh Bình',
            path: './music/KhacbietQuaLon.mp3',
            img: './img/khacbiettolon.jpg'
        },
        {
          name: 'Không thể say',
          song_id: 1,
          singer: 'Hieuthuhai',
          path: './music/khongtheSay.mp3',
          img: './img/HTH.jpg'
        },
        {
          name: 'Kiss me more',
          song_id: 2,
          singer: 'Doja Cat ft. SZA',
          path: './music/KissmeMore.mp3',
          img: './img/DOJA.jpg'
        },
        {
          name: 'NếU lúc đó',
          song_id: 3,
          singer: 'Tlinh',
          path: './music/Neulucdo.mp3',
          img: './img/Tlinh.jpg'
        },
        {
          name: 'People',
          song_id: 4,
          singer: 'Libianca',
          path: './music/People.mp3',
          img: './img/People.jpg'
        },
        {
          name: 'SODA',
          song_id: 5,
          singer: 'MCK',
          path: './music/Soda.mp3',
          img: './img/MCK.jpg'
        }
      ],
      
    render: function(){
        const htmls = this.songs.map((song, index)=> {
            return `
            <li class="song ${index === this.currentIndex ? 'active' : ''}" id=${song.song_id}>
                <div class="thumb" style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </li>
            `
        })
        playList.innerHTML = htmls.join('');
    },

    handleEvents: 
    function(){
        const cdWidth = cd.offsetWidth;
        const _this = this;

        //Xu ly cd quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();


        // Xu ly phong to thu nho CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdwidth = cdWidth - scrollTop;
            cd.style.width = newCdwidth > 0 ? newCdwidth + 'px' : 0;
            cd.style.opacity = newCdwidth/cdWidth;
        }

        //Xu ly khi click Play
        playBtn.onclick = function(){
            if(_this.isplaying) {
                audio.pause();
            }else {  
                audio.play();
            }
        }
        
        //Khi song duoc Play
        audio.onplay = function(){
            _this.isplaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //Khi song bi Pause
        audio.onpause = function(){
            _this.isplaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi tien do bai hat thay doi
        audio.ontimeupdate =function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        //Xu ly khi tua
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        //khi next song
        next.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
                _this.scrollToActiveSong();
                highlight(_this.currentIndex);
                
            }else{
                _this.nextSong();
                _this.scrollToActiveSong();
                highlight(_this.currentIndex);
            }
            audio.play();
        }
        //khi prev song
        prev.onclick = function(){
            if (_this.isRandom) {
                _this.playRandomSong();
                _this.scrollToActiveSong();
                highlight(_this.currentIndex);
                
            } else {
                _this.prevSong();
                _this.scrollToActiveSong();
                highlight(_this.currentIndex);
            }
            audio.play();
        }

        //Tự động next bài
        audio.onended = function(){
            if (_this.isRepeat) {
                audio.play();
            } else if(_this.isRandom) {
                _this.playRandomSong();
                _this.scrollToActiveSong();
                highlight(_this.currentIndex);
                
            }else{
                _this.nextSong();
                _this.scrollToActiveSong();
                _this.scrollToActiveSong();
                highlight(_this.currentIndex);
            }
            audio.play();
        }

        //random bai hat
        random.onclick = function(){
            _this.isRandom = !_this.isRandom;
            random.classList.toggle("active", _this.isRandom);
        }

        //Phát lại bài hát
        repeat.onclick = function(e){
            _this.isRepeat = !_this.isRepeat;
            repeat.classList.toggle('active', _this.isRepeat);
        }
        

        //highlight bai hat dang phat
        function highlight(x){
            const i = x;
            $('.song.active').classList.remove('active');
            const songList = $$('.song');
            const currentSong = songList[i];
            currentSong.classList.add('active');
        }

        //Pause bằng space
        document.addEventListener("keydown", function(event) {
            if (event.code === "Space" || event.keyCode === 32 || event.key === " ") {
                if(_this.isplaying) {
                    audio.pause();
                }else {  
                    audio.play();
                }
            }
        });

        //lang nghe hanh vi click vao playlist -> phat bai hat
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if( songNode || e.target.closest('.option')){
                if (songNode) {
                    // console.log(songNode.dataset.index); trường hợp k để id mà dùng data-index = ''
                    _this.currentIndex = Number(songNode.getAttribute('id'));
                    _this.loadCurrentSong();
                    highlight(_this.currentIndex);
                    audio.play();
                }
            }
        }
    },

    defineProperties: function(){
        Object.defineProperty(this, 'CurrentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong: function(){
        heading.textContent = this.CurrentSong.name;
        cdThumb.style.backgroundImage = `url('${this.CurrentSong.img}')`;
        audio.src = this.CurrentSong.path;


    },
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        },100)
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex=0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex=this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    
    start: function(){
        this.defineProperties();

        this.loadCurrentSong();

        this.handleEvents();
        
        this.render();
    }
}

app.start();