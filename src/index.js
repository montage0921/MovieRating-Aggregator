import "./style.css";

const apiKey = `6d8db339`;

const displayContainer = document.querySelector(`.displayContainer`);

const titleInput = document.querySelector(`#title`);
const yearInput = document.querySelector(`#year`);
const inputs = [titleInput, yearInput];
const errorMsg = `this cannot be empty`;

const searchBtn = document.querySelector(`#searchMovie`);

let htmlText;

searchBtn.addEventListener(`click`, function (e) {
  e.preventDefault();

  let title = titleInput.value;
  let year = yearInput.value;

  //form validation
  //Inputs must be filled
  inputs.forEach((input) => {
    if (input.validity.valueMissing)
      input.nextElementSibling.textContent = errorMsg;
    else input.nextElementSibling.textContent = ``;
  });
  if (!title || !year) return;

  //clear input fields
  titleInput.value = ``;
  yearInput.value = ``;

  //support both english and chinese input
  // movie card would be generated based on the language user input
  if (isEnglish(title)) fetchThroughIMDB(title, year);
  else fetchThroughDouban(title, year);
});

function isEnglish(str) {
  return /^[A-Za-z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/.test(str);
}

console.log(isEnglish(`è`));

function fetchThroughIMDB(title, year) {
  fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${title}&y=${year}`)
    .then((res) => res.json())
    .then((res) => {
      const title = res.Title;
      const year = res.Year;
      const director = res.Director;
      const actors = res.Actors.split(`, `).join(`/`);
      const genre = res.Genre.split(`, `).join(`/`);

      const imdbID = res.imdbID;
      const posteURL = res.Poster;

      const imdbRating =
        res.imdbRating !== `N/A` ? `${res.imdbRating}/10` : `N/A`;

      const tomatoRating = res.Ratings[1] ? `${res.Ratings[1].Value}` : `N/A`;

      const mcRating = res.Metascore !== `N/A` ? `${res.Metascore}/100` : `N/A`;

      htmlText = ``;
      htmlText = `
      <div class="movieCard-en">
      <div class="moviePoster">
        <img
          src="${posteURL}"
          alt="Movie Poster Not Available"
        />
      </div>
      <div class="movieInfo">
        <div class="title">
          <a href="https://www.imdb.com/title/${imdbID}/"
            ><h2 id="main-title">${title}</h2></a
          >
        </div>
        <h4>Director: ${director}</h4>
        <h4>Cast: ${actors}</h4>
        <h4>Year: ${year}</h4>
        <h4>Genre: ${genre}</h4>
      </div>

      <div class="movieRating">
       
        <div class="imdb">
          <img src="" alt="" />
          <p>${imdbRating}</p>
        </div>
        <div class="tomato">
          <img src="" alt="" />
          <p>${tomatoRating}</p>
        </div>
        <div class="metacritic">
          <img src="" alt="" />
          <p>${mcRating}</p>
        </div>
      </div>
    </div> 
     
     `;

      displayContainer.innerHTML = ``;
      displayContainer.insertAdjacentHTML(`beforeend`, htmlText);
    })
    .catch((error) => {
      console.log(error);

      htmlText = ``;
      htmlText = `
      <div class="errorBox ">
      <img src="" alt="" />
      <div class="errorMsg">
        <h2 class="errorMsg-toClient">
          Sorry we didn't find your movie...

          <h3 class="errorMsg-computer">Please double check your title and year </h3>
        </h2>
      </div>
    </div>
      `;

      displayContainer.innerHTML = ``;

      displayContainer.insertAdjacentHTML(`beforeend`, htmlText);
    });
}

function fetchThroughDouban(title, year) {
  fetch(`https://api.wmdb.tv/api/v1/movie/search?q=${title}&year=${year}`)
    .then((res) => res.json())
    .then((res) => {
      let doubanId = res[0].doubanId;
      let imdbId = res[0].imdbId;

      const doubanPromise = fetch(
        `https://api.wmdb.tv/movie/api?id=${doubanId}`
      );

      const imdbPromise = fetch(
        `http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}`,
        {
          mode: `cors`,
        }
      );

      return Promise.all([doubanPromise, imdbPromise]);
    })
    .then((res) => Promise.all([res[0].json(), res[1].json()]))
    .then((res) => {
      const douban = res[0];
      const imdb = res[1];

      //Movie Information
      const title = douban.data[0].name;
      const director = douban.director[0].data[0].name;
      const actors = douban.actor
        .slice(0, 4)
        .map((actor) => actor.data[0].name)
        .join(`/`);
      const genre = douban.data[0].genre;

      //Movie Ratings
      const doubanRating = douban.doubanRating;
      const imdbRating = imdb.Ratings[0].Value;
      const metaScore = imdb.Ratings[2].Value;
      const rottenTomato = imdb.Ratings[1].Value;

      //Movie poster
      const poster = imdb.Poster;

      //Movie ID
      const doubanID = douban.doubanId;
      const imdbID = imdb.imdbID;
    });
}
