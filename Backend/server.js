require("dotenv").config();
const connectDB = require("./config/DB");
const app = require("./app");

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

