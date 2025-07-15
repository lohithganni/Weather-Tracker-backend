import WeatherDAO from "../dao/weatherDAO.js";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
export default class LoginCtrl {
  static async apiLogin(req, res) {
    try {
      const { username, password } = req.body;
      const hash = crypto.createHash("sha256");
      hash.update(password);
      const hexhash = hash.digest("hex");

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }
      const userexist = await WeatherDAO.getUser(username);
      const existingUser = await WeatherDAO.loginUser(username, hexhash);
      if (existingUser) {
        generateToken(res, existingUser._id);
        return res.status(200).json({ status: "User found successfully" });
      } else if (userexist && !existingUser) {
        return res.status(404).json({ error: "incorrect password" });
      } else {
        return res.status(404).json({ error: "Username doesn't exist, retry or try registering" });
      }
    } catch (e) {
      console.error(`Unable to find user: ${e}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async apiLogout(req, res) {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
  }

  static async apiRegister(req, res) {
    try {
      const { username, password, email } = req.body;
      const hash = crypto.createHash("sha256");
      hash.update(password);
      const hexhash = hash.digest("hex");
      if (!username || !password || !email) {
        return res.status(400).json({ error: "Missing Required Field" });
      }
      const userexist = await WeatherDAO.getUser(username);
      const useremail = await WeatherDAO.getUserByEmail(email);
      if (userexist) {
        return res.status(400).json({ error: "Username taken" });
      } else if (useremail) {
        return res
          .status(400)
          .json({ error: "Email already registered. Try logging in." });
      }
      const result = await WeatherDAO.registerUser(username, hexhash, email);
      if (result.error) {
        return res.status(500).json({ error: result.error });
      }
      generateToken(res, result.insertedId);
      return res
        .status(201)
        .json({ status: "User registered successfully"});
    } catch (e) {
      console.error(`Unable to register user: ${e}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
