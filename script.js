const todoListApi = "https://longvu2907.gq/db.json";
const todoListBlock = document.querySelector(".todo-list__list");
const addButton = document.querySelector(".add-todo__button");
var addButtonActive = document.querySelector(".add-todo__button.active");
const inputElement = document.querySelector(".add-todo__input");
const data = JSON.parse(localStorage.getItem("todoList") || "[]");
function getTodoList(callback) {
    fetch(todoListApi)
        .then((response) => response.json())
        .then(callback)
        .catch((err) => alert(err));
}

function renderTodoList() {
    var htmls = data.map((item) => {
        return `
            <div class="todo-list__item item-${item.id}">
                <div class="item__content">
                    <div class="item__todo">
                        <span>${item.todo}</span>
                    </div>
                    <div class="item__time">
                        <span>${item.time}</span>
                    </div>
                </div>
                <div class="item__modify">
                    <i class="fas fa-pen-fancy item__edit-button" onclick="handleEditTodo('${item.id}')"></i>
                    <i class="fas fa-times item__delete-button" onclick="handleDeleteTodo('${item.id}')"></i>
                </div>
            </div>
        `;
    });
    todoListBlock.innerHTML = htmls.join("");
}

function handleAddTodo() {
    const input = document.querySelector(
        '.todo-list__add-todo input[name="todo"]'
    );
    var todo = input.value;
    if (todo === "") return;
    input.value = "";
    var time = new Date();
    var minutes =
        time.getMinutes() > 10 ? time.getMinutes() : "0" + time.getMinutes();
    var hours = time.getHours() > 10 ? time.getHours() : "0" + time.getHours();
    time = `${hours}:${minutes} - ${time.getDate()}/${
        time.getMonth() + 1
    }/${time.getFullYear()}`;
    let id = Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    let newData = {
        id: id,
        todo: todo,
        time: time,
        status: "pending",
    };
    data.push(newData);
    todoListBlock.innerHTML += `
        <div class="todo-list__item item-${newData.id} item--new">
            <div class="item__content">
                <div class="item__todo">
                    <span>${newData.todo}</span>
                </div>
                <div class="item__time">
                    <span>${newData.time}</span>
                </div>
            </div>
            <div class="item__modify">
                <i class="fas fa-pen-fancy item__edit-button" onclick="handleEditTodo('${newData.id}')"></i>
                <i class="fas fa-times item__delete-button" onclick="handleDeleteTodo('${newData.id}')"></i>
            </div>
        </div>`;
    var items = document.querySelectorAll(".item--new");
    var item = items[items.length - 1];
    setTimeout(() => item.classList.remove("item--new"), 500);
    updateTodoList();
}

function handleDeleteTodo(id) {
    var item = document.querySelector(".todo-list__item.item-" + id);
    data.forEach((item, index) => {
        if (item.id == id) data.splice(index, 1);
    });
    item.classList.add("item--removed");
    setTimeout(() => item.remove(), 1000);
    updateTodoList();
}

function updateTodoList() {
    localStorage.setItem("todoList", JSON.stringify(data));
}

function handleEditTodo(id) {
    var element = document.querySelector(
        ".todo-list__item.item-" + id + " .item__todo"
    );
    var confirmButton = document.querySelector(
        ".todo-list__item.item-" + id + " .item__edit-button"
    );
    var contenteditable = !(element.getAttribute("contenteditable") === "true");
    if (contenteditable)
        confirmButton.classList.replace("fa-pen-fancy", "fa-check");
    else confirmButton.classList.replace("fa-check", "fa-pen-fancy");
    element.setAttribute("contenteditable", contenteditable);
    var time = new Date();
    var minutes =
        time.getMinutes() > 10 ? time.getMinutes() : "0" + time.getMinutes();
    var hours = time.getHours() > 10 ? time.getHours() : "0" + time.getHours();
    time = `${hours}:${minutes} - ${time.getDate()}/${
        time.getMonth() + 1
    }/${time.getFullYear()}`;
    data.forEach((item) => {
        if (item.id == id) {
            item.todo = element.innerText;
            item.time = time;
        }
    });
    updateTodoList();
}

function start() {
    updateTodoList();
    renderTodoList();
    addButton.addEventListener("click", () => {
        inputElement.classList.toggle("active");
        addButton.classList.toggle("active");
        addButtonActive = document.querySelector(".add-todo__button.active");
        if (addButtonActive !== null)
            addButtonActive.addEventListener("click", handleAddTodo);
    });
}

start();
