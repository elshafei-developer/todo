// material ui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useContext, useState } from "react";
import { todosContext } from "../contexts/todosContext";

export default function Todo({ todo, setNotification }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updatedTodo, setUpdatedTodo] = useState({
    title: todo.title,
    details: todo.details,
  });
  const { todos, setTodos } = useContext(todosContext);

  // Function to handle checking/unchecking a todo item
  const handleCheckTodo = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ completed: !todo.completed }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );

      if (!response.ok) throw new Error("Cannot update todo");

      const updatedTodos = todos.map((t) =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      );
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      triggerNotification("تم تحديث حالة المهام!", "success");
    } catch (error) {
      console.error("Server Error :", error);
      triggerNotification("حدث خطأ أثناء تحديث المهمة", "error");
    }
  };

  // Function to trigger notification
  const triggerNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
    setTimeout(() => {
      setNotification({ open: false, message, severity });
    }, 2000);
  };

  const handleDeleteClick = () => setShowDeleteDialog(true);
  const handleUpdateClick = () => setShowUpdateDialog(true);
  const handleDeleteDialogClose = () => setShowDeleteDialog(false);
  const handleUpdateDialogClose = () => setShowUpdateDialog(false);

  async function handleDeleteConfirm() {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Cannot delete todo");
      const updatedTodos = todos.filter((t) => t.id !== todo.id);

      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      triggerNotification("تم الحذف بنجاح!", "success");
    } catch (error) {
      console.error("Server Error :", error);
      triggerNotification("حدث خطأ أثناء حذف المهمة", "error");
    }
  }

  const handleUpdateConfirm = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: updatedTodo.title,
            details: updatedTodo.details,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      if (!response.ok) throw new Error("Cannot update todo");

      const updatedTodos = todos.map((t) =>
        t.id === todo.id
          ? { ...t, title: updatedTodo.title, details: updatedTodo.details }
          : t
      );
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setShowUpdateDialog(false);
      triggerNotification("تم تحديث المهمة بنجاح!", "success");
    } catch (error) {
      console.error("Server Error :", error);
      triggerNotification("حدث خطاء", "error");
    }
  };

  return (
    <>
      <Dialog onClose={handleDeleteDialogClose} open={showDeleteDialog}>
        <DialogTitle id="alert-dialog-title">
          هل أنت متأكد من رغبتك في حذف المهمة؟
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            لا يمكنك التراجع عن الحذف بعد إتمامه
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>إغلاق</Button>
          <Button autoFocus onClick={handleDeleteConfirm}>
            نعم، قم بالحذف
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog onClose={handleUpdateDialogClose} open={showUpdateDialog}>
        <DialogTitle id="alert-dialog-title">تعديل مهمة</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="عنوان المهمة"
            fullWidth
            variant="standard"
            value={updatedTodo.title}
            onChange={(e) =>
              setUpdatedTodo({ ...updatedTodo, title: e.target.value })
            }
          />

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="التفاصيل"
            fullWidth
            variant="standard"
            value={updatedTodo.details || ""}
            onChange={(e) =>
              setUpdatedTodo({ ...updatedTodo, details: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateDialogClose}>إغلاق</Button>
          <Button autoFocus onClick={handleUpdateConfirm}>
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
      <Card
        className="todoCard"
        sx={{
          minWidth: 275,
          background: "#283593",
          color: "white",
          marginTop: 5,
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={8}>
              <Typography
                variant="h5"
                sx={{
                  textAlign: "right",
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </Typography>

              <Typography variant="h6" sx={{ textAlign: "right" }}>
                {todo.details}
              </Typography>
            </Grid>

            <Grid
              xs={4}
              display="flex"
              justifyContent="space-around"
              alignItems="center"
            >
              <IconButton
                onClick={handleCheckTodo}
                className="iconButton"
                style={{
                  color: todo.completed ? "white" : "#8bc34a",
                  background: todo.completed ? "#8bc34a" : "white",
                  border: "solid #8bc34a 3px",
                }}
              >
                <CheckIcon />
              </IconButton>

              <IconButton
                onClick={handleUpdateClick}
                className="iconButton"
                aria-label="edit"
                style={{
                  color: "#1769aa",
                  background: "white",
                  border: "solid #1769aa 3px",
                }}
              >
                <ModeEditOutlineOutlinedIcon />
              </IconButton>

              <IconButton
                onClick={handleDeleteClick}
                className="iconButton"
                aria-label="delete"
                style={{
                  color: "#b23c17",
                  background: "white",
                  border: "solid #b23c17 3px",
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
