`use strict`;

const addToDoTask=document.getElementsByClassName(`ToDoTask`)[0];
const completeButton=document.getElementById(`complete`);
const scheduleForm=document.getElementById(`schedule`);
const limitForm=document.getElementById(`limit`);

const deleteTask=deleteButton=> {
    const plusTask=deleteButton.closest(`li`);
    scheduleForm.limitForm.removeChild(plusTask);
};

const plusTask=Task=> {
    const taskObj=document.createElement(`li`)
    const deleteButton=document.createElement(`Button`);
    
    deleteButton.innerText=`削除`;
    deleteButton.addEventListener(`click`,()=>deleteTask(deleteButton));

    taskObj.innerText=Task;

    taskObj.append(deleteButton);
    completeButton.appendChild(taskObj);
};

addToDoTask.addEventListener(`click`, event=>){
    const Task=schduleForm.Value;
    const Task=limitForm.Value;
    plusTask(Task);
    scheduleForm.Value=``;
    limitForm.value=``;
});
