const STORAGE_KEY = "feedbacks";

let searchTerm = "";
let feedbacks = loadFeedbacks();

const board = document.getElementById("feedbackBoard");
const modal = document.getElementById("feedbackModal");
const detailModal = document.getElementById("feedbackDetailModal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModal");
const submitBtn = document.getElementById("submitFeedback");
const globalSearch = document.getElementById("globalSearch");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const closeDetailBtn = document.getElementById("closeDetailModal");
const detailBody = document.getElementById("feedbackDetailBody");

const errorMsg = document.getElementById("errorMsg");
const successMsg = document.getElementById("successMsg");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const department = document.getElementById("department");
const email = document.getElementById("email");
const concern = document.getElementById("concern");
const concernCount = document.getElementById("concernCount");

globalSearch.addEventListener("input", () => {
    clearSearchBtn.style.display = globalSearch.value.trim() ? "flex" : "none";
});

globalSearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchFeedbacks();
    }
});

clearSearchBtn.addEventListener("click", () => {
    globalSearch.value = "";
    searchTerm = "";
    clearSearchBtn.style.display = "none";
    renderFeedbacks(false);
    globalSearch.focus();
});

function searchFeedbacks() {
    searchTerm = globalSearch.value.trim().toLowerCase();
    clearSearchBtn.style.display = globalSearch.value.trim() ? "flex" : "none";
    renderFeedbacks(true);
}

window.searchFeedbacks = searchFeedbacks;

openBtn.onclick = () => openSubmitModal();
closeBtn.onclick = () => closeSubmitModal();
closeDetailBtn.onclick = () => closeDetailsModal();

window.addEventListener("click", (e) => {
    if (e.target === modal) closeSubmitModal();
    if (e.target === detailModal) closeDetailsModal();
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeSubmitModal();
        closeDetailsModal();
    }
});

concern.addEventListener("input", updateConcernCount);

function openSubmitModal() {
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    resetFormState();
    updateConcernCount();
    firstName.focus();
}

function closeSubmitModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function openDetailsModal(index) {
    const fb = feedbacks[index];
    if (!fb) return;

    detailBody.innerHTML = `
        <div class="detail-grid">
            <div class="detail-item">
                <span>Name</span>
                <strong>${escapeHTML(`${fb.firstName || ""} ${fb.lastName || ""}`.trim() || "Anonymous")}</strong>
            </div>
            <div class="detail-item">
                <span>Department / Field</span>
                <strong>${escapeHTML(fb.department || "Not provided")}</strong>
            </div>
            <div class="detail-item">
                <span>Email</span>
                <strong>${escapeHTML(fb.email || "Not provided")}</strong>
            </div>
            <div class="detail-item">
                <span>Date Submitted</span>
                <strong>${escapeHTML(fb.time || "No date recorded")}</strong>
            </div>
        </div>

        <div class="detail-concern">
            <span>Concern / Feedback</span>
            <p>${highlightText(fb.concern || "No concern details provided.", searchTerm)}</p>
        </div>
    `;

    detailModal.style.display = "flex";
    detailModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeDetailBtn.focus();
}

function closeDetailsModal() {
    detailModal.style.display = "none";
    detailModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function updateConcernCount() {
    concernCount.textContent = concern.value.length;
}

function validate() {
    let valid = true;
    const requiredInputs = [firstName, lastName, department, concern];

    requiredInputs.forEach(input => {
        input.classList.remove("input-error", "input-success");

        if (!input.value.trim()) {
            input.classList.add("input-error");
            valid = false;
        }
    });

    email.classList.remove("input-error", "input-success");

    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email.classList.add("input-error");
        valid = false;
    }

    return valid;
}

submitBtn.onclick = () => {
    resetFormState();

    if (!validate()) {
        errorMsg.textContent = "Please fill in all required fields correctly.";
        errorMsg.style.display = "block";
        return;
    }

    const newFeedback = {
        id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        department: department.value.trim(),
        email: email.value.trim(),
        concern: concern.value.trim(),
        createdAt: new Date().toISOString(),
        time: new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    };

    feedbacks.unshift(newFeedback);
    saveFeedbacks();

    successMsg.textContent = "✅ Feedback submitted successfully. Thank you.";
    successMsg.style.display = "block";

    [firstName, lastName, department, concern, email].forEach(input => {
        input.classList.add("input-success");
    });

    setTimeout(() => {
        closeSubmitModal();
        clearForm();
        resetFormState();
        renderFeedbacks();
    }, 900);
};

function resetFormState() {
    errorMsg.style.display = "none";
    successMsg.style.display = "none";

    [firstName, lastName, department, email, concern].forEach(input => {
        input.classList.remove("input-error", "input-success");
    });
}

function clearForm() {
    firstName.value = "";
    lastName.value = "";
    department.value = "";
    email.value = "";
    concern.value = "";
    updateConcernCount();
}

function loadFeedbacks() {
    try {
        const storedFeedbacks = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!Array.isArray(storedFeedbacks)) {
            return [];
        }

        return storedFeedbacks.map(fb => ({
            id: fb.id || `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            firstName: fb.firstName || "",
            lastName: fb.lastName || "",
            department: fb.department || "",
            email: fb.email || "",
            concern: fb.concern || "",
            createdAt: fb.createdAt || "",
            time: fb.time || "No date recorded"
        }));
    } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
        return [];
    }
}

function saveFeedbacks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
}

function getSearchScore(fb) {
    if (!searchTerm) return 0;

    const first = (fb.firstName || "").toLowerCase();
    const last = (fb.lastName || "").toLowerCase();
    const fullName = `${first} ${last}`.trim();
    const dept = (fb.department || "").toLowerCase();
    const mail = (fb.email || "").toLowerCase();
    const text = (fb.concern || "").toLowerCase();

    let score = 0;
    const fields = [fullName, first, last, dept, mail, text];

    fields.forEach(field => {
        if (field.includes(searchTerm)) score += 5;
        if (field.startsWith(searchTerm)) score += 3;
    });

    return score;
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(value, term) {
    const safeValue = escapeHTML(value);
    const cleanTerm = term.trim();

    if (!cleanTerm) return safeValue;

    const words = cleanTerm
        .split(/\s+/)
        .filter(Boolean)
        .map(escapeRegExp);

    if (!words.length) return safeValue;

    const regex = new RegExp(`(${words.join("|")})`, "gi");
    return safeValue.replace(regex, `<mark class="search-highlight">$1</mark>`);
}

function getEmptyStateMessage() {
    if (feedbacks.length === 0) {
        return {
            title: "📭 No feedback yet",
            message: "Once users submit feedback or concerns, the cards will appear here."
        };
    }

    if (searchTerm) {
        return {
            title: "🔎 No search found",
            message: `No feedback matched “${escapeHTML(searchTerm)}”. Try another name, department, email, or concern keyword.`
        };
    }

    return {
        title: "📭 No feedback found",
        message: "No concern is currently available."
    };
}

function scrollToResult() {
    const target = board.querySelector(".search-match") || board;

    target.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function renderFeedbacks(shouldScroll = false) {
    board.innerHTML = "";

    const scoredFeedbacks = feedbacks.map((fb, index) => ({
        fb,
        index,
        score: getSearchScore(fb)
    }));

    const visibleFeedbacks = searchTerm
        ? scoredFeedbacks
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score || b.index - a.index)
        : scoredFeedbacks;

    if (visibleFeedbacks.length === 0) {
        const emptyState = getEmptyStateMessage();

        board.innerHTML = `
            <div class="empty-state">
                <h3>${emptyState.title}</h3>
                <p>${emptyState.message}</p>
            </div>
        `;

        if (shouldScroll) {
            setTimeout(scrollToResult, 100);
        }

        return;
    }

    visibleFeedbacks.forEach(({ fb, index, score }) => {
        const isMatched = searchTerm && score > 0;

        const card = document.createElement("article");
        card.className = `feedback-card${isMatched ? " search-match" : ""}`;
        card.tabIndex = 0;
        card.setAttribute("role", "button");

        card.innerHTML = `
            <div class="card-topline">
                <h3>${highlightText(`${fb.firstName || ""} ${fb.lastName || ""}`.trim() || "Anonymous", searchTerm)}</h3>
                ${isMatched ? `<span class="match-pill">Match</span>` : ""}
            </div>

            <p>${highlightText(fb.department || "No department provided", searchTerm)}</p>
            <p>${highlightText(fb.email || "Email not provided", searchTerm)}</p>

            <div class="concern">
                ${highlightText(fb.concern || "No concern details provided.", searchTerm)}
            </div>

            <div class="time">${escapeHTML(fb.time || "No date recorded")}</div>
        `;

        card.addEventListener("click", () => openDetailsModal(index));

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openDetailsModal(index);
            }
        });

        board.appendChild(card);
    });

    if (shouldScroll) {
        setTimeout(scrollToResult, 100);
    }
}

saveFeedbacks();
updateConcernCount();
renderFeedbacks();