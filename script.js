console.log("KaiZen Music Player");
console.log("trying to deploy")
let currentSong = new Audio();
let songs;
let currFolder;
let intervalId;
let activeBox;
let index;

// Updating Time in song---------------------------------------------------------------------
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Changing color-------------------------------------------------------------------------
function changeBoxColors(box) {
  function getRandomColor() {
    let val1 = Math.ceil(0 + Math.random() * 255);
    let val2 = Math.ceil(0 + Math.random() * 255);
    let val3 = Math.ceil(0 + Math.random() * 255);
    return `rgb(${val1}, ${val2}, ${val3})`;
  }

  box.style.backgroundColor = getRandomColor();
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`); //link here
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3"))  {
      songs.push(element.href.split(`/${folder}/`)[1]);
      
    }
  }

  let songUl = document.querySelector(".song-list ul");
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML += `<li>
        <img class="invert" src="assests/music.png" alt="music-icon">
    <div class="info">
        <div class="song-text"> ${song.replaceAll("%20", " ")}</div>
    </div>
    <div class="playNow">
        <span class="song-text">Play Now</span>
        <img  class="invert " src="assests/pause-button.png" alt="pause-icon">
    </div>
  </li>`;
  }
  //   Attach an event listener to each song
  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

      if (intervalId && activeBox) {
        clearInterval(intervalId);
        activeBox.style.backgroundColor = "initial";

        activeBox.querySelector(".playNow span").innerHTML = "Play Now";
        let imgPause = activeBox.querySelector(".playNow img");
        imgPause.src = "assests/pause-button.png";

        let imgElement = activeBox.querySelector("img");
        imgElement.src = "assests/music.png";
        imgElement.style.height = "1.5rem";
        imgElement.style.width = "1.5rem";
      }
      activeBox = e;

      intervalId = setInterval(() => {
        index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        let prevSongListItem = document.querySelectorAll(".song-list li")[index];
        // Check if prevSongListItem is defined before accessing its properties
        if (prevSongListItem) {
            let imgPlay = activeBox.querySelector(".playNow img");
            imgPlay.src = "assests/play.png";
            let prevSongTextElement = prevSongListItem.querySelector(".playNow span");
            prevSongTextElement.innerHTML = "playing...";
            let before_img = prevSongListItem.querySelector("img");
            before_img.src = "assests/XiPx.gif";
            before_img.style.height = "2.5rem";
            before_img.style.width = "3rem";
            changeBoxColors(e);
        }
        
        if (currentSong.paused) {
          let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
          let prevSongListItem =
            document.querySelectorAll(".song-list li")[index];

          let imgPlay = activeBox.querySelector(".playNow img");
          imgPlay.src = "assests/pause-button.png";

          let prevSongTextElement =
            prevSongListItem.querySelector(".playNow span");
          prevSongTextElement.innerHTML = "paused";

          let before_img = prevSongListItem.querySelector("img");
          before_img.src = "assests/music.png";
          before_img.style.height = "1.5rem";
          before_img.style.width = "1.5rem";

          prevSongListItem.style.backgroundColor = "green"
        } 
        trying = document.querySelector(".playbar")
        if(trying){
          changeBoxColors(trying)
          if(currentSong.paused){
            trying.style.backgroundColor = "green"
          }
        }
      }, 500);
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  //play the song
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "assests/play.png";
  }
  document.querySelector(".song-info").innerHTML = decodeURI(track);
  document.querySelector(".song-time").innerHTML = "00:00/00:00";
};

// displaying album-----
async function displayAlbum() {
  let a = await fetch(`/songs/`); 
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".card-container");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/") &&!e.href.includes(".htaccess")){
      let folder = e.href.split("/").slice(-1)[0];
      let a = await fetch(`/songs/${folder}/info.json`); //link here
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card rounded ">
      <div class="play"
          style="background-color: #1fdf64; display: inline-flex; justify-content: center; align-items: center; width: 50px; height: 50px; border-radius: 50%;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30"
              fill="black">
              <path
                  d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                  stroke="none" />
          </svg>
      </div>
      <img src="/songs/${folder}/cover.jpg" alt="Cover-img">
      <h3>${response.title}</h3>
      <p>${response.description}</p>
  </div>`;
    }
  }

  // Folder clicking song coming effect------------------------------------------------------------------------
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
      clearInterval(intervalId)
    });
  });
}

async function main() {
  await getSongs("songs/vibes");
  playMusic(songs[0], true);

  // Displaying Album------------------------------------------------------------------------------------
  await displayAlbum();

  //   playing the song ------------------------------------------------------------------
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "assests/play.png";
    } else {
      currentSong.pause();
      play.src = "assests/pause-button.png";
    }
  });

  // previous song playing------------------------------------------------
  previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("Previous clicked");
    index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
    // before----------------------------------------------------------------------------------
    clearInterval(intervalId);
    let prevSongListItem = document.querySelectorAll(".song-list li")[index];
    prevSongListItem.style.backgroundColor = "initial";

    let prevSongTextElement = prevSongListItem.querySelector(".playNow span");
    prevSongTextElement.innerHTML = "Play Now";

    let before_img = prevSongListItem.querySelector(".song-list li img");
    before_img.src = "assests/music.png";
    before_img.style.height = "1.5rem";
    before_img.style.width = "1.5rem";

    let imgPause = prevSongListItem.querySelector(".playNow img");
    imgPause.src = "assests/pause-button.png";

    // After-------------------------------------------------------------------------------------
    let nextSongListItem =
      document.querySelectorAll(".song-list li")[index - 1];

    let nextSongTextElement = nextSongListItem.querySelector(".playNow span");
    nextSongTextElement.innerHTML = "playing...";

    let after_img = nextSongListItem.querySelector(".song-list li img");
    after_img.src = "assests/XiPx.gif";
    after_img.style.height = "2.5rem";
    after_img.style.width = "3rem";

    let imgPlay = nextSongListItem.querySelector(".playNow img");
    imgPlay.src = "assests/play.png";

    trying = document.querySelector(".playbar")
   

    intervalId = setInterval(() => {
      if(trying){
        changeBoxColors(trying)
        if(currentSong.paused){
          trying.style.backgroundColor = "green"
        }
      }
      changeBoxColors(nextSongListItem);
      if (currentSong.paused) {
        currentSong.pause();
        nextSongListItem.querySelector(".song-list span").innerHTML =
          "paused...";
        let imgPlay = nextSongListItem.querySelector(".playNow img");
        imgPlay.src = "assests/pause-button.png";

        let imgElement = nextSongListItem.querySelector(".music-ul img");
        imgElement.src = "assests/music.png";
        imgElement.style.height = "1.5rem";
        imgElement.style.width = "1.5rem";

        nextSongListItem.style.backgroundColor = "green";
      } else {
        nextSongListItem.querySelector(".song-list span").innerHTML =
          "playing...";
        let imgPlay = nextSongListItem.querySelector(".playNow img");
        imgPlay.src = "assests/play.png";

        let imgElement = nextSongListItem.querySelector(".music-ul img");
        imgElement.src = "assests/XiPx.gif";

        imgElement.style.height = "2.5rem";
        imgElement.style.width = "3rem";
        changeBoxColors(nextSongListItem);
      }
      
    }, 500);
    
    activeBox = nextSongListItem;
    
  });

  // next song playing---------------------------------------------------
  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("Next clicked");

    index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }

    clearInterval(intervalId);
    let prevSongListItem = document.querySelectorAll(".song-list li")[index];
    prevSongListItem.style.backgroundColor = "initial";

    let prevSongTextElement = prevSongListItem.querySelector(".playNow span");
    prevSongTextElement.innerHTML = "Play Now";

    let before_img = prevSongListItem.querySelector(".song-list li img");
    before_img.src = "assests/music.png";
    before_img.style.height = "1.5rem";
    before_img.style.width = "1.5rem";

    let imgPause = prevSongListItem.querySelector(".playNow img");
    imgPause.src = "assests/pause-button.png";

    // After-------------------------------------------------------------------------------------
    let nextSongListItem =
      document.querySelectorAll(".song-list li")[index + 1];

    let nextSongTextElement = nextSongListItem.querySelector(".playNow span");
    nextSongTextElement.innerHTML = "playing...";

    let after_img = nextSongListItem.querySelector(".song-list li img");
    after_img.src = "assests/XiPx.gif";
    after_img.style.height = "2.5rem";
    after_img.style.width = "3rem";

    let imgPlay = nextSongListItem.querySelector(".playNow img");
    imgPlay.src = "assests/play.png";

    
    intervalId = setInterval(() => {

      trying = document.querySelector(".playbar")
      if(trying){
        changeBoxColors(trying)
        if(currentSong.paused){
          trying.style.backgroundColor = "green"
        }
      }
      
      changeBoxColors(nextSongListItem);
      if (currentSong.paused) {
        currentSong.pause();
        nextSongListItem.querySelector(".song-list span").innerHTML =
          "paused...";
        let imgPlay = nextSongListItem.querySelector(".playNow img");
        imgPlay.src = "assests/pause-button.png";

        let imgElement = nextSongListItem.querySelector(".music-ul img");
        imgElement.src = "assests/music.png";
        imgElement.style.height = "1.5rem";
        imgElement.style.width = "1.5rem";

        nextSongListItem.style.backgroundColor = "green";
      } else {
        nextSongListItem.querySelector(".song-list span").innerHTML =
          "playing...";
        let imgPlay = nextSongListItem.querySelector(".playNow img");
        imgPlay.src = "assests/play.png";

        let imgElement = nextSongListItem.querySelector(".music-ul img");
        imgElement.src = "assests/XiPx.gif";

        imgElement.style.height = "2.5rem";
        imgElement.style.width = "3rem";
        changeBoxColors(nextSongListItem);
      }
    }, 500);
    activeBox = nextSongListItem;
  });

  // Auto play to another song-----------------------------------------------------------------------------------
  currentSong.addEventListener("ended", () => {
    index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }

    clearInterval(intervalId);

    let prevSongListItem = document.querySelectorAll(".song-list li")[index];
    prevSongListItem.style.backgroundColor = "initial";

    let prevSongTextElement = prevSongListItem.querySelector(".playNow span");
    prevSongTextElement.innerHTML = "Play Now";

    let before_img = prevSongListItem.querySelector(".song-list li img");
    before_img.src = "assests/music.png";
    before_img.style.height = "1.5rem";
    before_img.style.width = "1.5rem";

    let imgPause = prevSongListItem.querySelector(".playNow img");
    imgPause.src = "assests/pause-button.png";

    // After-------------------------------------------------------------------------------------
    let nextSongListItem =
      document.querySelectorAll(".song-list li")[index + 1];

    let nextSongTextElement = nextSongListItem.querySelector(".playNow span");
    nextSongTextElement.innerHTML = "playing...";

    let after_img = nextSongListItem.querySelector(".song-list li img");
    after_img.src = "assests/XiPx.gif";
    after_img.style.height = "2.5rem";
    after_img.style.width = "3rem";

    let imgPlay = nextSongListItem.querySelector(".playNow img");
    imgPlay.src = "assests/play.png";

    intervalId = setInterval(() => {
      changeBoxColors(nextSongListItem);
      if (currentSong.paused) {
        currentSong.pause();
        nextSongListItem.querySelector(".song-list span").innerHTML =
          "paused...";
        let imgPlay = nextSongListItem.querySelector(".playNow img");
        imgPlay.src = "assests/pause-button.png";

        let imgElement = nextSongListItem.querySelector(".music-ul img");
        imgElement.src = "assests/music.png";
        imgElement.style.height = "1.5rem";
        imgElement.style.width = "1.5rem";

        nextSongListItem.style.backgroundColor = "green";
      } else {
        nextSongListItem.querySelector(".song-list span").innerHTML =
          "playing...";
        let imgPlay = nextSongListItem.querySelector(".playNow img");
        imgPlay.src = "assests/play.png";

        let imgElement = nextSongListItem.querySelector(".music-ul img");
        imgElement.src = "assests/XiPx.gif";

        imgElement.style.height = "2.5rem";
        imgElement.style.width = "3rem";
        changeBoxColors(nextSongListItem);
      }
    }, 500);
  });

  //Time-Update Events-----------------------------------------------------------------------------------------
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Seeker chainging0--------------------------------------------------------------------------------------------
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Hamburgur Effect----------------------------------------------------------------------------------------------
  let hamburger = document.querySelector(".hamburger");
  hamburger.addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".left").style.transition = "all 0.9s  ";
  });

  // hambuger closing effect----------------------------------------------------------------------------------
  let close = document.querySelector(".close");
  close.addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".left").style.transition = "all 2s ease-in-out";
  });
  let home = document.querySelector("#home");
  home.addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".left").style.transition = "all 2s ease-in-out";
  });
}

main();
