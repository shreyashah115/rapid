const theForm = document.querySelector(`[name="search"]`);

let movies = [];
theForm.addEventListener(`submit`, (event) => {
  event.preventDefault(); // Stop the form from leaving the page
  let query = event.target.elements[`query`].value;
  fetch(`https://imdb8.p.rapidapi.com/auto-complete?q=${query}`, {
    method: "GET",
    headers: {
      "x-rapidapi-key": "307b52db22msh61653aee9f42227p1a7986jsnd58b519186fa",
      "x-rapidapi-host": "imdb8.p.rapidapi.com",
    },
  })
    .then((response) => {
      response.json().then((response) => {
        let data = response.d;
        console.log(data);
        let section = document.querySelector(`.allmovies`);
        // check if data exists, else ask user to input again
        if (!data) {
          let query = document.querySelector(`#query`);
          query.value = ``;
          section.innerHTML += `<h1>Sorry, no data found. Please try again.</h1>`;
          return;
        }
        data.forEach((element) => {
          let images = element.i || ``;
          let image =
            images.imageUrl ||
            `https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png`;
          let name = element.l;
          let actors = element.s || ``;
          movies.push({ actors: actors, name: name, image: image });
        });
        section.innerHTML = ``;

        section.style.display = `grid`;
        section.style.gridTemplateColumns = `1fr 1fr 1fr`;

        // Populate the layout using the data obtained from the API response
        movies.forEach((element) => {
          const article = document.createElement(`article`);
          article.classList.add(`movie`);
          article.innerHTML = `
          <div class="image-container">
          <img src="${element.image}" alt="${element.name}-movie-image">
          </div>
    
        <h3>${element.name}</h3>
        <p>${element.actors}</p>`;
          section.appendChild(article);
        });
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

// changes the layout as per the size of the screen
const changeStyle = () => {
  let section = document.querySelector(`.allmovies`);
  if (window.matchMedia("(max-width: 40em)").matches) {
    section.style.display = `block`;
  } else if (window.matchMedia("(max-width: 62em)").matches) {
    section.style.display = `grid`;
    section.style.gridTemplateColumns = `1fr 1fr`;
  } else {
    section.style.display = `grid`;
    section.style.gridTemplateColumns = `1fr 1fr 1fr`;
  }
};

window.addEventListener("resize", changeStyle);
