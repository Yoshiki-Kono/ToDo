const table = document.getElementById("table")

function makeTr(data) {
  const tr = document.createElement("tr")

  for (h of data) {
    if (h == "button") {
      const bt = document.createElement("button")
      bt.textContent = "削除"
      bt.onclick = function() {
        const id = data[0]

        fetch(`/todos?id=${id}`, {
          method: 'DELETE',
        }).then((response) => {
          if (response.ok) {
            alert("削除しました")
            updateTable()
          } else {
            alert("エラー")
          }
        }).catch((err) => {
          console.log(err);
        })
      }
      tr.appendChild(bt)
    } else {
      const td = document.createElement("td")
      td.textContent = h
      tr.appendChild(td)
    }
  }

  return tr
}

function makeHeader() {
  const headers = ["id", "schedule", "limit", "operation"]
  return makeTr(headers)
}

function getTodo() {
  fetch("/todos").then((response) => {
    return response.json();
  }).then((todos) => {
    for (todo of todos) {
      let t = Object.values(todo)
      t.push("button")
      table.appendChild(makeTr(t))
    }
  }).catch((err) => {
    console.log(err);
  })
}

function createTodo() {
  const schedule = document.getElementById("schedule")
  const limit = document.getElementById("limit")

  const form = {
    Schedule: schedule.value,
    Limit: limit.value,
  }

  fetch("/todos", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  }).then(() => {
    alert("登録しました")
    updateTable()
    schedule.value = ""
    limit.value = ""
  }).catch((err) => {
    console.log(err);
  })
}

function deleteTodo() {

}

function updateTable() {
    table.innerHTML = ""
    table.appendChild(makeHeader())
    getTodo()
}

table.appendChild(makeHeader())
getTodo()

/*
window.onload = getTodoList();

const completeButton = document.getElementById('complete');
const scheduleForm = document.getElementById('schedule');
const limitForm = document.getElementById('limit');

//DBの方へ登録するデータを送る
completeButton.onclick = function() {
    const form = {};
    form.schedule = scheduleForm.value;
    form.timelimit = limitForm.value;
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
        let timelimit = element.timeLimit;
        let row = table.insertRow(-1);
        let cell = row.insertCell(-1);
        let text = document.createTextNode(schedule);
        cell.appendChild(text);
        cell = row.insertCell(-1);
        text = document.createTextNode(timelimit);
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
*/