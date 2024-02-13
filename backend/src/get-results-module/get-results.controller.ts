import express from "express";
import { getResults } from "./get-results.service";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.post("/get-results", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).send("HL7 ORU file is required");
    return;
  }
  const results = await getResults(req.file);
  res.send(results);
});

export default router;
