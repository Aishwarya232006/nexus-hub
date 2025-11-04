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

# Nexus Hub - Freelancer Earnings Tracker

## Phase 3: Database Integration with MongoDB Atlas

### Phase 3 Completed Tasks:

#### 1. MongoDB Atlas Setup
- Created database in MongoDB Atlas
- Configured connection string with proper authentication

#### 2. Environment Configuration
- Installed `dotenv` as dev dependency
- Created `.env` file with MongoDB URI and environment variables
- Added `.env` to `.gitignore` for security

#### 3. Database Connection Middleware
- Created `shared/middlewares/connect-db.js`
- Implemented MongoDB connection using Mongoose
- Integrated connection middleware in `server.js`

#### 4. Mongoose Schemas & Models
**Users Schema (`modules/users/users-model.js`):**
- Defined schema matching Phase 2 data structure
- Added required fields, data types, and validations
- Included timestamps (createdAt, updatedAt)

**Listings Schema (`modules/listings/listings-model.js`):**
- Created schema reflecting CSV data structure
- Added appropriate data types and constraints
- Included validation for required fields

#### 5. CRUD Operations with Mongoose
**Users Module:**
- `GET /api/users` - Get all users with search, sort, pagination
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Listings Module:**
- `GET /api/listings` - Get all listings with search, sort, pagination
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

#### 6. Enhanced Features
**Search, Sort & Pagination:**
- Implemented search across multiple fields
- Added sorting by various criteria
- Created pagination with metadata
- Built filter options endpoint

**Validation:**
- Express-validator middleware for request validation
- Custom validation rules for both users and listings
- Proper error handling for validation failures

#### 7. Testing
- Tested all CRUD operations using Postman
- Verified MongoDB connection and data persistence
- Confirmed search, sort, and pagination functionality
- Validated error handling and response formats

### API Endpoints

#### Users
- `GET /api/users` - Get all users (supports search, sort, pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Listings
- `GET /api/listings` - Get all listings (supports search, sort, pagination)
- `GET /api/listings/filters/options` - Get available filter options
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

#### System
- `GET /api/health` - Health check endpoint
- `GET /` - Root endpoint

### Technologies Used
- Node.js & Express.js
- MongoDB Atlas & Mongoose ODM
- Express Validator
- CORS middleware
- Environment variables with dotenv

### Environment Variables
```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
NODE_ENV=development
