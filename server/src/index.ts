import express, { Request, Response, urlencoded } from 'express';
const app = express();
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/authroutes/user.route";
import postRoute from './routes/post/post.route';
import './models/comment.model'; // Ensure this is imported before your routes
import './models/post.model';
import messageRoute from './routes/message/message.route';
require('./config/dbs')
dotenv.config();
const port = process.env.PORT || 4000;


app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions: any = {
  origin: 5000,
  credentials: true
}
app.use(cors(corsOptions));


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript!');
});


app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
