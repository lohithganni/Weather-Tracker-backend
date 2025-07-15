import WeatherDAO from "../dao/weatherDAO.js";

export default class UserInfoCtrl {
  static async apiGetUserLocation(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const UserLocations = await WeatherDAO.getUserLocations(user._id);
      return res.status(200).json(UserLocations);
    } catch (e) {
      console.error(`Unable to get user locations: ${e}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async apiAddLocation(req, res) {
    try {
      const user = req.user;
      const { location } = req.body;
      const locationResponse = await WeatherDAO.addLocation(user._id, location);
      if (locationResponse.error) {
        return res.status(500).json({ error: locationResponse.error });
      }
      if (locationResponse.message) {
        return res.status(200).json({ message: locationResponse.message });
      }
    } catch (e) {
      console.error(`Unable to add location: ${e}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  static async apideleteLocation(req, res) {
    try {
      const user = req.user;
      const location = req.body.location;
      if(!location) {
        return res.status(400).json({ error: "Specify a location" });
      }
      const deleteResult = await WeatherDAO.dltLocation(user._id, location);

      if (deleteResult.error) {
        return res.status(500).json({ error: deleteResult.error });
      }

      if (deleteResult.message) {
          return res.status(200).json({ message: deleteResult.message });        
      }
    } catch (e) {
      console.error(`Unable to delete location: ${e}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
