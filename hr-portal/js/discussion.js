// Modern Discussion Board JS - Enhanced UX with Search
let currentFilter = "all";
let searchTerm = '';
let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

// Elements
const board = document.getElementById("feedbackBoard");
const modal = document.getElementById("feedbackModal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModal");
const submitBtn = document.getElementById("submitFeedback");
const globalSearch = document.getElementById("globalSearch");

const errorMsg = document.getElementById("errorMsg");
const successMsg = document.getElementById("successMsg");

// Inputs
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const department = document.getElementById("department");
const email = document.getElementById("email");
const concern = document.getElementById("concern");
const priority = document.getElementById("priority");

// Filter buttons
const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentFilter = btn.dataset.filter;
        renderFeedbacks();
    });
});

// Global Search
globalSearch.addEventListener("input", (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    renderFeedbacks();
});

function searchFeedbacks() {
    renderFeedbacks();
}

// Modal Events
openBtn.onclick = () => {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    resetFormState();
};

closeBtn.onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = "";
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }
};

// Validation (email optional)
function validate() {
    let valid = true;
    const inputs = [firstName, lastName, department, concern];

    inputs.forEach(input => {
        input.classList.remove("input-error", "input-success");
        if (!input.value.trim()) {
            input.classList.add("input-error");
            valid = false;
        }
    });

    // Optional email validation
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add("input-error");
        valid = false;
    }

    return valid;
}

// Submit
submitBtn.onclick = () => {
    resetFormState();

    if (!validate()) {
        errorMsg.textContent = "Please fill all required fields correctly.";
        errorMsg.style.display = "block";
        return;
    }

    const newFeedback = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        department: department.value.trim(),
        email: email.value.trim(),
        concern: concern.value.trim(),
        status: "Not Viewed by Admin",
        priority: priority.value,
        time: new Date().toLocaleString("en-US", { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    };

    feedbacks.unshift(newFeedback); // Add to top
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

    // Success UI
    successMsg.textContent = "✅ Feedback submitted successfully! Thank you.";
    successMsg.style.display = "block";
    [firstName, lastName, department, concern, email].forEach(input => input.classList.add("input-success"));

    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "";
        clearForm();
        resetFormState();
        renderFeedbacks();
    }, 1500);
};

function resetFormState() {
    errorMsg.style.display = "none";
    successMsg.style.display = "none";
    [firstName, lastName, department, email, concern].forEach(input => {
        input.classList.remove("input-error", "input-success");
    });
}

function clearForm() {
    firstName.value = lastName.value = department.value = email.value = concern.value = "";
    priority.value = "Pending";
}

// Mark as viewed
function markAsViewed(index) {
    if (feedbacks[index].status === "Not Viewed by Admin") {
        feedbacks[index].status = "Viewed by Admin";
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
        renderFeedbacks();
    }
}

// Main Render Function
function renderFeedbacks() {
    board.innerHTML = '';

    let filteredFeedbacks = feedbacks.filter(fb => {
        const matchesFilter = currentFilter === "all" || 
            (currentFilter === "High Priority" && fb.priority === "High Priority") ||
            (currentFilter === "Pending" && fb.priority === "Pending") ||
            (currentFilter === "Viewed" && fb.status === "Viewed by Admin") ||
            (currentFilter === "Not Viewed" && fb.status === "Not Viewed by Admin");

        const matchesSearch = !searchTerm || 
            fb.firstName.toLowerCase().includes(searchTerm) ||
            fb.lastName.toLowerCase().includes(searchTerm) ||
            fb.department.toLowerCase().includes(searchTerm) ||
            fb.concern.toLowerCase().includes(searchTerm);

        return matchesFilter && matchesSearch;
    });

    if (filteredFeedbacks.length === 0) {
        board.innerHTML = `
            <div class="empty-state">
                <h3>📭 No feedback found</h3>
                <p>No results match your current filters or search. Try adjusting them or submit new feedback.</p>
            </div>
        `;
        return;
    }

    filteredFeedbacks.forEach((fb, index) => {
        const globalIndex = feedbacks.indexOf(fb);
        const statusClass = fb.status === "Viewed by Admin" ? "status-viewed" : "status-not-viewed";
        const priorityClass = fb.priority === "High Priority" ? "priority-high" : '';

        const card = document.createElement("div");
        card.className = "feedback-card";
        card.innerHTML = `
            <h3>${fb.firstName} ${fb.lastName}</h3>
            <p>${fb.department}</p>
            <p>${fb.email || 'Anonymous'}</p>
            <div class="concern">${fb.concern}</div>
            <div class="status-badge ${statusClass}">
                <span class="icon">${fb.status === "Viewed by Admin" ? '👁️' : '📌'}</span>
                ${fb.status}
            </div>
            ${fb.priority === "High Priority" ? `<div class="priority-high">⚡ High Priority</div>` : ''}
            <div class="time">${fb.time}</div>
        `;

        card.onclick = () => markAsViewed(globalIndex);
        board.appendChild(card);
    });
}

// Initial render
renderFeedbacks();

