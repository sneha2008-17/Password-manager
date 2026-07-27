const website = document.getElementById("website");
const username = document.getElementById("username");
const password = document.getElementById("password");

const saveBtn = document.getElementById("saveBtn");
const generateBtn = document.getElementById("generateBtn");
const togglePassword = document.getElementById("togglePassword");

const search = document.getElementById("search");
const table = document.getElementById("credentialTable");

let credentials = JSON.parse(localStorage.getItem("credentials")) || [];
let editIndex = -1;

// Display saved credentials when page loads
displayCredentials();


// Generate Password
generateBtn.addEventListener("click", () => {

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    let generatedPassword = "";

    for (let i = 0; i < 16; i++) {
        const random = Math.floor(Math.random() * chars.length);
        generatedPassword += chars[random];
    }

    password.value = generatedPassword;

});


// Show/Hide Password
togglePassword.addEventListener("click", () => {

    if (password.type === "password") {
        password.type = "text";
        togglePassword.innerHTML = "🙈";
    } else {
        password.type = "password";
        togglePassword.innerHTML = "👁";
    }

});


// Save Credential
saveBtn.addEventListener("click", () => {

    if (
        website.value.trim() === "" ||
        username.value.trim() === "" ||
        password.value.trim() === ""
    ) {
        alert("Please fill all fields.");
        return;
    }

    const data = {
        website: website.value,
        username: username.value,
        password: password.value
    };

    if (editIndex === -1) {
        credentials.push(data);
    } else {
        credentials[editIndex] = data;
        editIndex = -1;
        saveBtn.innerText = "Save Credential";
    }

    localStorage.setItem(
        "credentials",
        JSON.stringify(credentials)
    );

    clearFields();
    displayCredentials();

});


// Display Credentials
function displayCredentials(list = credentials) {

    table.innerHTML = "";

    list.forEach((item, index) => {

        table.innerHTML += `

        <tr>

            <td>${item.website}</td>

            <td>${item.username}</td>

            <td>
                <span id="pass${index}">********</span>
            </td>

            <td>

                <button class="action-btn show-btn"
                onclick="toggleRowPassword(${index})">
                Show
                </button>

                <button class="action-btn copy-btn"
                onclick="copyPassword(${index})">
                Copy
                </button>

                <button class="action-btn edit-btn"
                onclick="editCredential(${index})">
                Edit
                </button>

                <button class="action-btn delete-btn"
                onclick="deleteCredential(${index})">
                Delete
                </button>

            </td>

        </tr>

        `;

    });

}


// Delete
function deleteCredential(index) {

    if (confirm("Delete this credential?")) {

        credentials.splice(index, 1);

        localStorage.setItem(
            "credentials",
            JSON.stringify(credentials)
        );

        displayCredentials();

    }

}


// Edit
function editCredential(index) {

    website.value = credentials[index].website;
    username.value = credentials[index].username;
    password.value = credentials[index].password;

    editIndex = index;

    saveBtn.innerText = "Update Credential";

}


// Copy Password
function copyPassword(index) {

    navigator.clipboard.writeText(credentials[index].password);

    alert("Password copied!");

}


// Show Password in Table
function toggleRowPassword(index) {

    const span = document.getElementById("pass" + index);

    if (span.innerText === "********") {
        span.innerText = credentials[index].password;
    } else {
        span.innerText = "********";
    }

}


// Search
search.addEventListener("keyup", () => {

    const value = search.value.toLowerCase();

    const filtered = credentials.filter(item =>

        item.website.toLowerCase().includes(value) ||

        item.username.toLowerCase().includes(value)

    );

    displayCredentials(filtered);

});


// Clear Inputs
function clearFields() {

    website.value = "";
    username.value = "";
    password.value = "";

}
