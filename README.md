# Uvera Blog Management API

Uvera Blog Management API is a simple RESTful API for managing blogs. It provides features for user authentication, blog creation, updating, and deletion, with role-based access control.

## Features

- **User Authentication**: Register and login with JWT-based authentication.
- **Role-Based Access Control**: Supports roles like `ADMIN` and `EDITOR` for managing access to resources.
- **Blog Management**: Create, update, and delete blogs with support for tags.
- **Swagger Documentation**: API documentation available at `/docs`.


## Prerequisites

- **Node.js**: v23 or higher
- **Docker**: Installed and running
- **PostgreSQL**: Used as the database
- **Redis**: Used for caching

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd uvera-blog-management
2. Install dependencies:
   ```bash
   npm install
3. Create a .env file in the root directory and configure the following variables:
    ```bash
    PORT=3000
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
    DB_NAME=blog
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRE=3600
    NODE_ENV=local
    REDIS_URL=redis://localhost:6379

## Running the Application
### Using Docker
1. Build and start the services:
    ```bash
    docker-compose up --build
### Without Docker
1. Start PostgreSQL and Redis services locally.
2. Initialize the database
3. Start the application in development mode:
    ```bash
    npm run dev
## Access the APIs
1. Access the API at http://localhost:3000.
2. View the API documentation at http://localhost:3000/docs.

## Scripts
- `npm run dev`: Start the application in development mode.
- `npm run build`: Compile the TypeScript code.
- `npm start`: Start the application in production mode.

## License
This project is licensed under the ISC License.