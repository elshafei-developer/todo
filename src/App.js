import "./App.css";
import { todosContext } from "./contexts/todosContext";
import PostList from "./components/PostList";
import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  return (
    <div className="App">
      <todosContext.Provider value={{ todos, setTodos }}>
        <PostList />
      </todosContext.Provider>
    </div>
  );
}

export default App;
