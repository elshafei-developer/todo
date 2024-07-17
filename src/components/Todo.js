import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";

// material ui icons
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

import { useContext, useState } from "react";
import { todosContext } from "../contexts/todosContext";

// material dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Todo({ todo, setNotification }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updatedTodo, setUpdatedTodo] = useState({
    title: todo.title,
    details: todo.details,
  });
  const { todos, setTodos } = useContext(todosContext);

  async function handleCheckTodo() {
    try {
      let updateTodo = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            completed: !todo.completed,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      if (updateTodo.status !== 200) {
        throw new Error("cannot update todo");
      }
      const updatedTodos = todos.map((t) => {
        if (t.id === todo.id) {
          t.completed = !t.completed;
        }
        return t;
      });
      setTodos(updatedTodos);
      setNotification({
        open: true,
        message: "تم تحديث حالة المهام!",
        severity: "success",
      });
      setTimeout(() => {
        setNotification({
          open: false,
          message: "تم تحديث حالة المهام!",
          severity: "success",
        });
      }, 2000);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
    } catch (error) {
      setNotification({
        open: true,
        message: "حدث خطأ أثناء تحديث المهمة",
        severity: "error",
      });
      setTimeout(() => {
        setNotification({
          open: false,
          message: "حدث خطأ أثناء تحديث المهمة",
          severity: "error",
        });
      }, 2000);
      console.error("Server Error :", error);
    }
  }

  function handleDeleteClick() {
    setShowDeleteDialog(true);
  }

  function handleUpdateClick() {
    setShowUpdateDialog(true);
  }

  function handleDeleteDialogClose() {
    setShowDeleteDialog(false);
  }

  function handleUpdateClose() {
    setShowUpdateDialog(false);
  }

  async function handleDeleteConfirm() {
    try {
      let deletedTodo = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        {
          method: "DELETE",
        }
      );
      if (deletedTodo.status !== 200) {
        throw new Error("cannot delete todo");
      }
      const updatedTodos = todos.filter((t) => {
        return t.id !== todo.id;
      });
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setNotification({
        open: true,
        message: "تم الحذف بنجاح!",
        severity: "success",
      });
      setTimeout(() => {
        setNotification({
          open: false,
          message: "تم الحذف بنجاح!",
          severity: "success",
        });
      }, 2000);
    } catch (error) {
      setNotification({
        open: true,
        message: "حدث خطأ أثناء حذف المهمة",
        severity: "error",
      });
      setTimeout(() => {
        setNotification({
          open: false,
          message: "حدث خطأ أثناء حذف المهمة",
          severity: "error",
        });
      }, 2000);
      console.error("Server Error :", error);
    }
  }

  async function handleUpdateConfirm() {
    try {
      let updateTodo = await fetch(
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
      if (updateTodo.status !== 200) {
        throw new Error("cannot update todo");
      }
      const updatedTodos = todos.map((t) => {
        if (t.id === todo.id) {
          return {
            ...t,
            title: updatedTodo.title,
            details: updatedTodo.details,
          };
        } else {
          return t;
        }
      });
      setTodos(updatedTodos);
      setShowUpdateDialog(false);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setNotification({
        open: true,
        message: "تم تحديث المهمة بنجاح!",
        severity: "success",
      });
      setTimeout(() => {
        setNotification({
          open: true,
          message: "تم تحديث المهمة بنجاح!",
          severity: "success",
        });
      }, 2000);
    } catch (error) {
      console.error("Server Error :", error);
    }
  }

  return (
    <>
      <Dialog onClose={handleDeleteDialogClose} open={showDeleteDialog}>
        <DialogTitle id="alert-dialog-title">
          هل أنت متأكد من رغبتك في حذف المهمة؟
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
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

      <Dialog
        onClose={handleUpdateClose}
        open={showUpdateDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
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
            onChange={(e) => {
              setUpdatedTodo({ ...updatedTodo, title: e.target.value });
            }}
          />

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="التفاصيل"
            fullWidth
            variant="standard"
            value={updatedTodo.details ? updatedTodo.details : ""}
            onChange={(e) => {
              setUpdatedTodo({ ...updatedTodo, details: e.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose}>إغلاق</Button>
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
                onClick={() => {
                  handleCheckTodo();
                }}
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
                aria-label="delete"
                style={{
                  color: "#1769aa",
                  background: "white",
                  border: "solid #1769aa 3px",
                }}
              >
                <ModeEditOutlineOutlinedIcon />
              </IconButton>

              <IconButton
                className="iconButton"
                aria-label="delete"
                style={{
                  color: "#b23c17",
                  background: "white",
                  border: "solid #b23c17 3px",
                }}
                onClick={handleDeleteClick}
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
