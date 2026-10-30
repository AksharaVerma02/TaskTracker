let container = document.querySelector(".container");
let containsNotes=document.querySelector("#containsNotes");

let add=document.querySelector(".btn-add");
let add2=document.querySelector(".add-note");

let modal=document.querySelector(".modal");
let modal2=document.querySelector(".modal2");

let cancel=document.querySelector(".cancel-btn");
let addtask=document.querySelector(".add-btn");

let cancel2=document.querySelector("#cancel-btn");
let addtask2=document.querySelector("#add-btn");

let tasks = JSON.parse(localStorage.getItem("tasks"))||[];

    function createTask() {
    let task = document.querySelector("#add-task");

    tasks.push(task.value);
    localStorage.setItem("tasks",JSON.stringify(tasks));

    let taskbar=document.createElement("div");
    taskbar.className="taskbar";
    container.append(taskbar);

    let taskContent=document.createElement("div");
    taskContent.className="tasks";
    taskbar.append(taskContent);

    let checkbox = document.createElement("input");
    checkbox.type="checkbox";
    taskContent.append(checkbox);

    let label = document.createElement("label");
    label.textContent=task.value;
    taskContent.append(label);


    let delbtn = document.createElement("button");
    delbtn.className="btn";
    delbtn.textContent="DELETE";
    taskbar.append(delbtn);

    delbtn.addEventListener("click", function() {
    deleteTask(this.parentElement);
    });

    modal.classList.remove("show");
    task.value="";
}

function deleteTask(taskbar){
    taskbar.remove();
}

function createNotes(){

    let notes = document.createElement("div");
    notes.className = "notes";
    
    let note=document.querySelector("#add-task2");
    notes.textContent=note.value;
    containsNotes.append(notes);

    let delbtn = document.createElement("button");
    delbtn.className="btn";
    delbtn.textContent="DELETE";
    notes.append(delbtn);

    delbtn.addEventListener("click", function() {
    deleteNotes(this.parentElement);
    });

    modal2.classList.remove("show");
    note.value="";
}

function deleteNotes(containsNotes){
    containsNotes.remove();
}

add.addEventListener("click", function()
{
    modal.classList.add("show");
})


addtask.addEventListener("click",function(){
    createTask();
    modal.classList.remove("show");
})

cancel.addEventListener("click",function(){
modal.classList.remove("show");
})


add2.addEventListener("click", function()
{
    modal2.classList.add("show");
})

addtask2.addEventListener("click",function(){
    createNotes();
    modal2.classList.remove("show");
})

cancel2.addEventListener("click",function(){
modal2.classList.remove("show");
})