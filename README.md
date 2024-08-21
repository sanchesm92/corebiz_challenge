# Task Management API

This project is a simple API for managing tasks, built using NestJS, Prisma ORM, and MySQL. It provides endpoints for creating, retrieving, updating, and deleting tasks, as well as user registration and authentication.

## Table of Contents
- [Endpoints](#endpoints)
- [Authentication and Authorization](#authentication-and-authorization)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [Swagger Documentation](#swagger-documentation)
- [CI/CD Pipeline](#cicd-pipeline)
- [Testing](#testing)

## Endpoints

### Default

- **GET /** - Check if the API is running.

### Tasks

- **POST /tasks** - Create a new task.
- **GET /tasks** - Retrieve all tasks for the authenticated user.
- **GET /tasks/{id}** - Retrieve a specific task by ID.
- **PATCH /tasks/{id}** - Update a specific task by ID.
- **DELETE /tasks/{id}** - Delete a specific task by ID.

### Users

- **POST /users** - Register a new user.

### Auth

- **POST /auth** - Authenticate user and retrieve JWT token.

## Authentication and Authorization

The API has a built-in system for authentication and authorization. You must be authenticated to interact with most endpoints.

- **Authentication:** Users need to log in via the `/auth` endpoint to receive a JWT token.
- **Authorization:** The JWT token must be included in the `Authorization` header as a Bearer token for all subsequent requests to protected endpoints.

Password hashing is handled by `bcrypt` to ensure that user passwords are securely stored.

## Running the Project

To run the project locally, you will need Docker and Docker Compose installed. Follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-management-api.git
   cd task-management-api

2. Create a .env file in the root directory with the following content:
    ```env
    DATABASE_URL="mysql://root:root@mysql:3306/corebiz_challenge"
    MYSQL_ROOT_PASSWORD=root
    MYSQL_DATABASE=corebiz_challenge

3. Start the application using Docker Compose:

   ```bash
   docker-compose up

4. The API will be available at http://localhost:3000.

## Environment Variables

The project requires a .env file with the following variables:

- DATABASE_URL: Connection string for the MySQL database.
- MYSQL_ROOT_PASSWORD: Password for the MySQL root user.
- MYSQL_DATABASE: Name of the database to be used.

## Swagger Documentation

The API is documented using Swagger. Once the project is running, you can access the Swagger documentation at:

http://localhost:3000/swagger

![Swagger Routes](https://i.imgur.com/YojOOOO.png)

## CI/CD Pipeline

This project includes a simple CI/CD pipeline that runs tests and linting checks. The pipeline is triggered on every push to the master or dev branches and on pull requests to these branches.

To run tests and linting locally, you can use the following commands:

- Run tests:
    ```bash
    npm run test

- Run linting:
    ```bash
    npm run lint


![CI/CD Runs](https://i.imgur.com/7aRi3CJ.png)

## Testing

The project uses Jest for testing. A mock of Prisma is used to simulate database calls, ensuring that tests are isolated and do not depend on the actual database.

- Testing Framework: Jest
- Mocking: Prisma is mocked to simulate DB interactions.