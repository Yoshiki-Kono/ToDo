`use strict`;

const addToDoTask=document.getElementsByClassName(`ToDoTask`);
const completerButton=document.getElementById(`complete`);
const schduleForm=document.getElementById(`schedule`);
const limitForm=document.getElementById(`limit`);

const Task=deleteButton=> {
    const plusTask=deleteButton.closest(`li`);
    scheduleForm.limitForm.removeChild(Task);
};

const plusTask=Task=> {
    const taskObj=document.createElement(`li`)
    const deleteButton=document.createElement(`Button`);
    
    deleteButton.innerText=`削除`;
    deleteButton.addEventListener(`click`,()=>deleteTask(deleteButton));

    taskObj.innerText=Task;

    taskObj.append(deleteButton);
    completerButton.appendChild(taskObj);
};

