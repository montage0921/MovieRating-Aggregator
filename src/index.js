import "./style.css";

const apiKey = `6d8db339`;

const titleInput = document.querySelector(`#title`);
const yearInput = document.querySelector(`#year`);
const inputs = [titleInput, yearInput];
const errorMsg = `this cannot be empty`;

const searchBtn = document.querySelector(`#searchMovie`);

searchBtn.addEventListener(`click`, function (e) {
  e.preventDefault();

  //Inputs must be filled
  inputs.forEach((input) => {
    if (input.validity.valueMissing)
      input.nextElementSibling.textContent = errorMsg;
    else input.nextElementSibling.textContent = ``;
  });

  let title = titleInput.value;
  let year = yearInput.value;

  if (!title || !year) return;

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
});
