const body = document.getElementsByTagName("body")[0];

const clearElements = (parent) => {
  parent.childNodes.forEach((node) => {
    node.remove();
  });
};

// On First Load of the script file
(async () => {
  const res = await fetch("https://anapioficeandfire.com/api/books");
  const books = await res.json();
  const suggestion = document.getElementById("datalist");
  books.map((book) => {
    const option = document.createElement("option");
    option.value = book.name;
    suggestion.appendChild(option);
  });
})();

// Fetch Book based on the search
const fetchBook = async (filter) => {
  try {
    const res = await fetch("https://anapioficeandfire.com/api/books");
    const books = await res.json();
    const oldBook = document.getElementById("book");
    let filteredBooks = books.filter(
      (book) =>
        book.name.toLowerCase().includes(filter.toLowerCase()) && filter !== ""
    );
    clearElements(oldBook);
    if (filteredBooks.length > 0) {
      filteredBooks.map(async (book) => {
        oldBook.innerHTML += `<div id="loading">
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Loading...</div>`;

        const bookContainer = createDiv(
          "book-container",
          "book-container bg-light p-5"
        );

        const bookName = createDiv(
          "bookName",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        let title = createData("title", "font-weight-bold", "Book Name : ");
        let value = createData("title", "bold", book.name);
        bookName.appendChild(title);
        bookName.appendChild(value);

        const bookISBN = createDiv(
          "bookISBN",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        title = createData("title", "font-weight-bold", "Book ISBN : ");
        value = createData("title", "bold", book.isbn);
        bookISBN.appendChild(title);
        bookISBN.appendChild(value);

        const bookNoOfPages = createDiv(
          "bookNoOfPages",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        title = createData("title", "font-weight-bold", "No of Pages : ");
        value = createData("title", "bold", book.numberOfPages);
        bookNoOfPages.appendChild(title);
        bookNoOfPages.appendChild(value);

        const bookAuthor = createDiv(
          "bookAuthor",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        title = createData("title", "font-weight-bold", "Authors : ");
        const authors = book.authors.map((author, i) => {
          if (i === 0) {
            return author;
          }
          return `, ${author}`;
        });
        value = createData("title", "bold", authors);
        bookAuthor.appendChild(title);
        bookAuthor.appendChild(value);

        const bookPublisher = createDiv(
          "bookPublisher",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        title = createData("title", "font-weight-bold", "Publisher : ");
        value = createData("title", "bold", book.publisher);
        bookPublisher.appendChild(title);
        bookPublisher.appendChild(value);

        const bookReleased = createDiv(
          "bookReleased",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        title = createData("title", "font-weight-bold", "Released  : ");
        value = createData("title", "bold", book.released.substring(0, 10));
        bookReleased.appendChild(title);
        bookReleased.appendChild(value);

        const bookCharacters = createDiv(
          "bookCharacters",
          "d-flex align-item-center justify-content-between bookDetail"
        );
        title = createData("title", "font-weight-bold", "Characters  : ");

        const getCharacterName = async (i) => {
          try {
            const res = await fetch(book.characters[i]);
            const data = await res.json();
            return data.name;
          } catch (err) {
            alert(err);
          }
        };
        let i = 0;
        let end = 5;
        let characters = "";
        while (i < end) {
          const name = await getCharacterName(i++);
          if (name === "") {
            end++;
          } else {
            if (i !== end) characters += name + " , ";
            else characters += name;
          }
        }

        value = createData("title", "bold", characters);
        bookCharacters.appendChild(title);
        bookCharacters.appendChild(value);

        bookContainer.appendChild(bookName);
        bookContainer.appendChild(bookISBN);
        bookContainer.appendChild(bookNoOfPages);
        bookContainer.appendChild(bookAuthor);
        bookContainer.appendChild(bookPublisher);
        bookContainer.appendChild(bookReleased);
        bookContainer.appendChild(bookCharacters);
        oldBook.removeChild(document.getElementById("loading"));
        oldBook.appendChild(bookContainer);
      });
    }
  } catch (err) {
    alert(err);
  }
};

const searchBooks = () => {
  fetchBook(inputField.value);
};

// Create a Div
const createDiv = (id, className) => {
  const div = document.createElement("div");
  div.id = id;
  div.className = className;

  return div;
};

// Create A Book Detail P tag
const createData = (id, className, text) => {
  const p = document.createElement("p");
  p.id = id;
  p.className = className;
  p.innerText = text;
  return p;
};

// Filter Container
const filterContainer = document.createElement("form");
filterContainer.id = "filter-container";
filterContainer.className = "form-inline mt-5";
filterContainer.onsubmit = function (e) {
  e.preventDefault();
};

// Search Box Container
const formGroup = createDiv("form-group", "form-group searchBox w-75");

// Input Field form search
const inputField = document.createElement("input");
inputField.type = "search";
inputField.id = "search-box";
inputField.className = "form-control form-control-lg";
inputField.placeholder = "Enter your search query";
inputField.setAttribute("list", "datalist");

// To display Suggestions while typing in search ox using datalist
const suggestionBox = document.createElement("datalist");
suggestionBox.id = "datalist";

// Append input in search box container
formGroup.appendChild(inputField);
formGroup.appendChild(suggestionBox);

// Search Button
const button = document.createElement("button");
button.id = "search-btn";
button.className = "btn-lg btn-primary";
button.innerText = "Search";
button.addEventListener("click", searchBooks);

// Searched Book container
const bookContainer = createDiv("book", "book mt-5 container");

// Append Search Box container and Search Button in Filter Container
filterContainer.appendChild(formGroup);
filterContainer.appendChild(button);

// Append Filter Container in Body
body.appendChild(filterContainer);
body.appendChild(bookContainer);
