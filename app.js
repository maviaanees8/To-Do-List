console.log("JavaScript connected!");

var taskInput = document.getElementById("taskInput");
var addBtn = document.getElementById("addBtn");
var taskList = document.getElementById("taskList");

var totalTasks = document.getElementById("totalTasks");
var completedTasks = document.getElementById("completedTasks");
var pendingTasks = document.getElementById("pendingTasks");
var emptyState = document.getElementById("emptyState");

var filterButtons = document.querySelectorAll(".filter-btn");

var tasks = JSON.parse(localStorage.getItem("eliteTasks")) || [];

var currentFilter = "all";


// Save tasks in Local Storage
function saveTasks() {
    localStorage.setItem("eliteTasks", JSON.stringify(tasks));
}


// Update task counters
function updateCount() {
    var total = tasks.length;

    var completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    totalTasks.innerText = total;
    completedTasks.innerText = completed;
    pendingTasks.innerText = total - completed;
}


// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    var filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });

    emptyState.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    if (tasks.length === 0) {
        emptyState.querySelector("h3").innerText = "Nothing here yet";
        emptyState.querySelector("p").innerText =
            "Add your first task and make progress today.";
    } else if (filteredTasks.length === 0) {
        emptyState.querySelector("h3").innerText = "No tasks found";
        emptyState.querySelector("p").innerText =
            "Try selecting another filter.";
    }

    filteredTasks.forEach(function(task) {

        var li = document.createElement("li");

        // Checkbox
        var checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();
            displayTasks();

        });


        // Task text
        var span = document.createElement("span");

        span.innerText = task.text;
        span.className = "task-text";

        if (task.completed) {
            span.classList.add("completed");
        }


        // Delete button
        var deleteBtn = document.createElement("button");

        deleteBtn.innerText = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function() {

            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();
            displayTasks();

        });


        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });

    updateCount();

}


// Add new task
function addTask() {

    var taskValue = taskInput.value.trim();

    if (taskValue === "") {
        alert("Please enter a task!");
        return;
    }

    var newTask = {
        id: Date.now(),
        text: taskValue,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = "";

    saveTasks();
    displayTasks();

}


// Add button
addBtn.addEventListener("click", addTask);


// Enter key
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// Task filters
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTasks();

    });

});


// Load saved tasks when page opens
displayTasks();