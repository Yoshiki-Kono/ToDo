window.onload = getTodoList();

const completeButton = document.getElementById('complete');
const scheduleForm = document.getElementById('schedule');
const limitForm = document.getElementById('limit');

//DBの方へ登録するデータを送る
completeButton.onclick = function() {
    const form = {};
    form.scheduleForm = scheduleForm.value;
    form.limitform = limitForm.value;
    const JsonData = JSON.stringify(form);
    fetch("/register", {
        method : "post",
        body : JsonData
    }).then(response => {
        if (response.status === 200) {
            alert('test');
            getTodoList();
        }
    });
};

//DBから表示する為のデータを受け取る
function getTodoList() {
    fetch("/display")
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
      }).then(todoList => {
        const table = document.getElementById(`tourokuyotei`);
        while (table.rows[0]) {
          table.deleteRow(0);
        }
        todoList.forEach(function(element) {
        let id = element.id;
        let schedule = element.schedule;
        let timeLimit = element.timeLimit;
        let row = table.insertRow(-1);
        let cell = row.insertCell(-1);
        let text = document.createTextNode(schedule);
        cell.appendChild(text);
        cell = row.insertCell(-1);
        text = document.createTextNode(timeLimit);
        cell.appendChild(text);
        cell = row.insertCell(-1);
        let button = document.createElement("button");
        button.type = "button";
        button.value = id;
        button.innerText = "削除";
        cell.appendChild(button);
        button.addEventListener("click", deleteTodo, false);
          });
        });
}

//DBから削除したデータを受け取る
function deleteTodo(event) {
    const val = event.target.value;
    const form = { id : val };
    const JsonData = JSON.stringify(form);
    fetch("/remove" , {
        method : "post",
        body : JsonData
    }).then(response => {
        if (response.status === 200) {
              alert("削除");
              getTodoList();
            };
    });
};