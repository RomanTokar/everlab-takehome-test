import React, { useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getResults, Result } from "./api/getResults.ts";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const transformedResults = results.map(
    ({ observationValue, observationMetric, standardHigher, standardLower }) => {
      let observationResult = "";
      if (observationValue >= standardLower && observationValue <= standardHigher) {
        observationResult = "Normal";
      }
      if (observationValue > standardHigher) {
        observationResult = "High";
      }
      if (observationValue < standardLower) {
        observationResult = "Low";
      }
      return {
        observationMetric,
        observationValue,
        observationResult,
      };
    },
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (!newFile) return;
    setFile(newFile);
    event.target.value = "";
  };

  const submitForm = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const results = await getResults(file);
      setResults(results);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          maxWidth: "100wh",
          width: 800,
        }}
      >
        {loading && <LinearProgress />}
        <Typography variant="h6">Get results</Typography>
        <div>
          <Typography variant="body1">HL7 ORU file</Typography>
          {!!file && (
            <List>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => setFile(null)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={file.name} />
              </ListItem>
            </List>
          )}
          {!file && (
            <>
              <Button
                variant="contained"
                onClick={() => {
                  inputRef.current?.click();
                }}
              >
                Upload
              </Button>
              <input type="file" ref={inputRef} hidden onChange={handleChange} />
            </>
          )}
        </div>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant={"contained"} disabled={!file} onClick={submitForm}>
            Get results
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Observation Metric</TableCell>
                <TableCell>Observation Value</TableCell>
                <TableCell>Observation Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transformedResults.map((result) => (
                <TableRow
                  key={result.observationMetric}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{result.observationMetric}</TableCell>
                  <TableCell>{result.observationValue}</TableCell>
                  <TableCell>{result.observationResult}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default App;
