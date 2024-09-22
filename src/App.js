import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Validate JSON
  const validateJson = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateJson(jsonInput)) {
      setError("Invalid JSON format.");
      return;
    }

    setError("");

    const payload = {
      data: JSON.parse(jsonInput),
      options: selectedOptions,
    };

    try {
      const res = await axios.post("/api/process", payload);
      setResponseData(res.data);
    } catch (err) {
      setError("Error calling backend API.");
      console.error(err);
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (e) => {
    setSelectedOptions(e.target.value);
  };

  // Display response
  const renderResponse = () => {
    if (!responseData) return null;
    return <pre>{JSON.stringify(responseData, null, 2)}</pre>;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>JSON Form Application</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="API Input"
          fullWidth
          multiline
          rows={4}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"data": ["A", "1", "b", "2", "C"]}'
          variant="outlined"
          margin="normal"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Multi Filter</InputLabel>
          <Select
            multiple
            value={selectedOptions}
            onChange={handleDropdownChange}
            label="Multi Filter"
            renderValue={(selected) => selected.join(", ")}
          >
            <MenuItem value="Alphabets">Alphabets</MenuItem>
            <MenuItem value="Numbers">Numbers</MenuItem>
            <MenuItem value="Highest Lowercase Alphabet">
              Highest Lowercase Alphabet
            </MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "#0b72b9",
            color: "#fff",
            marginTop: "10px",
          }}
        >
          Submit
        </Button>
      </form>

      {responseData && (
        <Box mt={3}>
          <h3>Response</h3>
          {renderResponse()}
        </Box>
      )}
    </div>
  );
};

export default App;
