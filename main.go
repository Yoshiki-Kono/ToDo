package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

type Todo struct {
	ID        int    `json:"id"`
	Schedule  string `json:"schedule"`
	TimeLimit string `json:"limit"`
}

func getTodo(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("select * from todos")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	todos := []Todo{}

	for rows.Next() {
		var (
			id       int
			schedule string
			limit    string
		)

		if err := rows.Scan(&id, &schedule, &limit); err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		todos = append(todos, Todo{id, schedule, limit})
	}

	if err := json.NewEncoder(w).Encode(&todos); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}

func createTodo(w http.ResponseWriter, r *http.Request) {
	var todo Todo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	if _, err := db.Exec("insert into todos (schedule, limit) values (?, ?)", todo.Schedule, todo.TimeLimit); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}

func deleteTodo(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "no id", 400)
		return
	}

	if _, err := db.Exec("delete from todos where id = ?", id); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}

func main() {
	var err error
	db, err = sql.Open("mesql", "root:0111@/todo")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if _, err := db.Exec("create table if not exists todos (id integer primary key autoincrement, schedule varchar(255), timelimit varchar(255))"); err != nil {
		log.Fatal(err)
	}

	http.Handle("/", http.FileServer(http.Dir(".")))
	http.HandleFunc("/todos", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			getTodo(w, r)
		case http.MethodPost:
			createTodo(w, r)
		case http.MethodDelete:
			deleteTodo(w, r)
		}
	})
	log.Println("start http server :8880")
	log.Fatal(http.ListenAndServe(":8880", nil))
}

/*
package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type todoList []todo

var dbConn *sql.DB

//var db *sql.DB

//構造体一覧
type todo struct {
	ID        string `db:"id" json:"id"`
	Schedule  string `db:"schedule" json:"schedule"`
	TimeLimit string `db:"timelimit" json:"timeLimit"`
}

func connect() (db *sql.DB, err error) {
	dbConn, err := sql.Open("mysql", "root:0111@/todo")
	if err != nil {
		log.Println(err)
	}
	return dbConn, err
}

func main() {
	db, err := connect()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	dbConn = db
	http.Handle("/", http.FileServer(http.Dir("indexToDo")))
	http.HandleFunc("/register", register)
	http.HandleFunc("/display", display)
	http.HandleFunc("/remove", remove)
	log.Fatal(http.ListenAndServe(":8880", nil))
}

//予定登録時の処理
func register(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("mysql", "root:0111@/todo")
	if err != nil {
		return
	}
	defer db.Close()

	form := todo{}
	if err := json.NewDecoder(r.Body).Decode(&form); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	schedule := form.Schedule
	timeLimit := form.TimeLimit

	stmt, err := dbConn.Prepare("INSERT INTO trn_todo(schedule, timelimit) VALUES(?,?)")
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(schedule, timeLimit)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
}

//DBの内容を一覧表示させる
func display(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("mysql", "root:0111@/todo")
	if err != nil {
		return
	}
	defer db.Close()

	todoList := todoList{}
	rows, err := dbConn.Query("SELECT id, schedule, timelimit FROM trn_todo")
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	for rows.Next() {
		todo := todo{}
		err := rows.Scan(&todo.ID, &todo.Schedule, &todo.TimeLimit)
		if err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		todoList = append(todoList, todo)
	}
	defer rows.Close()

	JSONTodoList, err := json.Marshal(todoList)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(JSONTodoList)
}

func remove(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("mysql", "root:0111@/todo")
	if err != nil {
		return
	}
	defer db.Close()

	form := todo{}
	if err := json.NewDecoder(r.Body).Decode(&form); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	targetID := form.ID

	stmt, err := dbConn.Prepare("DELETE FROM trn_todo WHERE id = ?")
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(targetID)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
}
*/
