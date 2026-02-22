let songs=[
    {
        name:"Ekadantaya Vakratundaya",
        Artist: "Shankar Mahadevan",
        file:"media/Ekadantaya Vakratundaya - PagalWorld.mp3",
        img:"media/HD-wallpaper-white-ganpati-statue-in-blur-background-ganesh-thumbnail.jpg"
    },

    {
        name:"Toogire Rayara",
        Artist: "Dr Vidyabhushan",
        file:"media/Sri_Vidyabhushana_-_Toogire_rayara_(mp3.pm).mp3",
        img:"media/fa38cdd6241eed3d05463c9d89ca8f34.jpg"
    },

    {
        name:"Bhuvanam Gaganam",
        Artist: "Puneeth Rajkumar",
        file:"media/2917.mp3",
        img:"media/vamshi.jpg"
    },

    {
        name:"Dasanagu Visheshanagu",
        Artist: "Kanaka Dasaru",
        file:"media/Anantha_Kulkarni_-_Dasanagu_Visheshanagu_(mp3.pm).mp3",
        img:"media/dasanagu.jpg"
    },

    {
        name:"Shararat",
        Artist: "Ranveer Singh, Ayesh khan",
        file:"media/Shararat Dhurandhar 128 Kbps.mp3",
        img:"media/Shararat-From-Dhurandhar-Hindi-2025-20251215084216-500x500.jpg"
    }

]



let rangeBar=document.querySelector("#range2");
let music=document.querySelector("#song");
let ppBtn=document.querySelector("#pause-play");
let backward=document.querySelector("#fast-backward")
let forward=document.querySelector('#fast-forward')
let songTitle = document.querySelector(".songname h1");
let songArtist = document.querySelector(".songname h4");
let thumbnail = document.querySelector("#img-thumb");
let likeBtn=document.querySelector("#like");
let favMenuBtn=document.querySelector("#left");
let menuBtn=document.querySelector("#menu")
let playlist=document.querySelector("#playlist")
let songlist=document.querySelector("#song-list")
let favPlaylist=document.querySelector("#fav-playlist")
let favSonglist=document.querySelector("#fav-song-list")
let currentTimeEl = document.querySelector("#current-time");
let totalTimeEl = document.querySelector("#total-time");
let shuffleBtn = document.querySelector("#shuffle");
let searchInput = document.querySelector("#search-song");
// let thumbnail = document.querySelector("#img-thumb");

let isShuffle = false;
shuffleBtn.addEventListener("click", () => {

    isShuffle = !isShuffle;

    shuffleBtn.classList.toggle("active");

});

function getRandomSongIndex(){

    let randomIndex;

    do{
        randomIndex = Math.floor(Math.random() * songs.length);
    }
    while(randomIndex === currentSongIndex); // avoid same song

    return randomIndex;
}
let currentSongIndex=0;

music.onloadedmetadata=function(){
    rangeBar.max=music.duration;
    rangeBar.value=music.currentTime;
    totalTimeEl.textContent=formatTime(music.duration);
}

function formatTime(time){

    if (isNaN(time)) return "00:00";

    const mins = Math.floor(time / 60).toString().padStart(2,"0");
    const secs = Math.floor(time % 60).toString().padStart(2,"0");

    return `${mins}:${secs}`;
}

function playPause(){
    if(ppBtn.classList.contains("bi-play-fill")){
        music.play();
        ppBtn.classList.remove("bi-play-fill")
        ppBtn.classList.add("bi-pause-fill")
        thumbnail.classList.remove("paused")
        thumbnail.classList.add("playing");
    }
    else{
        music.pause();
        ppBtn.classList.remove("bi-pause-fill")
        ppBtn.classList.add("bi-play-fill")
        thumbnail.classList.remove("playing");
        thumbnail.classList.add("paused")
    }
}

ppBtn.addEventListener('click',()=>{
    playPause();
})

// if(music.play()){
//     setInterval(()=>{
//         rangeBar.value=music.currentTime;
//     },500)
// }

music.addEventListener("timeupdate", function () {
    rangeBar.value = music.currentTime;
    currentTimeEl.textContent=formatTime(music.currentTime);
    saveLastSong();
});

rangeBar.onchange=function(){
    music.currentTime=rangeBar.value;
    music.play();
    ppBtn.classList.add("bi-pause-fill")
    ppBtn.classList.remove("bi-play-fill")
}

// backward.addEventListener('click',()=>{
//     music.currentTime-=10;
//     if(music.currentTime<0){
//         music.currentTime=0;
//     }
// })

// forward.addEventListener('click',()=>{
//     music.currentTime+=10;
//     if(music.currentTime>music.duration){
//         music.currentTime=music.duration;
//     }
// })

let favourites=JSON.parse(localStorage.getItem("favourites")) || [];
let lastSongData=JSON.parse(localStorage.getItem("lastSong")) || {};
let isrestoring=true;

function loadSong(index, resetTime=true){
    // music.src=songs[index].file;

    music.src = songs[index].file;

    // reset only for manual change
    if(resetTime){
        music.currentTime = 0;
    }

    songTitle.textContent = songs[index].name;
    songArtist.textContent = songs[index].Artist;
    thumbnail.src = songs[index].img;

    updateLikeIcon();

    // let isFav=favourites.find(
    //     fav=>fav.file === songs[index].file
    // );

    // likeBtn.style.color=isFav?"red":"rgb(201,81,99)";
}

function restoreLastSong(){
    let saved=JSON.parse(localStorage.getItem("lastSong"))

    if(saved){
        currentSongIndex=saved.index || 0;
        loadSong(currentSongIndex, false);
        music.addEventListener("loadedmetadata", () => {
            music.currentTime=saved.currentTime || 0;
            if(saved.isPlaying){
                music.play();
                ppBtn.classList.remove("bi-play-fill");
                ppBtn.classList.add("bi-pause-fill");
            }
        }, { once:true });

    } else {
        loadSong(currentSongIndex);
    }
}

// loadSong(currentSongIndex);
restoreLastSong();



function updateLikeIcon() {

    let isFav = favourites.find(
        fav => fav.file === songs[currentSongIndex].file
    );

    likeBtn.style.color = isFav ? "red" : "rgb(201,81,99)";
}

function saveLastSong(){
    let data={
        index: currentSongIndex,
        currentTime: music.currentTime,
        isPlaying: !music.paused
    };

    localStorage.setItem("lastSong",JSON.stringify(data));
}


forward.addEventListener("click", function () {
    if(isShuffle){
        currentSongIndex = getRandomSongIndex();
    } else {
        currentSongIndex++;
        if(currentSongIndex >= songs.length){
            currentSongIndex = 0;
        }
    }

    loadSong(currentSongIndex);
    music.play();
    thumbnail.classList.remove("paused")
    thumbnail.classList.add("playing");
    ppBtn.classList.remove("bi-play-fill");
    ppBtn.classList.add("bi-pause-fill");
});

backward.addEventListener("click", function () {
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1; // go to last
    }

    loadSong(currentSongIndex);
    music.play();
    thumbnail.classList.remove("paused");
    thumbnail.classList.add("playing");
    ppBtn.classList.remove("bi-play-fill");
    ppBtn.classList.add("bi-pause-fill");
});

music.addEventListener("ended", function () {
    forward.click();
    // thumbnail.classList.remove("playing");
});


menuBtn.addEventListener('click',()=>{
    favPlaylist.classList.remove("active");
    playlist.classList.toggle("active")
})


function displaySongs(filteredSongs = songs){

    songlist.innerHTML = "";

    // ⭐ If nothing found
    if(filteredSongs.length === 0){
        let li = document.createElement("li");
        li.textContent = "Song not available";
        li.style.textAlign = "center";
        li.style.background = "#fff0f5";
        songlist.appendChild(li);
        return;
    }

    filteredSongs.forEach((song)=>{

        let index = songs.findIndex(s => s.file === song.file);

        let li=document.createElement("li");

        let span=document.createElement("span");
        span.textContent=song.name;

        span.addEventListener("click", function(){

            currentSongIndex=index;
            loadSong(currentSongIndex);
            music.play();

            thumbnail.classList.remove("paused");
            thumbnail.classList.add("playing");

            ppBtn.classList.replace("bi-play-fill","bi-pause-fill");

            playlist.classList.remove("active");
        });

        let downloadBtn=document.createElement("i");
        downloadBtn.className="bi bi-download";
        downloadBtn.style.float="right";

        downloadBtn.addEventListener("click",(e)=>{
            e.stopPropagation();
            downloadSong(song);
        });

        li.appendChild(span);
        li.appendChild(downloadBtn);

        songlist.appendChild(li);
    });
}

searchInput.addEventListener("input", function(){

    let searchValue = searchInput.value.toLowerCase();

    let filtered = songs.filter(song =>
        song.name.toLowerCase().includes(searchValue) ||
        song.Artist.toLowerCase().includes(searchValue)
    );

    displaySongs(filtered);
});
displaySongs();

function downloadSong(song){
    let a=document.createElement("a");
    a.href=song.file;
    a.download=song.name;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

likeBtn.addEventListener("click",()=>{

    let song=songs[currentSongIndex]

    let exists=favourites.find(fav=>fav.file===song.file);

    if(exists){
        favourites=favourites.filter(fav=>fav.file!==song.file);
        // likeBtn.style.color="rgb(201,81,99)"
    }else{
        favourites.push(song);
        // likeBtn.style.color="red";
    }
    localStorage.setItem("favourites",JSON.stringify(favourites));
    // loadSong(currentSongIndex);

    updateLikeIcon();
})


function displayFavourites(){
    favSonglist.innerHTML=""
    if(favourites.length===0){
        let li=document.createElement("li")
        li.textContent="No Favourite songs yet";
        favSonglist.appendChild(li);
        return;
    }

    favourites.forEach((song)=>{
        let li=document.createElement("li");
        li.textContent=song.name;

        li.addEventListener("click",()=>{
            currentSongIndex=songs.findIndex(
                s=>s.file===song.file
            )
            
        loadSong(currentSongIndex);
        music.play();

        favPlaylist.classList.remove("active");
        })
        favSonglist.appendChild(li);
    })
}

favMenuBtn.addEventListener("click", ()=>{

    playlist.classList.remove("active"); // close song list
    favPlaylist.classList.toggle("active");

    if(favPlaylist.classList.contains("active")){
        displayFavourites();
    }
});
