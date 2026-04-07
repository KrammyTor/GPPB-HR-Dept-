let currentFilter = "all";
let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

    // =========================
    // ELEMENTS
    // =========================
const board = document.getElementById("feedbackBoard");
const modal = document.getElementById("feedbackModal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModal");
const submitBtn = document.getElementById("submitFeedback");

const errorMsg = document.getElementById("errorMsg");
const successMsg = document.getElementById("successMsg");

// inputs
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const department = document.getElementById("department");
const email = document.getElementById("email");
const concern = document.getElementById("concern");
const priority = document.getElementById("priority");

    // =========================
    // FILTER BUTTONS
    // =========================
const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentFilter = btn.dataset.filter;
        renderFeedbacks();
    });
});

    // =========================
    // OPEN MODAL
    // =========================
openBtn.onclick = () => {
    modal.style.display = "flex";
    resetFormState();
};

    // =========================
    // CLOSE MODAL
    // =========================
closeBtn.onclick = () => {
    modal.style.display = "none";
};

    // =========================
    // VALIDATION
    // =========================
function validate() {
    let valid = true;

    const inputs = [firstName, lastName, department, email, concern];

    inputs.forEach(input => {
        input.classList.remove("input-error");

        if (!input.value.trim()) {
            input.classList.add("input-error");
            valid = false;
        }
    });

    return valid;
}

    // =========================
    // SUBMIT
    // =========================
submitBtn.onclick = () => {

    resetFormState();

    if (!validate()) {
        errorMsg.textContent = "Please fill out all fields.";
        errorMsg.style.display = "block";
        return;
    }

    const newFeedback = {
        firstName: firstName.value,
        lastName: lastName.value,
        department: department.value,
        email: email.value,
        concern: concern.value,
        status: "Not Viewed by Admin",
        priority: priority.value,
        time: new Date().toLocaleString()
    };

    feedbacks.push(newFeedback);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

    // SUCCESS UI
    successMsg.textContent = "Feedback sent successfully!";
    successMsg.style.display = "block";

    const inputs = [firstName, lastName, department, email, concern];
    inputs.forEach(input => input.classList.add("input-success"));

    setTimeout(() => {
        modal.style.display = "none";
        clearForm();
        resetFormState();
        renderFeedbacks();
    }, 1000);
};

function resetFormState() {
    errorMsg.style.display = "none";
    successMsg.style.display = "none";

    const inputs = [firstName, lastName, department, email, concern];

    inputs.forEach(input => {
        input.classList.remove("input-error");
        input.classList.remove("input-success");
    });
}

    // =========================
    // CLEAR
    // =========================
function clearForm() {
    firstName.value = "";
    lastName.value = "";
    department.value = "";
    email.value = "";
    concern.value = "";
}

    // =========================
    // MARKK AS VIEWED
    // =========================
function markAsViewed(index) {
    if (feedbacks[index].status === "Not Viewed by Admin") {
        feedbacks[index].status = "Viewed by Admin";
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    }
}
    // =========================
    // RENDER
    // =========================
function renderFeedbacks() {
    board.innerHTML = "";

    let hasResults = false;

    feedbacks.forEach((fb, index) => {

        if (currentFilter === "High Priority" && fb.priority !== "High Priority") return;
        if (currentFilter === "Pending" && fb.priority !== "Pending") return;
        if (currentFilter === "Viewed" && fb.status !== "Viewed by Admin") return;
        if (currentFilter === "Not Viewed" && fb.status !== "Not Viewed by Admin") return;

        hasResults = true;

        const card = document.createElement("div");
        card.classList.add("feedback-card");

        // STATUS CLASS
        let statusClass = "not-viewed";
        if (fb.status === "Viewed by Admin") statusClass = "viewed";
        if (fb.priority === "High Priority") statusClass = "high";
        if (fb.priority === "Pending") statusClass = "pending";

        card.innerHTML = `
            <h3>${fb.firstName} ${fb.lastName}</h3>

            <p>${fb.department}</p>
            <p>${fb.email}</p>

            <div class="concern">
                ${fb.concern}
            </div>

            <span class="status ${statusClass}">
                ${fb.status}
            </span>

            <p class="time">
                ${fb.time || "No timestamp"}
            </p>
        `;

        card.onclick = () => {
            markAsViewed(index);
            renderFeedbacks();
        };

        board.appendChild(card);
    });

    // =========================
    // EMPTY STATE IN FEEDBACK
    // =========================
    if (!hasResults) {
        board.innerHTML = `
            <div class="empty-state">
                No feedback found in this category.
            </div>
        `;
    }
}

// initial render
renderFeedbacks();