const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL) // так використовується .env
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log(err));

app.get("/api/test", () => console.log("test is successful")); // так записують ендпоінти, дані виведуться в терміналі а не у браузері

app.use(cors());
app.use(express.json()); // дозволяє приймати json, без цього рядка postman видає 404
app.use("/api/users", userRoute); // додасть в кінці userRoute --> /usertest, тобто буде /api/users/usertest, дані виведуться в браузері а не в терміналі
app.use("/api/auth", authRoute); // додасть в кінці authRoute -->  /register, тобто буде /api/auth/register, дані виведуться в браузері а не в терміналі
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 5001, () => {
  console.log("Backend server is running");
});
