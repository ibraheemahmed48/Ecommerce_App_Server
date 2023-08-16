// To run use (npm run dev)

const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const PORT = 3020;
const DBC =
  "mongodb+srv://ibraheemahmed836:wCLgAlbIFhsFcrAy@cluster0.cnrky3a.mongodb.net/?retryWrites=true&w=majority";

const app = express();

app.use(express.json());

app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

mongoose
  .connect(DBC)
  .then(() => {
    console.log("Connected :)");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`it's working in port ${PORT} `);
});
