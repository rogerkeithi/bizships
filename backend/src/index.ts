import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/mongo-db";

dotenv.config();

const port = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Error initializing server:", error);
    process.exit(1);
  }
}

startServer();
