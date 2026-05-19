document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("formSearch");
    const searchButton = document.querySelector(".search-btn");
    const formCards = Array.from(document.querySelectorAll(".form-card"));
    const noResults = document.querySelector(".no-results");

    if (!searchInput || !searchButton || formCards.length === 0) return;

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "forms-clear-btn";
    clearButton.textContent = "×";
    searchInput.parentElement.appendChild(clearButton);

    function resetSearch() {
        formCards.forEach(card => {
            card.classList.remove("hidden", "search-match");
        });

        if (noResults) {
            noResults.style.display = "none";
        }
    }

    function runSearch() {
        const query = searchInput.value.trim().toLowerCase();

        resetSearch();

        if (!query) {
            clearButton.style.display = "none";
            return;
        }

        clearButton.style.display = "flex";

        const matchedCards = [];

        formCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const keywords = card.dataset.keywords?.toLowerCase() || "";

            if (text.includes(query) || keywords.includes(query)) {
                card.classList.add("search-match");
                matchedCards.push(card);
            } else {
                card.classList.add("hidden");
            }
        });

        if (matchedCards.length === 0) {
            if (noResults) {
                noResults.style.display = "block";
                noResults.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        matchedCards[0].scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    searchButton.addEventListener("click", runSearch);

    searchInput.addEventListener("input", () => {
        clearButton.style.display = searchInput.value.trim() ? "flex" : "none";
    });

    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            runSearch();
        }
    });

    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        clearButton.style.display = "none";
        resetSearch();
    });

    document.querySelectorAll(".download-btn").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
        });
    });
});