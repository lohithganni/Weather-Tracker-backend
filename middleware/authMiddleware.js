import jwt from 'jsonwebtoken';
import WeatherDAO from "../dao/weatherDAO.js";

const protect = async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await WeatherDAO.getUserById(decoded.userId);
      if(user) delete user.password; // Remove password from user object
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ error: 'Not authorized, try logging in' });
  }
};

export { protect };
