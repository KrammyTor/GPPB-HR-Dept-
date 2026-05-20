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

    const modal = document.createElement("div");
    modal.className = "download-wait-modal";
    modal.innerHTML = `
        <div class="download-wait-box">
            <div class="download-loader"></div>
            <h3>Please wait for download</h3>
            <p>Your file is being prepared.</p>
        </div>
    `;
    document.body.appendChild(modal);

    const modalStyle = document.createElement("style");
    modalStyle.textContent = `
        .download-wait-modal {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.62);
            backdrop-filter: blur(10px);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.35s ease;
        }

        .download-wait-modal.show {
            display: flex;
            opacity: 1;
        }

        .download-wait-modal.closing {
            opacity: 0;
        }

        .download-wait-box {
            width: min(90%, 380px);
            background: #ffffff;
            border-radius: 24px;
            padding: 38px 28px;
            text-align: center;
            box-shadow: 0 28px 80px rgba(0, 0, 0, 0.28);
            transform: scale(0.96) translateY(8px);
            transition: transform 0.35s ease, opacity 0.35s ease;
        }

        .download-wait-modal.show .download-wait-box {
            transform: scale(1) translateY(0);
        }

        .download-wait-modal.closing .download-wait-box {
            transform: scale(0.96) translateY(12px);
            opacity: 0;
        }

        .download-loader {
            width: 54px;
            height: 54px;
            border: 5px solid #e2e8f0;
            border-top-color: #3498db;
            border-radius: 50%;
            margin: 0 auto 20px;
            animation: downloadSpin 0.8s linear infinite;
        }

        .download-wait-box h3 {
            margin: 0 0 8px;
            color: #1f3664;
            font-size: 22px;
            font-weight: 800;
        }

        .download-wait-box p {
            margin: 0;
            color: #64748b;
            font-size: 15px;
        }

        @keyframes downloadSpin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(modalStyle);

    function showDownloadModal() {
        modal.classList.add("show");
    }

function hideDownloadModal() {
    modal.classList.add("closing");

    setTimeout(() => {
        modal.classList.remove("show", "closing");
    }, 350);
}

    function getFileUrl(button) {
        return (
            button.dataset.file ||
            button.dataset.url ||
            button.getAttribute("href") ||
            ""
        );
    }

    function getFileName(fileUrl) {
        if (!fileUrl) return "download";

        const cleanUrl = fileUrl.split("?")[0].split("#")[0];
        const fileName = cleanUrl.split("/").pop();

        return fileName || "download";
    }

    function getFileType(fileUrl) {
        if (!fileUrl) return "FILE";

        const cleanUrl = fileUrl.split("?")[0].split("#")[0];
        const fileName = cleanUrl.split("/").pop() || "";
        const extension = fileName.includes(".")
            ? fileName.split(".").pop().toLowerCase()
            : "";

        return extension ? extension.toUpperCase() : "FILE";
    }

    function formatFileSize(bytes) {
        if (!bytes || isNaN(bytes)) return "File size unavailable";

        const kb = bytes / 1024;
        const mb = kb / 1024;

        if (mb >= 1) {
            return `${mb.toFixed(2)} MB`;
        }

        return `${Math.round(kb)} KB`;
    }

    async function loadActualFileSizes() {
        const buttons = document.querySelectorAll(".download-btn");

        buttons.forEach(async (button) => {
            const card = button.closest(".form-card");
            const meta = card?.querySelector(".form-meta");

            if (!card || !meta) return;

            const fileUrl = getFileUrl(button);
            const fileType = getFileType(fileUrl);

            if (!fileUrl) {
                meta.textContent = "FILE • File not linked";
                return;
            }

            meta.textContent = `${fileType} • Checking size...`;

            try {
                const response = await fetch(fileUrl, { method: "HEAD" });
                const size = response.headers.get("content-length");

                if (size) {
                    meta.textContent = `${fileType} • ${formatFileSize(Number(size))}`;
                } else {
                    meta.textContent = `${fileType} • File size unavailable`;
                }
            } catch (error) {
                meta.textContent = `${fileType} • File size unavailable`;
            }
        });
    }

async function forceDownload(fileUrl) {
    const fileName = getFileName(fileUrl);
    const modalTitle = modal.querySelector("h3");
    const modalText = modal.querySelector("p");
    const loader = modal.querySelector(".download-loader");

    showDownloadModal();

    modalTitle.textContent = "Please wait for download";
    modalText.textContent = "Your file is being prepared.";
    loader.style.display = "block";

    try {
        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error("File request failed");
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();

        downloadLink.remove();

        modalTitle.textContent = "Download started";
        modalText.textContent = "You may now check your downloads folder.";
        loader.style.display = "none";

        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            hideDownloadModal();
        }, 2500);

    } catch (error) {
        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        modalTitle.textContent = "Download started";
        modalText.textContent = "You may now check your downloads folder.";
        loader.style.display = "none";

        setTimeout(hideDownloadModal, 2500);
    }
}

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

            const fileUrl = getFileUrl(button);

            if (!fileUrl) {
                alert("No file is linked to this button yet.");
                return;
            }

            forceDownload(fileUrl);
        });
    });

    loadActualFileSizes();
});