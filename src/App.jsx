import { useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  Alert,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  // =====================================================
  // BASIC TODO
  // =====================================================

  const [task, setTask] = useState("");
  const [list, setList] = useState([]);

  // =====================================================
  // EDIT
  // =====================================================

  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");

  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // VALIDATION
  // =====================================================

  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");

  // =====================================================
  // DELETE CONFIRMATION
  // =====================================================

  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  // =====================================================
  // TOAST
  // =====================================================

  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // =====================================================
  // SORTING
  // OPTIONAL
  // If sorting is NOT required, comment this state
  // and sorting section below.
  // =====================================================

  const [sortOrder, setSortOrder] = useState("");

  // =====================================================
  // PAGINATION
  // OPTIONAL
  // If pagination is NOT required, comment this section.
  // =====================================================

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // =====================================================
  // ADD INPUT
  // =====================================================

  const taskInput = (e) => {
    setTask(e.target.value);

    if (e.target.value.trim()) {
      setError("");
    }
  };

  // =====================================================
  // ADD TASK
  // =====================================================

  const taskList = () => {
    if (!task.trim()) {
      setError("Task is required");
      return;
    }

    setError("");

    const newTask = {
      id: Date.now(),
      title: task.trim(),
      completed: false,
    };

    setList([...list, newTask]);
    setTask("");

    setToastMessage("Task added successfully!");
    setToast(true);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = () => {
    setList(
      list.filter((item) => item.id !== deleteId)
    );

    setOpenDelete(false);
    setDeleteId(null);

    setToastMessage("Task deleted successfully!");
    setToast(true);
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const handleEdit = (id) => {
    const selectedTask = list.find(
      (item) => item.id === id
    );

    setEditId(id);
    setEditTask(selectedTask.title);
    setEditError("");
  };

  // =====================================================
  // EDIT INPUT
  // =====================================================

  const editInput = (e) => {
    setEditTask(e.target.value);

    if (e.target.value.trim()) {
      setEditError("");
    }
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const saveEdit = () => {
    if (!editTask.trim()) {
      setEditError("Task is required");
      return;
    }

    setList(
      list.map((item) => {
        if (item.id === editId) {
          return {
            ...item,
            title: editTask.trim(),
          };
        }

        return item;
      })
    );

    setEditId(null);
    setEditTask("");
    setEditError("");

    setToastMessage("Task edited successfully!");
    setToast(true);
  };

  // =====================================================
  // CHECKBOX
  // =====================================================

  const handleCheck = (id) => {
    setList(
      list.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            completed: !item.completed,
          };
        }

        return item;
      })
    );
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredList = list.filter((item) =>
    item.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =====================================================
  // SORTING
  // OPTIONAL
  // =====================================================

  const sortedList = [...filteredList].sort(
    (a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title);
      }

      if (sortOrder === "desc") {
        return b.title.localeCompare(a.title);
      }

      return 0;
    }
  );

  // =====================================================
  // PAGINATION
  // OPTIONAL
  // =====================================================

  const totalPages = Math.ceil(
    sortedList.length / rowsPerPage
  );

  const startIndex =
    (page - 1) * rowsPerPage;

  const paginatedList = sortedList.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <Box
      sx={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 2,
      }}
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Todo App
      </Typography>

      {/* =================================================
          ADD TASK
      ================================================= */}

      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        sx={{ mb: 3 }}
      >
        <TextField
          fullWidth
          label="Enter Task"
          value={task}
          onChange={taskInput}
          error={!!error}
          helperText={error}
        />

        <Button
          variant="contained"
          onClick={taskList}
          sx={{ height: 56 }}
        >
          Add
        </Button>
      </Stack>

      {/* =================================================
          SEARCH
      ================================================= */}

      <TextField
        fullWidth
        label="Search Task"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);

          // Reset pagination after search
          setPage(1);
        }}
        sx={{ mb: 2 }}
      />

      {/* =================================================
          SORTING
          OPTIONAL
      ================================================= */}

      <Select
        value={sortOrder}
        onChange={(e) => {
          setSortOrder(e.target.value);

          // Reset pagination after sorting
          setPage(1);
        }}
        displayEmpty
        sx={{ mb: 3 }}
      >
        <MenuItem value="">
          Sort
        </MenuItem>

        <MenuItem value="asc">
          A-Z
        </MenuItem>

        <MenuItem value="desc">
          Z-A
        </MenuItem>
      </Select>

      {/* =================================================
          TODO LIST
          
          WITH PAGINATION:
          paginatedList.map()

          WITHOUT PAGINATION:
          sortedList.map()
          
          WITHOUT SORTING:
          filteredList.map()
          
          WITHOUT SEARCH:
          list.map()
      ================================================= */}

      <Stack spacing={1}>
        {paginatedList.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              padding: 1,
              border: "1px solid #ddd",
              borderRadius: 1,
            }}
          >
            {/* =================================================
                EDIT MODE
            ================================================= */}

            {editId === item.id ? (
              <>
                <TextField
                  size="small"
                  fullWidth
                  value={editTask}
                  onChange={editInput}
                  error={!!editError}
                  helperText={editError}
                />

                <Button
                  variant="contained"
                  onClick={saveEdit}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                {/* =================================================
                    CHECKBOX
                ================================================= */}

                <Checkbox
                  checked={item.completed}
                  onChange={() =>
                    handleCheck(item.id)
                  }
                />

                {/* =================================================
                    TASK
                ================================================= */}

                <Typography
                  sx={{
                    flexGrow: 1,
                    textDecoration:
                      item.completed
                        ? "line-through"
                        : "none",
                  }}
                >
                  {item.title}
                </Typography>

                {/* =================================================
                    EDIT
                ================================================= */}

                <IconButton
                  onClick={() =>
                    handleEdit(item.id)
                  }
                >
                  <EditIcon />
                </IconButton>

                {/* =================================================
                    DELETE
                ================================================= */}

                <IconButton
                  onClick={() => {
                    setDeleteId(item.id);
                    setOpenDelete(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        ))}
      </Stack>

      {/* =================================================
          PAGINATION
          OPTIONAL
      ================================================= */}

      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) =>
              setPage(value)
            }
          />
        </Box>
      )}

      {/* =================================================
          DELETE CONFIRMATION
      ================================================= */}

      <Dialog
        open={openDelete}
        onClose={() =>
          setOpenDelete(false)
        }
      >
        <DialogTitle>
          Delete Task?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete
            this task?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpenDelete(false)
            }
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================================================
          TOAST
      ================================================= */}

      <Snackbar
        open={toast}
        autoHideDuration={3000}
        onClose={() => setToast(false)}
      >
        <Alert
          onClose={() => setToast(false)}
          severity="success"
          variant="filled"
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;