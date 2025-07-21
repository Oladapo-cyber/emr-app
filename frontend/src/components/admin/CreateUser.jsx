import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const CreateUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get the JWT token (ensure admin is logged in)
    if (!token) return alert("You must be logged in as admin");

    // Form Validation
    if (!username || !password || !role || !fullName) {
      return setErrorMessage("All fields are required!");
    }

    try {
      // Send POST request to create a new user
      await axios.post(
        "/admin/create-user", // Your API endpoint
        { username, password, role, fullName },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token in the header for authorization
            "Content-Type": "application/json",
          },
        }
      );
      alert("User created successfully");
      // Optionally clear the form after success
      setUsername("");
      setPassword("");
      setRole("");
      setFullName("");
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="create-user-form">
      <h2>Create New User</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          variant="outlined"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          required
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          style={{ marginBottom: "10px" }}
        />
        <FormControl fullWidth required style={{ marginBottom: "10px" }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Role"
          >
            <MenuItem value="doctor">Doctor</MenuItem>
            <MenuItem value="nurse">Nurse</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Create User
        </Button>
      </form>
    </div>
  );
};

export default CreateUser;
