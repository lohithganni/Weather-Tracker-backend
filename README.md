# Backend for Weather Tracker application

## Overview
**Description :** A backend RestAPI using Nodejs express framework, MongoDB MongoClient, with JWT authentication allowing users to log in, register and add, retrieve or delete saved locations in MongoDB collections.

## Dependencies:
- express, mongodb, cors, cookie-parser, jsonwebtoken, dotenv, uuid
## Dev Dependencies:
- nodemon

**Getting Started :**
1. Install dependencies with `npm install`
2. Create a `.env` file and add your MongoDB connection and Collections Names.
    
    - **WEATHER_DB_URI**: Your mongoDB URI
    - **WEATHER_NS**: MongoDB Database Name
    - **WEATHER_USERS_DB**: Name of the collection to store user data
    - **WEATHER_LOCATIONS_DB**: Name of the collection to store Locations data
    - **JWT_SECRET**: Your JWT Secret Key
3. Run the server with `npm run dev`


## API Data Schema 

### users Collection
```
{
    "_id": "string",          // Unique UUID for the user
    "username": "string",     // User's display name
    "password": "string",     // Hashed password
    "email": "string",        // User's email address
    "created_at": "Date"      // Timestamp of registration
}
```

### locations Collection

```
{
    "_id": "string",  // same as users _id
    saved_locations: ["Location info"]
}
```
## API Endpoints

### Auth Routes:

- `POST /api/login`   Takes username, password and returns a JWT as a cookie on successfully logging in.
- `POST /api/register` Takes Username, Password, Email and returns a JWT as a cookie on successfully Registering.
-  `POST /api/logout` Returns a JWT that expires immediately

### Weather Routes:
-  `GET /api/locations`  Verifies the JWT and returns the users saved_locations array from locations collection
- `PUT /api/locations`  Takes a location and adds it to the saved_locations array from locations collection
- `DELETE /api/locations` Takes a location and deletes the location present in saved_locations array from locations collection

### User Info Route:
- `GET /api/user` Verifies the JWT and sends the user info


