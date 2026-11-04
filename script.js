let timer=document.querySelector(".circle");
let start=document.querySelector("#start");
let pause=document.querySelector("#pause");
let resume=document.querySelector("#resume");
let reset=document.querySelector("#reset");

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
let taskDueDate = document.querySelector("#task-due-date");

let cancel2=document.querySelector("#cancel-btn");
let addtask2=document.querySelector("#add-btn");

let clickTasks=document.querySelector("#tasks");
let clickNotes=document.querySelector("#notes");
let clickHabits=document.querySelector("#habits");

let focus = document.querySelector("#focus");
let shortBreak = document.querySelector("#short");
let longBreak = document.querySelector("#long");

getDailyQuote();
async function getDailyQuote() {
    try {
        let response = await fetch("https://dummyjson.com/quotes/random");

        let data = await response.json();

        let quote=data.quote;
        let author=data.author;

        document.querySelector("#quote").textContent = quote;
        document.querySelector("#author").textContent =`Author: ${author}`;

    } 
    catch (error) {
        console.error("Error fetching quote:", error);
    }
}

getDailyQuote();

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

let time=25*60;
let interval;
//function for time update
function updateTimer()
{
    let min=Math.floor(time/60);
    let sec=time%60;

    timer.textContent=`${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

let hasStarted = false;
function runTimer() {
    if (interval) return;

    interval = setInterval(function () {
        if (time > 0) {
            time--;
            updateTimer();
        } else {
            clearInterval(interval);
            interval = null;
        }
    }, 1000);
}

start.addEventListener("click", function () {
    clearInterval(interval);
    interval = null;

    time = 25 * 60;
    updateTimer();
    hasStarted = true;
    runTimer();
});

pause.addEventListener("click",function()
{
    clearInterval(interval);
    interval=null;
})

resume.addEventListener("click",function()
{
    if (!hasStarted || interval) 
        return;
    runTimer();
})

reset.addEventListener("click",function()
{
    clearInterval(interval);
    interval=null;
    time=25*60;
    hasStarted = false;
    updateTimer();
})

function changeMode(minutes) {
    clearInterval(interval);
    interval = null;

    time = minutes * 60;
    hasStarted = false;

    updateTimer();
}

focus.addEventListener("click", function () {
    changeMode(25);
});

shortBreak.addEventListener("click", function () {
    changeMode(5);
});

longBreak.addEventListener("click", function () {
    changeMode(15);
});


let date = new Date();

let currYear = date.getFullYear();
let currMonth = date.getMonth();

let monthYear = document.querySelector("#month-year");
let calendarDates = document.querySelector("#calendar-dates");

function renderCalendar() {

    // First day of the month
    let firstDay = new Date(currYear, currMonth, 1).getDay();

    // Total days in the month
    let lastDate = new Date(currYear, currMonth + 1, 0).getDate();

    // Month and year heading
    let monthName = new Date(currYear, currMonth)
        .toLocaleString("default", { month: "long" });

    monthYear.textContent = `${monthName} ${currYear}`;

    calendarDates.innerHTML = "";

    // Empty spaces before the first date
    for (let i = 0; i < firstDay; i++) {
        let empty = document.createElement("div");
        empty.classList.add("empty");
        calendarDates.append(empty);
    }

    // Generate all dates
    for (let i = 1; i <= lastDate; i++) {

        let day = document.createElement("div");
        day.textContent = i;
        
day.addEventListener("click", function() {

    let selectedDate =
        `${currYear}-${String(currMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

    showTasksForDate(selectedDate);

});

        // Highlight today's date
        let today = new Date();

        if (
            i === today.getDate() &&
            currMonth === today.getMonth() &&
            currYear === today.getFullYear()
        ) {
            day.classList.add("today");
        }

        calendarDates.append(day);
    }
}


function showTasksForDate(selectedDate) {

    let dayTasks = tasks.filter(task => task.dueDate === selectedDate);

    let heading = document.querySelector("#selected-date-heading");
    let taskList = document.querySelector("#date-task-list");

    heading.textContent = `Tasks for ${selectedDate}`;
    taskList.innerHTML = "";

    if (dayTasks.length === 0) {
        taskList.textContent = "No tasks scheduled for this date ✨";
        return;
    }

    dayTasks.forEach(task => {

        let taskItem = document.createElement("div");
        taskItem.className = "calendar-task";

        let taskName = document.createElement("span");
        taskName.textContent = task.text;

        if (task.completed) {
            taskName.style.textDecoration = "line-through";
        }

        taskItem.append(taskName);
        taskList.append(taskItem);

    });
}


renderCalendar();


let prevMonth = document.querySelector("#prev-month");
let nextMonth = document.querySelector("#next-month");

prevMonth.addEventListener("click", function() {
    currMonth--;

    if (currMonth < 0) {
        currMonth = 11;
        currYear--;
    }

    renderCalendar();
});

nextMonth.addEventListener("click", function() {
    currMonth++;

    if (currMonth > 11) {
        currMonth = 0;
        currYear++;
    }

    renderCalendar();
});


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

let searchTask = document.querySelector("#search-task");
let filterTask = document.querySelector("#filter-task");
let tasks = JSON.parse(localStorage.getItem("tasks"))||[];

tasks=tasks.map(task=>
    typeof task === "string" ? {text:task, completed: false}:task
)
saveTasks();

    function displayTask() {
    container.innerHTML = "";
    let searchValue = searchTask.value.toLowerCase();
    let filterValue = filterTask.value;

    tasks.forEach((task,index)=> {
        
        // Searching condition
        let matchesSearch = task.text.toLowerCase().includes(searchValue);

        // Filter condition
        let matchesFilter =
            filterValue === "all" ||
            (filterValue === "completed" && task.completed) ||
            (filterValue === "pending" && !task.completed);

        // Skip tasks that don't match
        if (!matchesSearch || !matchesFilter) {
            return;
        }

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
            displayTask();
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

searchTask.addEventListener("input", displayTask);
filterTask.addEventListener("change", displayTask);

    function createTask()
    {
        let task=document.querySelector("#add-task");
        let value=task.value.trim();
        let dueDate = taskDueDate.value;
        if(value==="")
            return;

        tasks.push({
            text:value,
            completed:false,
            dueDate:dueDate || null
        })

        saveTasks();
        displayTask();
        updateProgress();
        modal.classList.remove("show");
        task.value="";
        taskDueDate.value = "";
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
        let today = getTodayDate();
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
        console.log(habit.completedDates);
        console.log(getTodayDate());
});
checkbox.checked = habit.completedDates.includes(getTodayDate()
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

function calculateStreaks(habit) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentDate = new Date(today);

    if (!habit.completedDates.includes(getTodayDate())) {
        currentDate.setDate(currentDate.getDate() - 1);
    }

    let streak = 0;

    while (habit.completedDates.includes(formatLocalDate(currentDate))) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
}

function formatLocalDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getTodayDate() {
    let date = new Date();

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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