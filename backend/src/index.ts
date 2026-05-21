import dotenv from "dotenv";
import app from "./app";

dotenv.config();
const port = process.env.PORT || 3000;
const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error initializing server:", error);
    process.exit(1);
  }
};

startServer();
