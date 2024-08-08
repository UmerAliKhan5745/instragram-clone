import express, { Request, Response ,urlencoded} from 'express';
require('./config/dbs')
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
const port = 4000;
import userRoute from "./routes/authroutes/user.route";


app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions :any= {
    origin: 4000,
    credentials: true
}
app.use(cors(corsOptions));


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript!');
});


app.use("/api/v1/user", userRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
