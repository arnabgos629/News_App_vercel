const url = "https://newsapi.org/v2/everything?q=";
const API_KEY =  process.env.API_KEY;


window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (data && data.articles) {
            bindData(data.articles);
        } else {
            console.error("No articles found in the response.");
        }
    } catch (error) {
        console.error("Failed to fetch news:", error);
        alert("Error fetching news. Please try again later.");
    }
}


function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});