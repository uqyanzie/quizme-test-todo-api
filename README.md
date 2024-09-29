# Quizme Todo App Test 

Author : Uqyanzie Bintang

## Description
This is a simple todo app that allows users to create, read, update, and delete todo items. The app is built using Node.js, Express, and MongoDB.

## Features
1. User registration & authentication with email OTP verification
2. Create, read, update, and delete todo items
3. Todo items are private to the user who created them, retrieved using the user's JWT
4. Todo items filter by done status, search by title, and pagination

## Installation
1. Clone the repository: `git clone https://github.com/your-repo.git`
2. Install dependencies: `npm install`

## Configuration
1. Create a `.env` file in the root directory.
2. Add the necessary environment variables to the `.env` file. For example:
    ```
   DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=123456
    DB_NAME=todo_db
    DB_PORT=27017

    NODE_DOCKER_PORT=8080

    MONGODB_USER=root
    MONGODB_PASSWORD=123456
    MONGODB_DATABASE=todo_db
    MONGODB_LOCAL_PORT=27017
    MONGODB_DOCKER_PORT=27017

    MAIL_HOST=your-smtp-server
    MAIL_PORT=587
    MAIL_USER=your-email-address
    MAIL_PASS=your-email-password

    NODE_LOCAL_PORT=6868
    NODE_DOCKER_PORT=8080
    ```

## Database Setup
1. Run the following command to start the database container: `docker-compose up -d`

## Running the Project
1. Run the project: `npm start`
2. Access the project in your browser at `http://localhost:${PORT}`

## Running Tests
1. Run the tests: `npm test`

## Test Coverage
Test endpoints for authentication functionality