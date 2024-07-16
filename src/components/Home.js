import { todosContext } from "./../contexts/todosContext";
import { useState } from "react";
import TodoList from "./TodoList";

export default function Home() {
  const [todos, setTodos] = useState([]);
  return (
    <div className="App">
      <todosContext.Provider value={{ todos, setTodos }}>
        <TodoList />
      </todosContext.Provider>
    </div>
  );
}
