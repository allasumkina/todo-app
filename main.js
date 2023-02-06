// Find elements on the page
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// Functions
function addTask(event) {
	// Cancel form sending
	event.preventDefault();

	// Get out task text from input field
	const taskText = taskInput.value;

	// Task description
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};

	// Add a task to array
	tasks.push(newTask);

	// Save task list into localStorage
	saveToLocalStorage();

	// Rendering
	renderTask(newTask);

	// Field cleaning off and return focus
	taskInput.value = '';
	taskInput.focus();

	checkEmptyList();
}

function deleteTask(event) {
	// Check if a click not for a button "remove a task"
	if (event.target.dataset.action !== 'delete') return;

	const parenNode = event.target.closest('.list-group-item');

	// Determination of ID tasks
	const id = Number(parenNode.id);

	// Tasks removing through array filtration
	tasks = tasks.filter((task) => task.id !== id);

	// Saving of task list into localStorage
	saveToLocalStorage();

	// Task removing
	parenNode.remove();

	checkEmptyList();
}

function doneTask(event) {
	// Check if a click wasn't on button "task is done"
	if (event.target.dataset.action !== 'done') return;

	const parentNode = event.target.closest('.list-group-item');

	// Determination of task ID
	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.done = !task.done;

	// Save task list into localStorage
	saveToLocalStorage();

	const taskTitle = parentNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Task list is empty</div>
				</li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	// Forming of CSS class
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

	// For a new task
	const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

	// Add a task on the page
	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}