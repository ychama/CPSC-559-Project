import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { SECRET = "secret" } = process.env;

const loggedIn = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const userToken = req.headers.authorization.split(" ")[1];
      if (userToken) {
        const payload = await jwt.verify(userToken, SECRET);
        if (payload) {
          req.user = payload.userName;
          next();
        } else {
          res.status(400).json({ error: "Token not valid." });
        }
      } else {
        res
          .status(400)
          .json({ error: "Token cannot be read from authorization header." });
      }
    } else {
      res
        .status(400)
        .json({ error: "No authentication header existing in the request." });
    }
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
};

export default loggedIn;
