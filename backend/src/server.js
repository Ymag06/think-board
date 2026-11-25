import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

dotenv.config();
//app as the main server and router as a small set of routes that the server plugs in.
const app = express();
const PORT = process.env.PORT || 5001;

//middleware

//cors middleware to allow cross-origin requests from the frontend
//the frontend is running on a different port than the backend, so we need to allow cross-origin requests from the frontend.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

app.use(express.json()); //this middleware will parse JSON bodies : req.body

//rate limiter middleware to limit the number of requests from a single IP address
app.use(rateLimiter);

//our simple custom middleware
// app.use((req, res, next) => {
//   console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//   next();
// });

//connects that router to the app under the /api/notes prefix.
app.use("/api/notes", notesRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
