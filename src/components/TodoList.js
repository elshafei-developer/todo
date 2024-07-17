// Components
import Todo from "./Todo";

// material ui
import * as React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";

// unique id
import { v4 as uuidv4 } from "uuid";

import { todosContext } from "../contexts/todosContext";
import { useContext, useState, useEffect } from "react";

export default function TodoList() {
  const { todos, setTodos } = useContext(todosContext);
  const [titleInput, setTitleInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  const [displayedTodosType, setDisplayedTodosType] = useState("all");

  useEffect(() => {
    async function fetchData(url) {
      try {
        let data = await fetch(url);
        let todos = await data.json();

        // if the data is empty object
        if (!Array.isArray(todos)) {
          throw new Error("Data is not an array");
        }
        let todosToBeRendered = todos.slice(0, visibleCount);
        localStorage.setItem("todos", JSON.stringify(todosToBeRendered));
        setTodos(todosToBeRendered);
      } catch (error) {
        const storageTodos = JSON.parse(localStorage.getItem("todos")) ?? [];
        console.log("storageTodo", storageTodos);
        setTodos(storageTodos);
        console.error("Error fetching todos:", error);
      }
    }
    fetchData("https://jsonplaceholder.typicode.com/todos");
  }, [setTodos, visibleCount]);

  function completedTodos() {
    let completed = todos.filter((todo) => {
      return todo.completed;
    });
    return completed;
  }
  function notCompletedTodos() {
    let notCompleted = todos.filter((todo) => {
      return !todo.completed;
    });
    return notCompleted;
  }
  let todosToBeRendered = [];

  if (displayedTodosType === "completed") {
    todosToBeRendered = completedTodos();
  } else if (displayedTodosType === "non-completed") {
    todosToBeRendered = notCompletedTodos();
  } else {
    todosToBeRendered = todos;
  }

  const todosJsx = todosToBeRendered.map((todo) => {
    return <Todo key={todo.id} todo={todo} />;
  });

  function changeDisplayedType(e) {
    setDisplayedTodosType(e.target.value);
  }
  async function handleAddTodo() {
    if (!titleInput) {
      console.error("Invalid input data");
      return;
    }
    try {
      const newTodo = {
        id: uuidv4(),
        title: titleInput,
        details: "",
        completed: false,
      };
      let addTodo = await fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      if (!addTodo.ok) {
        throw new Error("cannot add todo to the server");
      }
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setTitleInput("");
    } catch (error) {
      console.error("Server Error :", error);
    }
  }
  const showMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  return (
    <Container maxWidth="sm">
      <Card
        sx={{ minWidth: 275 }}
        style={{
          maxHeight: "90vh",
          overflow: "scroll",
        }}
      >
        <CardContent>
          <Typography variant="h2" style={{ fontWeight: "bold" }}>
            المهام
          </Typography>
          <Divider />

          <ToggleButtonGroup
            style={{ marginTop: "30px" }}
            value={displayedTodosType}
            exclusive
            onChange={changeDisplayedType}
            aria-label="text alignment"
            color="primary"
          >
            <ToggleButton value="all">الكل</ToggleButton>
            <ToggleButton value="completed">المنجز</ToggleButton>
            <ToggleButton value="non-completed">غير المنجز</ToggleButton>
          </ToggleButtonGroup>

          {todosJsx}
          <Button
            style={{ marginTop: "20px" }}
            variant="contained"
            onClick={() => {
              showMore();
            }}
          >
            المزيد
          </Button>
          <Grid container style={{ marginTop: "20px" }} spacing={2}>
            <Grid
              xs={8}
              display="flex"
              justifyContent="space-around"
              alignItems="center"
            >
              <TextField
                style={{ width: "100%" }}
                id="outlined-basic"
                label="عنوان المهمة"
                variant="outlined"
                value={titleInput}
                onChange={(e) => {
                  setTitleInput(e.target.value);
                }}
              />
            </Grid>

            <Grid
              xs={4}
              display="flex"
              justifyContent="space-around"
              alignItems="center"
            >
              <Button
                style={{ width: "100%", height: "100%" }}
                variant="contained"
                onClick={() => {
                  handleAddTodo();
                }}
                disabled={titleInput.length === 0}
              >
                إضافة
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
