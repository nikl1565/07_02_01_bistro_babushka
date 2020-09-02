window.addEventListener("DOMContentLoaded", start);


function start() {
    console.log("Siden er loaded!");

    const dishTemplate = document.querySelector("template");

    const dishCategories = [
        "all",
        "forretter",
        "hovedretter",
        "desserter",
        "sideorders",
        "drikkevarer"
    ];


    const googleSheetLink = "https://spreadsheets.google.com/feeds/list/17Dd7DvkPaFamNUdUKlrFgnH6POvBJXac7qyiS6zNRw0/od6/public/values?alt=json";

    const popUpDishContainer = document.querySelector(".pop-up-dish-container");

    let json;

    let filter = "all";

    async function fetchData() {
        const response = await fetch(googleSheetLink);
        const jsonData = await response.json();
        json = jsonData;
        console.log(json);
        show(jsonData);
        addEventlistenersToButtons();
    }

    function show(json) {

        dishCategories.forEach(dishCategory => {

            json.feed.entry.forEach(dish => {

                if (dishCategory == dish.gsx$kategori.$t || dishCategory == "all") {

                    let templateClone = dishTemplate.cloneNode(true).content;
                    let dishCategoryContainer = document.querySelector(`.dish-${dishCategory}`);
                    //                    console.log(dishCategoryContainer);
                    //                    console.log(dish.gsx$kategori);

                    templateClone.querySelector(".dish-image").src = `/img/large/${dish.gsx$billede.$t}.jpg`;
                    templateClone.querySelector(".dish-name").textContent = `Nr. ${dish.gsx$id.$t} ${dish.gsx$navn.$t}`;
                    templateClone.querySelector(".dish-description").textContent = dish.gsx$kort.$t;
                    templateClone.querySelector(".dish-price").textContent += `${dish.gsx$pris.$t} kr`;

                    templateClone.querySelector(".dish").addEventListener("click", () => showPopUp(dish));


                    dishCategoryContainer.appendChild(templateClone);
                }
            });

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
            console.log("button");
            button.addEventListener("click", showDishCategory);
        });
    }

    function showDishCategory() {
        console.log("click!");

        filter = this.dataset.kategori;
        console.log(filter);

        let dishInner = document.querySelector(".dish-inner");
        let dishSlideAmount = 0;

        if (filter == "all") {
            dishSlideAmount = 0;
        } else if (filter == "forretter") {
            dishSlideAmount = 100;
        } else if (filter == "hovedretter") {
            dishSlideAmount = 200;
        } else if (filter == "desserter") {
            dishSlideAmount = 300;
        } else if (filter == "sideorders") {
            dishSlideAmount = 400;
        } else {
            dishSlideAmount = 500;
        }

        dishInner.style.transform = `translateX(-${dishSlideAmount}vw)`;
        console.log(dishSlideAmount);
    }




    //
    //    function filterDishes() {
    //        filter = this.dataset.kategori;
    //        document.querySelector(".sub-headline-dish-category").textContent = this.textContent;
    //        document.querySelectorAll(".filter").forEach((button) => {
    //            button.classList.remove("active");
    //        });
    //
    //        this.classList.add("valgt");
    //
    //        show(json);
    //        console.log(filter);
    //    }

    function firstLetterUppercase(text) {
        let textFirstLetter = text.charAt(0).toUpperCase();
        return text = textFirstLetter + text.slice(1);
    }

    fetchData();
}
