import jwt from "jsonwebtoken";
// Get the secret for JWT authentication
const { SECRET = "secret" } = process.env;

const loggedIn = async (req, res, next) => {
  try {
    // Check that there is an authorization header attribute
    if (req.headers.authorization) {
      const userToken = req.headers.authorization.split(" ")[1];
      // Get the user JSON Web token
      if (userToken) {
        // If it exists, verify the JWT
        const payload = await jwt.verify(userToken, SECRET);
        if (payload) {
          req.user = payload.userName;
          next();
        } else {
          // If it is not valid, return an error
          res.status(400).json({ error: "Token not valid." });
        }
      } else {
        // If the token cannot be read, return an error

        res
          .status(400)
          .json({ error: "Token cannot be read from authorization header." });
      }
    } else {
      // If the token does not exist, return an error

      res
        .status(400)
        .json({ error: "No authentication header existing in the request." });
    }
  } catch (error) {
    // Return any errors
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
};

export default loggedIn;
