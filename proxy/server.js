import express from "express";
import cors from "cors";

import serverRoute from "./routes/serverRoute.js";

const port = 4000;

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/api/server", serverRoute);




app.listen(port, () => console.log("Server started on port " + port));