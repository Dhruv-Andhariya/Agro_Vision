import dotenv from "dotenv";
dotenv.config();

const [{ default: app }, { default: connectDB }] = await Promise.all([
  import("./app.js"),
  import("./config/db.js"),
]);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});