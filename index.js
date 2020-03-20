(function() {
  const BASE_URL = "https://movie-list.alphacamp.io";
  const INDEX_URL = BASE_URL + "/api/v1/movies/";
  const POSTER_URL = BASE_URL + "/posters/";
  const data = [];
  const dataPanel = document.getElementById("data-panel");
  const pagination = document.getElementById("pagination");
  const ITEM_PER_PAGE = 12;
  let paginationData = [];
  let listType = "card";
  let pageData = [];
  const genresNavbar = document.getElementById("genres-Navbar");
  const genres = {
    "1": "Action",
    "2": "Adventure",
    "3": "Animation",
    "4": "Comedy",
    "5": "Crime",
    "6": "Documentary",
    "7": "Drama",
    "8": "Family",
    "9": "Fantasy",
    "10": "History",
    "11": "Horror",
    "12": "Music",
    "13": "Mystery",
    "14": "Romance",
    "15": "Science Fiction",
    "16": "TV Movie",
    "17": "Thriller",
    "18": "War",
    "19": "Western"
  };

  initial()

  // listen to data panel
  dataPanel.addEventListener("click", event => {
    if (event.target.matches(".btn-show-movie")) {
      showMovie(event.target.dataset.id);
    } else if (event.target.matches(".btn-add-favorite")) {
      console.log(event.target.dataset.id);
      addFavoriteItem(event.target.dataset.id);
    }
  });

  // listen to pagination click event
  pagination.addEventListener("click", event => {
    // console.log(event.target.dataset.page);
    if (event.target.tagName === "A") {    
      getPageData(event.target.dataset.page);
    }
  });

  // Listen to Navbar event
  genresNavbar.addEventListener("click", event => {
    if (event.target.matches(".nav-link")) {
      let index = Number(event.target.id)
      let results = data.filter(movie =>
        movie.genres.includes(index)
      );
      getTotalPages(results);
      getPageData(1, results);
    }
  })  

  function initial() {
    axios
      .get(INDEX_URL)
      .then(response => {
        data.push(...response.data.results);
        getTotalPages(data);
        // displayDataList(data)
        getPageData(1, data);
      })
      .catch(err => console.log(err));
    showGenresNavbar(genres);
  }

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1;
    let pageItemContent = "";
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `;
    }
    pagination.innerHTML = pageItemContent;
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData;
    let offset = (pageNum - 1) * ITEM_PER_PAGE;
    pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE);
    displayDataList(pageData, listType);
  }

  function displayDataList(pageData, isCard) {
    // console.log(pageData)
    let htmlContent = ''
    htmlContent = (pageData.length === 0) ? showNoFound() : showCard(pageData)
    dataPanel.innerHTML = htmlContent
  }

  function showCard(data) {
    let htmlContent = "";
    data.forEach(item => {
      let genresHTML = findGenres(item)
      // console.log(genresHTML)
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
              ${genresHTML}
            </div>
          </div>
        </div>
      `;
    });
    return htmlContent
  }

  function showNoFound() {
    let htmlContent = `
      <div>
        <h5>Movie not found</h5>
      </div>
      `;
    return htmlContent
  }

  function findGenres(index) {
    let genresArray = index.genres
    let htmlContent = ""
    genresArray.forEach(item => {
      let genre = genres[item]  
      htmlContent += `<span class="badge badge-light"><small>${genre}</small></span>`
    })
    return htmlContent
  }
  
  function showGenresNavbar(object) {
    // console.log(object)
    let htmlContent = "";
    for (let key in object) {
    htmlContent += `
    <a class="nav-link border pl-3" id="${key}" href="#">${object[key]}</a>
    `;
    }
    genresNavbar.innerHTML = htmlContent;
  }
})();