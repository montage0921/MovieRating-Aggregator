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
});
