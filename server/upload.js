import multer from "multer";
import path from "path";

//이미지에서 multer로 buffer를 뽑아서 storage에 저장
const upload = multer({
  storage: multer.memoryStorage(),
});

export default upload;
