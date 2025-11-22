import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const CreateUser = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure user is admin
    if (user?.role !== "admin") {
      return setErrorMessage("You must be logged in as admin");
    }

    // Form Validation
    if (!username || !password || !role || !fullName) {
      return setErrorMessage("All fields are required!");
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const userData = {
        firstName: fullName.split(" ")[0] || fullName,
        lastName: fullName.split(" ").slice(1).join(" ") || "",
        email: username,
        password,
        role,
        department: department || "administration",
        phone: phone || "000-000-0000",
        employeeId: `EMP${Date.now()}`,
      };

      await userService.createUser(userData);
      
      alert("User created successfully!");
      
      // Clear form
      setUsername("");
      setPassword("");
      setRole("");
      setFullName("");
      setPhone("");
      setDepartment("");
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage(error.message || "Failed to create user. Please try again.");
    } finally {
      setSubmitting(false);
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
        <TextField
          label="Phone"
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          style={{ marginBottom: "10px" }}
          placeholder="e.g., +234-123-456-7890"
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
            <MenuItem value="receptionist">Receptionist</MenuItem>
            <MenuItem value="lab_tech">Lab Technician</MenuItem>
            <MenuItem value="pharmacist">Pharmacist</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Department"
          variant="outlined"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          fullWidth
          style={{ marginBottom: "10px" }}
          placeholder="e.g., Cardiology, Emergency, etc."
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create User"}
        </Button>
      </form>
    </div>
  );
};

export default CreateUser;
