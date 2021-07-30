const todoListApi = "https://longvu2907.gq/db.json";
const todoListBlock = document.querySelector('.todo-list__list');
const addButton = document.querySelector('.add-todo__button');
var addButtonActive = document.querySelector('.add-todo__button.active');
const inputElement = document.querySelector('.add-todo__input');

function getTodoList(callback) {
    fetch(todoListApi)
        .then(response => response.json())
        .then(callback)
        //.catch((err) => alert(err));
}

function renderTodoList(data) {
    var htmls = data.todoList.map((item) => {
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
                    <i class="fas fa-pen-fancy item__edit-button" onclick="handleEditTodo(${item.id})"></i>
                    <i class="fas fa-times item__delete-button" onclick="handleDeleteTodo(${item.id})"></i>
                </div>
            </div>
        `
    });
    todoListBlock.innerHTML = htmls.join('');
}

function handleAddTodo() {
    const input = document.querySelector('.todo-list__add-todo input[name="todo"]');
    var todo = input.value;
    if (todo === '') return;
    input.value = '';
    var time = new Date;
    var minutes = (time.getMinutes() > 10) ? time.getMinutes() : '0' + time.getMinutes();
    var hours = (time.getHours() > 10) ? time.getHours() : '0' + time.getHours();
    time = `${hours}:${minutes} - ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
    var data = { 
        todo: todo,
        time: time,
        status: "pending",
    }
    addTodo(data);
}

function addTodo(data) {
    fetch(todoListApi, {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(respone => respone.json())
    .then((data) => {
        todoListBlock.innerHTML += `
        <div class="todo-list__item item-${data.id} item--new">
            <div class="item__content">
                <div class="item__todo">
                    <span>${data.todo}</span>
                </div>
                <div class="item__time">
                    <span>${data.time}</span>
                </div>
            </div>
            <div class="item__modify">
                <i class="fas fa-pen-fancy item__edit-button" onclick="handleEditTodo(${data.id})"></i>
                <i class="fas fa-times item__delete-button" onclick="handleDeleteTodo(${data.id})"></i>
            </div>
        </div>`
        var items = document.querySelectorAll('.item--new');
        var item = items[items.length - 1]; 
        setTimeout(() => item.classList.remove('item--new'), 500);
    })
    //.catch((err) => alert(err));
}

function handleDeleteTodo(id) {
    var item = document.querySelector('.todo-list__item.item-' + id);
    fetch(todoListApi + '/' + id, {
        method: 'DELETE', 
        headers: {
        'Content-Type': 'application/json'
        },
    })
    // .then(() => { 
    // })
    item.classList.add('item--removed');
    setTimeout(() => item.remove(), 1000);
    //.catch((err) => alert(err));
}

function updateTodo(data, id) {
    var option = {
        method: 'PUT', 
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    }
    fetch(todoListApi + '/' + id, option);
}

function handleEditTodo(id) {
    var item = document.querySelector('.todo-list__item.item-' + id + ' .item__todo');
    var confirmButton = document.querySelector('.todo-list__item.item-' + id + ' .item__edit-button');
    var contenteditable = !(item.getAttribute('contenteditable') === 'true');
    if (contenteditable) confirmButton.classList.replace('fa-pen-fancy', 'fa-check');
    else confirmButton.classList.replace('fa-check', 'fa-pen-fancy');
    item.setAttribute('contenteditable', contenteditable);
    var time = new Date;
    var minutes = (time.getMinutes() > 10) ? time.getMinutes() : '0' + time.getMinutes();
    var hours = (time.getHours() > 10) ? time.getHours() : '0' + time.getHours();
    time = `${hours}:${minutes} - ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
    var data = { 
        todo: item.innerText,
        time: time,
        status: "pending",
    }
    updateTodo(data, id);
}

function start() {
    getTodoList(renderTodoList);
    addButton.addEventListener('click', () => { 
        inputElement.classList.toggle('active'); 
        addButton.classList.toggle('active');
        addButtonActive = document.querySelector('.add-todo__button.active');
        if (addButtonActive !== null) addButtonActive.addEventListener('click', handleAddTodo);
    });
}

start()
