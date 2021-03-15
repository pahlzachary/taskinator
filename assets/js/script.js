var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function () {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  //package up data as an object
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
  };
  
  //check validity of input
  if (!taskNameInput || !taskTypeInput) {
      alert("You need to fill out the task form!");
      return false;
  }

  formEl.reset(); 

  // send as arg to createTaskEl function (below)
  createTaskEl(taskDataObj);
};

var createTaskEl = function (taskDataObj) {
  //creates list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  //create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";
  listItemEl.appendChild(taskInfoEl);
  tasksToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit", taskFormHandler);

// pausing at 4.2.5 Handle Form Submission
