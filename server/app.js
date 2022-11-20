import express from "express";
import cors from "cors";
const app = express();
import upload from "./upload";
// import router from "./routes/index";
import { create as ipfsHttpClient } from "ipfs-http-client";

app.set("port", 4000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOption = {
  origin: "http://localhost:3000",
  methods: "POST,PUT,DELETE,GET",
  credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
  optionsSuccessStatus: 200,
};

app.use(cors(corsOption));
// app.use("/", router);

const ipfs = ipfsHttpClient("/ip4/127.0.0.1/tcp/5001");

const imgUpload = async (img) => {
  if (!Buffer.isBuffer(img)) return null;
  const addFile = await ipfs.add(img);
  const initUri = "https://ipfs.io/ipfs/";
  const mkUrl = initUri + addFile.cid;
  return mkUrl;
};

const jsonUpload = async (json) => {
  if (!json) return null;
  const addFile = await ipfs.add(json);
  const initUri = "https://ipfs.io/ipfs/";
  const mkUrl = initUri + addFile.cid;
  return mkUrl;
};

app.post("/mint", upload.single("image"), async (req, res, next) => {
  try {
    const { name, description, attributes } = req.body;
    const file = req.file;

    if (true) {
      const imgURI = await imgUpload(file ? file.buffer : file);
      console.log("imgURI", imgURI);
      const details = {
        name: name,
        description: description,
        image: imgURI,
        attributes: attributes,
      };
      const jsonData = JSON.stringify(details);
      const tokenURI = await jsonUpload(jsonData);
      console.log(tokenURI);
      return res.status(200).json({
        status: true,
        message: "success",
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Not enough tokens",
        tokenBalance,
      });
    }
  } catch (err) {
    next(err);
  }
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(400).send("Something broke!");
});

app.use((req, res, next) => {
  return res.status(404).send("invalid path");
});

app.listen(app.get("port"), () => {
  console.log(`✅ Server running on http://localhost:${app.get("port")}`);
});

export default app;
