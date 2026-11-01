let container = document.querySelector("#containsTasks");
let containsNotes=document.querySelector("#containsNotes");
let habits=document.querySelector(".habits");
let add=document.querySelector(".btn-add");
let add2=document.querySelector(".add-note");
let add3=document.querySelector(".add-btn-habit")

let modal=document.querySelector(".modal");
let modal2=document.querySelector(".modal2");
let modal3=document.querySelector(".modal3");

let cancel=document.querySelector(".cancel-btn");
let addtask=document.querySelector(".add-btn");

let cancel2=document.querySelector("#cancel-btn");
let addtask2=document.querySelector("#add-btn");

let clickTasks=document.querySelector("#tasks");
let clickNotes=document.querySelector("#notes");
let clickHabits=document.querySelector("#habits");

clickTasks.addEventListener("click",function()
{
document.querySelector("#tasks-section").scrollIntoView({
    behavior: "smooth"
});
})
clickNotes.addEventListener("click",function()
{
document.querySelector("#notes-section").scrollIntoView({
    behavior: "smooth"
});
})
clickHabits.addEventListener("click",function()
{
document.querySelector("#habits-section").scrollIntoView({
    behavior: "smooth"
});
})

function updateProgress()
{
    let completed=tasks.filter(task=>task.completed).length;
    let total=tasks.length;

    let count=document.querySelector("#task-count");
    let progress=document.querySelector("#progress-fill");

    count.textContent=`${completed}/${total} completed`;

    let percentage= total===0?0:(completed/total)*100;
    progress.style.width=percentage+"%";
}


let tasks = JSON.parse(localStorage.getItem("tasks"))||[];

tasks=tasks.map(task=>
    typeof task === "string" ? {text:task, completed: false}:task
)

    function displayTask() {
    container.innerHTML = "";

    tasks.forEach((task,index)=> {
        
        let taskbar=document.createElement("div");
        taskbar.className="taskbar";
    
        let taskContent=document.createElement("div");
        taskContent.className="tasks";
    
        let checkbox = document.createElement("input");
        checkbox.type="checkbox";
        checkbox.id = "task-" + index;
        checkbox.checked=task.completed;
    
        let label = document.createElement("label");
        label.textContent=task.text;
        label.htmlFor = checkbox.id;

        if (task.completed) {
            label.style.textDecoration = "line-through";
        }

        taskContent.append(checkbox,label);
        taskbar.append(taskContent);
    
        //updating completion status
        checkbox.addEventListener("change",function(){
            tasks[index].completed=checkbox.checked;
            saveTasks();
            updateProgress();

            label.style.textDecoration = checkbox.checked
                ? "line-through"
                : "none";
        })

        let delbtn = document.createElement("button");
        delbtn.className="btn";
        delbtn.textContent="DELETE";
        
        delbtn.addEventListener("click", function() {
            deleteTask(index);
        });
        
        taskbar.append(delbtn);
        container.append(taskbar);
    });
}

    function createTask()
    {
        let task=document.querySelector("#add-task");
        let value=task.value.trim();
        if(value==="")
            return;

        tasks.push({
            text:value,
            completed:false
        })

        saveTasks();
        displayTask();
        updateProgress();
        modal.classList.remove("show");
        task.value="";
    }
function saveTasks()
{
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

function deleteTask(index){
    tasks.splice(index, 1);
    saveTasks();
    displayTask();
    updateProgress();
}
displayTask();
updateProgress();

//same goes for notes

let notes=JSON.parse(localStorage.getItem("notes"))||[];

function createNotes(){

    let note=document.querySelector("#add-task2");
    let value=note.value.trim();
    
    if(value==="")
        return;
    
    notes.push(value);
    saveNotes();
    displayNotes();

    modal2.classList.remove("show");
    note.value="";
}

function displayNotes() {
    containsNotes.innerHTML = "";

    notes.forEach((note, index) => {

        // Create notesElem
    let notesElem = document.createElement("div");
    notesElem.className = "notes";

        // Set note text
        notesElem.textContent = note;

        // Create delete button
    let delbtn = document.createElement("button");
    delbtn.className="btn";
    delbtn.textContent="DELETE";

        // Delete button should call deleteNotes(index)
    delbtn.addEventListener("click", function() {
    deleteNotes(index);
    });
        // Append everything to containsNotes
    notesElem.append(delbtn);
    containsNotes.append(notesElem);
    });
}
displayNotes();

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function deleteNotes(index) {
    notes.splice(index, 1);
    saveNotes();
    displayNotes();
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

add3.addEventListener("click",function(){
    modal3.classList.add("show");
})

cancel2.addEventListener("click",function(){
modal2.classList.remove("show");
})

let habitList=JSON.parse(localStorage.getItem("habits"))||[];
habitList=habitList.map(habit => typeof habit ==="string"?{text:habit,completedDates:[]}:habit);
function createHabit()
{
    let habitElem=document.querySelector("#add-habit");
    let value=habitElem.value.trim();
    if(value==="")
        return;
    habitList.push({
        text:value,
        completedDates:[]
    });
    habitElem.value = "";
    saveHabits();
    displayHabits();
}

function displayHabits()
{
habits.innerHTML="";
habitList.forEach((habit,index)=>
{
    let habitContainer=document.createElement("div");
    habitContainer.className="habit-container";
    let habitElement=document.createElement("div");
    habitElement.className="habit";
    habitElement.textContent = habit.text;
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    checkbox.addEventListener("change", function() {
        let today = new Date().toISOString().split("T")[0];
        if(checkbox.checked)
        {
            habit.completedDates.push(today);
            saveHabits();
            displayHabits();
        }
        else
        {
            habit.completedDates = habit.completedDates.filter(date => date !== today);
            saveHabits();
            displayHabits();
        }
});
checkbox.checked = habit.completedDates.includes(
new Date().toISOString().split("T")[0]
);

    let streaks=document.createElement("div");
    let streak=calculateStreaks(habit);
    streaks.textContent=`${streak}🔥`;
    streaks.className="streaks";
    
    // Create delete button
    let delbtn = document.createElement("button");
    delbtn.className="btn";
    delbtn.textContent="DELETE";
    
    // Delete button should call deleteNotes(index)
    delbtn.addEventListener("click", function() {
        deleteHabits(index);
    });
    // Append everything to habits

    
    habitContainer.appendChild(checkbox);
    habitContainer.appendChild(habitElement);
    habitContainer.appendChild(streaks);
    habitContainer.append(delbtn);
    habits.appendChild(habitContainer);
    });
}
function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habitList));
}

function calculateStreaks(habit){
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak=0;
    let currentDate = new Date(today);
    while (habit.completedDates.includes(currentDate.toISOString().split("T")[0]))
        {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
        return streak;
}

displayHabits();

let addBtnHabit=document.querySelector("#add-btn3");
addBtnHabit.addEventListener("click",function(){
    createHabit();
    modal3.classList.remove("show");
})

let cancelBtn=document.querySelector("#cancel-btn3");
cancelBtn.addEventListener("click", function() {
    modal3.classList.remove("show");
});

function deleteHabits(index)
{
    habitList.splice(index, 1);
    saveHabits();
    displayHabits();
}