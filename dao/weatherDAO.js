import { v4 as uuidv4 } from "uuid";
let users;
let locations;

export default class WeatherDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      locations = await conn
        .db(process.env.WEATHER_NS)
        .collection(process.env.WEATHER_LOCATIONS_DB);
      users = await conn
        .db(process.env.WEATHER_NS)
        .collection(process.env.WEATHER_USERS_DB);
      console.log("users, locations fetched");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in WeatherDAO: ${e}`
      );
    }
  }

  static async registerUser(name, pass, email) {
    try {
      const userId = uuidv4(); // Generate a unique user ID
      const user = {
        _id: userId,
        username: name,
        password: pass,
        email: email,
        created_at: new Date(),
      };
      const location = {
        _id: userId,
        saved_location: [],
      };

      await users.insertOne(user);
      await locations.insertOne(location);
      return { success: true, _id: userId };
    } catch (e) {
      console.error(`Unable to add user: ${e}`);
      return { success: false, error: "Failed to register user" };
    }
  }

  static async loginUser(username, password) {
    try {
      const user = await users.findOne({
        username: username,
        password: password,
      });
      return user;
    } catch (e) {
      console.error(`Unable to get user: ${e}`);
      return null;
    }
  }

  static async getUser(username) {
    try {
      const user = await users.findOne({ username: username });
      return user;
    } catch (e) {
      console.error(`Unable to get user: ${e}`);
      return null;
    }
  }

  static async getUserById(userId) {
    try {
      const user = await users.findOne({ _id: userId });
      return user;
    } catch (e) {
      console.error(`Unable to get user by ID: ${e}`);
      return null;
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await users.findOne({ email: email });
      return user;
    } catch (e) {
      console.error(`Unable to get user by email: ${e}`);
      return null;
    }
  }

  static async addLocation(userId, location) {
    try {
      const updateResponse = await locations.updateOne(
        { _id: userId },
        { $addToSet: { saved_location: location } }
      );
      if (updateResponse.matchedCount === 0) {
        return { error: "User not found" };
      }

      if (updateResponse.modifiedCount === 0) {
        return { message: "Location already exists in saved locations" };
      }
      return { message: "Location added successfully" };
    } catch (e) {
      console.error(`Unable to add location: ${e}`);
      return { error: "Failed to add location" };
    }
  }

  static async getUserLocations(userId) {
    try {
      const user = await locations.findOne({ _id: userId });
      if (!user) {
        return { error: "User not found" };
      }
      return user.saved_location;
    } catch (e) {
      console.error(`Unable to get user locations: ${e}`);
      return { error: "Failed to get user locations" };
    }
  }

  static async dltLocation(userId, location) {
    try {
      const updateResponse = await locations.updateOne(
        { _id: userId },
        { $pull: { saved_location: location } }
      );

      if (updateResponse.matchedCount === 0) {
        return { error: "User not found" };
      }

      if (updateResponse.modifiedCount === 0) {
        return { message: "Location not found in saved locations" };
      }

      return { message: "Location deleted successfully" };
    } catch (e) {
      console.error(`Unable to delete location: ${e}`);
      return { error: "Failed to delete location" };
    }
  }
}
