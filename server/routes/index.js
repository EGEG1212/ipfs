import express from "express";
import upload from "../upload";

const router = express.Router();

router.post("/mint", upload.single("image"), (req, res, mext) => {
  console.log(req.body);
  console.log(req.file);
});

export default router;
