// document elements
let mainBody = document.querySelector("main");
let bookDisplay = document.querySelector("#book-display");
let addBtn = document.querySelector("#add-button");
let addRandomBtn = document.querySelector("#add-random-button");
let formDisplay = document.querySelector("#form-display");
let bookForm = document.querySelector("#book-form");
let submitBtn = document.querySelector("#submit-button");
let cancelBtn = document.querySelector("#cancel-button");

// constructor and methods

let myLibrary = [];
const FIELDS = 4; // no. of instance variables for each Book object

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    if (typeof pages === "string") {
        this.pages = parseInt(pages);
    } else {
        this.pages = pages;
    }

    if (typeof read === "string") {
        this.read = (read === "true");
    } else {
        this.read = read;
    }
}

Book.prototype.info = function(){
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? "read" : "not read yet"}`;
}

Book.prototype.toString = function() {
    return `${this.title},${this.author},${this.pages},${this.read}`;
}

Book.prototype.changeReadStatus = function() {
    this.read = !this.read;
}

function addBookToLibrary(...book) {
    for (let i = 0; i < book.length; i++) {
        myLibrary.push(book[i]);
    }
}

function displayBooks() {
    bookDisplay.innerHTML = "";
    updateLocalStorage();
    for (let i = 0; i < myLibrary.length; i++) {
        addBookElement(myLibrary[i], i);
    }
}




// Page Set-up
addBtn.addEventListener("click", addBtnListener);
addRandomBtn.addEventListener("click", addRandomBtnListener);
submitBtn.addEventListener("click", submitBtnListener);
cancelBtn.addEventListener("click", cancelBtnListener);

function addBtnListener(e) {
    unhide();
}

function addRandomBtnListener(e) {
    let titleLen = randomInt(1, 15);
    const title = randomString(titleLen);
    const author = `TheLegend${randomInt(1, 100)}`;
    const pageCount = randomInt(100, 1000);
    let read =  randomInt(0, 100) < 50 ? true : false; 
    let randomBook = new Book(title, author, pageCount, read);
    addBookToLibrary(randomBook);
    displayBooks();
}

function submitBtnListener(e) {
    if (!isFormFilled(bookForm)) {
        return;
    }

    let titleInput = bookForm.querySelector("#title").value;
    let authorInput = bookForm.querySelector("#author").value;
    let pageInput = bookForm.querySelector("#pages").value;
    let readInput = bookForm.querySelectorAll(".read");
    readInput = radioBtnToValue(readInput);
    hide();

    const book = new Book(titleInput, authorInput, pageInput, readInput);
    addBookToLibrary(book);
    displayBooks();
}

function cancelBtnListener(e) {
    hide();
} 

function removeBtnListener(e) {
    const bookDiv = this.parentNode;
    const libraryIndex = bookDiv.getAttribute("data-library-index");
    myLibrary.splice(libraryIndex, 1);
    displayBooks();
}

function readBtnListener(e) {
    const bookDiv = this.parentNode;
    const libraryIndex = bookDiv.getAttribute("data-library-index");
    myLibrary[libraryIndex].changeReadStatus();
    displayBooks();
}

// helper functions
function addBookElement(book, index) {
    const bookDiv = document.createElement("div");
    const indexAttribute = document.createAttribute("data-library-index");
    indexAttribute.value = index;
    bookDiv.setAttributeNode(indexAttribute);
    bookDiv.setAttribute("style", 
        "position: relative;\
            margin: 5px;\
            background-color: beige;\
            border: 1px solid black;");
    bookDiv.textContent = book.info();

    const removeBtn = document.createElement("button");
    removeBtn.setAttribute("style", 
        "display: block;\
            position: absolute;\
            bottom: 0;");
    removeBtn.textContent = "Remove from library";
    removeBtn.addEventListener("click", removeBtnListener);

    const readBtn = document.createElement("button");
    readBtn.setAttribute("style", 
        "display: block;\
            position: absolute;\
            bottom: 0;\
            right: 0;");
    if (book.read === true) {
        readBtn.textContent = "Mark unread";
    } else {
        readBtn.textContent = "Mark read";
    }
    readBtn.addEventListener("click", readBtnListener);

    bookDiv.appendChild(removeBtn);
    bookDiv.appendChild(readBtn);
    bookDisplay.appendChild(bookDiv);
}

function randomInt(low, high) {
    const range = high - low;
    return low + Math.floor(Math.random() * range);
}


function randomString(charCount) {
    let lst = [];
    for (let i = 0; i < charCount; i++) {
        let charOffset = randomInt(0, 26);
        lst.push(String.fromCharCode(charOffset + 97));
    }
    return lst.join("");
}


function isFormFilled(form) {
    let inputList = form.querySelectorAll("input");
    for (let i = 0; i < inputList.length; i++) {
        if (inputList[i].value.length === 0) {
            alert("Please fill in all fields");
            return false;
        }
    }
    console.log("All fields filled");
    return true;
}

function radioBtnToValue(buttonList) {
    for (let i = 0; i < buttonList.length; i++) {
        if (buttonList[i].checked) {
            return buttonList[i].value;
        }
    }
}

function unhide() {
    formDisplay.setAttribute("style", "display: block;");

}

function hide() {
    formDisplay.setAttribute("style", "display: none;");
    bookForm.reset();
}

function updateLocalStorage() {
    localStorage.setItem("myLibrary", myLibrary.toString());
}

function populateLibrary(str) {
    if (str === "") {
        return;
    }
    const arr = str.split(",");
    for (let i = 0; i < arr.length;) {
        let lst = [];
        for (let j = 0; j < FIELDS; i++, j++) {
            lst.push(arr[i]);
        }
        addBookToLibrary(new Book(...lst));
    }
}

// Using application
let theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
let theStand = new Book("The Stand", "S. King", 1000, true);
let harryPotter = new Book("Harry Potter", "J.K. Rowling", 500, false);
function addDefaultBooks() {
    addBookToLibrary(theHobbit, theStand, harryPotter);
}

if (localStorage.getItem("myLibrary") === null) {
    addDefaultBooks();
} else {
    populateLibrary(localStorage.getItem("myLibrary"));
}
displayBooks();
