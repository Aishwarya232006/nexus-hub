# nexus-hub
NexusHub – a team marketplace web app where authenticated users can create listings, browse public listings, and see who posted each listing.

# Project Title : NexusHub

## Features
- User authentication (signup/login)
- Create listings representing team opportunities
- Browse public listings in a feed
- See who posted each listing

## License
MIT License

Nexus Hub - Phase 2: Modular Architecture Implementation
Phase 2 Implementation Summary
Completed Tasks and Features
1. Data Structure and Setup

    Created the data structure for users and listings entities

    Set up JSON file structure for data storage

    Integrated CSV data service to read from the freelancer_earnings_bd.csv file

    Defined proper data models for both users and listings

2. Modular Architecture

    Reorganized the project using feature-based modules

    Created separate modules for users and listings

    Each module has its own folder with models, routes, and middlewares

    Implemented proper separation of concerns

3. Folder Structure Created
text

modules/
├── users/
│   ├── middlewares/
│   ├── users-model.js
│   └── users-routes.js
├── listings/
│   ├── middlewares/
│   ├── listings-model.js
│   └── listings-routes.js

4. Application-Level Middlewares

    Added express.json() for parsing JSON request bodies

    Added express.urlencoded() for form data parsing

    Implemented CORS for cross-origin requests

    Created 404 Not Found handler for undefined routes

    Added error handling middleware

5. Business Logic in Models

Users Model (users-model.js):

    getAllUsers() - Gets all user records from CSV data

    getUserById(id) - Gets single user by ID

    createUser(data) - Creates new user

    updateUser(id, data) - Updates existing user

    deleteUser(id) - Deletes user

Listings Model (listings-model.js):

    getAllListings() - Gets all listing records from CSV data

    getListingById(id) - Gets single listing by ID

    createListing(data) - Creates new listing

    updateListing(id, data) - Updates existing listing

    deleteListing(id) - Deletes listing

6. Route Implementation

Users Routes:

    GET /api/v2/users - Get all users

    GET /api/v2/users/:id - Get user by ID

    POST /api/v2/users - Create new user

    PUT /api/v2/users/:id - Update user

    DELETE /api/v2/users/:id - Delete user

Listings Routes:

    GET /api/v2/listings - Get all listings

    GET /api/v2/listings/:id - Get listing by ID

    POST /api/v2/listings - Create new listing

7. Validation and Middlewares

    Added express-validator for input validation

    Created validation rules for create and update operations

    Implemented custom validation middleware

    Added route-level middlewares for each module

8. HTTP Response Handling

    Proper HTTP status codes implemented:

        200 OK for successful GET, PUT, DELETE

        201 Created for successful POST

        400 Bad Request for validation errors

        404 Not Found for missing resources

        500 Internal Server Error for server issues

    All responses return JSON format

9. CSV Data Service

    Created csvDataService.js to handle large CSV files

    Implemented efficient data loading with streams

    Added CRUD operations for CSV data

    Data transformation between CSV and application models

10. Database Integration

    Connected to MongoDB Atlas

    Set up Mongoose ODM

    Database connection middleware working

    Environment variables configured

11. Testing

    Tested all routes with Postman

    Verified CRUD operations work correctly

    Confirmed validation and error handling work

    Tested with actual CSV data

API Endpoints
Base URL: http://localhost:5000/api/v2

Users:

    GET /users

    GET /users/:id

    POST /users

    PUT /users/:id

    DELETE /users/:id

Listings:

    GET /listings

    GET /listings/:id

    POST /listings

Dependencies Added

    express-validator for input validation

    csv-parser for CSV file processing