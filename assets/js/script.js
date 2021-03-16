var formEl = document.querySelector("#task-form");
var pageContentEl = document.querySelector("#page-content");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;

var tasks = [];

var taskFormHandler = function () {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  var isEdit = formEl.hasAttribute("data-task-id");

  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  //else no data attribute, so create object as normal and
  //pass to createTaskEl function
  else {
    //package up data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do",
    };
    createTaskEl(taskDataObj);
  }

  //check validity of input
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  formEl.reset();
};

var createTaskEl = function (taskDataObj) {
  //creates list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  //add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  //create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";

  //appends name and type of task to li
  listItemEl.appendChild(taskInfoEl);

  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);

  //append task actions (select dropdown menu) to li
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  //appends li to ul
  tasksToDoEl.appendChild(listItemEl);
  //increase task counter for next unique id
  taskIdCounter++;

  //saves to local storage
  saveTasks();
};

var createTaskActions = function (taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  //creates edit and delete buttons
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(editButtonEl);

  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(deleteButtonEl);

  //create select menu (for moving tasks along columns)
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i = 0; i < statusChoices.length; i++) {
    //creates the option el
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);
    //append this option to select menu
    statusSelectEl.appendChild(statusOptionEl);
  }
  actionContainerEl.appendChild(statusSelectEl);

  return actionContainerEl;
};

var taskButtonHandler = function (event) {
  //get target element from event
  var targetEl = event.target;

  //if edit button is clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = event.target.getAttribute("data-task-id");
    editTask(taskId);
  }
  //if delete button is clicked
  else if (targetEl.matches(".delete-btn")) {
    //get the eleemnt's taskId
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var editTask = function (taskId) {
  //get task li element
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  //get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;

  //puts task name and type from taskId selected back into form
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  //change "Add task" button to "Save Task" for usability
  document.querySelector("#save-task").textContent = "Save Task";

  //adds taskId to a data-task-id attribute to form itself
  formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function (taskName, taskType, taskId) {
  //finds the matching task list item
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  //sets new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  //updating tasks array for localstorage
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }
  alert("Task Updated!");

  //save to local storage
  saveTasks();

  //reset form and remove data-task-id
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};

var deleteTask = function (taskId) {
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();

  // create new array to hold updated list of tasks
  var updatedTaskArr = [];

  //loop thru current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId,
    //let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  //reassign tasks array to be the same as updated Taskarr
  tasks = updatedTaskArr;

  //save to local storage
  saveTasks();
};

var taskStatusChangeHandler = function (event) {
  //get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  //get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  //find the parenty task item el based on the id
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  //if logic to move task to "changed" selection
  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  //updating tasks array for local storage
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }

  //save to local storage
  saveTasks();
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//
//TODO: Needs to remember the select status of task
//
var loadTasks = function () {
  var savedTasks = localStorage.getItem("tasks");

  if (!savedTasks) {
      return false;
  }

  savedTasks = JSON.parse(savedTasks);

  //loop thru savedTasks array
  for (var i=0; i <savedTasks.length; i++) { 
      //pass each task object into the createTaskEl() function
      createTaskEl(savedTasks[i]);
  }
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
loadTasks();