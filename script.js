window.addEventListener("DOMContentLoaded", start);


function start() {
    console.log("Siden er loaded!");


    const dishContainer = document.querySelector(".dish-container");
    const dishTemplate = document.querySelector("template");
    const googleSheetLink = "https://spreadsheets.google.com/feeds/list/17Dd7DvkPaFamNUdUKlrFgnH6POvBJXac7qyiS6zNRw0/od6/public/values?alt=json";
    const popUpDishContainer = document.querySelector(".pop-up-dish-container");
    let json;

    let filter = "all";

    function firstLetterUppercase(text) {
        let textFirstLetter = text.charAt(0).toUpperCase();
        return text = textFirstLetter + text.slice(1);
    }


    async function fetchData() {
        const response = await fetch(googleSheetLink);
        const jsonData = await response.json();
        json = jsonData;
        console.log(json);
        show(jsonData);
        addEventlistenersToButtons();
    }

    function show(json) {
        dishContainer.innerHTML = "";

        json.feed.entry.forEach(dish => {
            if (filter == "all" || filter == dish.gsx$kategori.$t) {
                console.log(dish);
                let templateClone = dishTemplate.cloneNode(true).content;

                templateClone.querySelector(".dish-image").src = `/img/small/${dish.gsx$billede.$t}-sm.jpg`;
                templateClone.querySelector(".dish-name").textContent = `Nr. ${dish.gsx$id.$t} ${dish.gsx$navn.$t}`;
                templateClone.querySelector(".dish-description").textContent = dish.gsx$kort.$t;
                templateClone.querySelector(".dish-price").textContent += `${dish.gsx$pris.$t} kr`;

                templateClone.querySelector(".dish").addEventListener("click", () => showPopUp(dish));

                dishContainer.appendChild(templateClone);
            }
        });
    }

    function showPopUp(dish) {

        popUpDishContainer.querySelector(".pop-up-dish-name").textContent = `Nr. ${dish.gsx$id.$t} ${dish.gsx$navn.$t}`;
        popUpDishContainer.querySelector(".pop-up-dish-category").textContent = firstLetterUppercase(dish.gsx$kategori.$t);
        popUpDishContainer.querySelector(".pop-up-dish-image").src = `/img/large/${dish.gsx$billede.$t}.jpg`;
        popUpDishContainer.querySelector(".pop-up-dish-image").alt = dish.gsx$navn.$t;
        popUpDishContainer.querySelector(".pop-up-dish-description").textContent = dish.gsx$lang.$t;
        popUpDishContainer.querySelector(".pop-up-dish-price").textContent = `Pris: ${dish.gsx$pris.$t}`;
        popUpDishContainer.querySelector(".pop-up-dish-origin").textContent = `Oprindelse: ${dish.gsx$oprindelse.$t}`;

        popUpDishContainer.style.display = "block";
    }

    document.querySelector(".pop-up-close-button").addEventListener("click", () => popUpDishContainer.style.display = "none");
    popUpDishContainer.addEventListener("click", () => popUpClick(event));

    function popUpClick(event) {
        console.log(event.target);
        let clickedElement = event.target;
        if (clickedElement.classList.contains("pop-up-dish-container")) {
            popUpDishContainer.style.display = "none";
        } else {
            event.stopPropagation();
        }
    }

    function addEventlistenersToButtons() {
        document.querySelectorAll(".filter").forEach(button => {
            button.addEventListener("click", filterDishes);
        });
    }

    function filterDishes() {
        filter = this.dataset.kategori;
        document.querySelector(".sub-headline-dish-category").textContent = this.textContent;
        document.querySelectorAll(".filter").forEach((button) => {
            button.classList.remove("active");
        });

        this.classList.add("valgt");

        show(json);
        console.log(filter);
    }

    fetchData();
}
