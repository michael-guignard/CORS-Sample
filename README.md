# CORS Demo Application

This project demonstrates Cross-Origin Resource Sharing (CORS) functionality using a multi-container setup with Python Flask servers and a React frontend.

## Project Structure

```
.
├── frontend/           # React frontend application
├── main-api/          # Primary Flask API server
├── secondary-api/     # Secondary Flask API server
├── docker-compose.yml # Docker compose configuration
└── README.md         # This file
```

## Features

- Two separate API servers to demonstrate CORS behavior
- Interactive frontend to toggle CORS settings
- Docker containerization for easy deployment
- Real-time visualization of CORS effects

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone this repository
2. Run `docker compose up --build`
3. Access the frontend at `http://localhost:3000`
4. Main API will be available at `http://localhost:5000`
5. Secondary API will be available at `http://localhost:5001`

## How to Use

1. The frontend provides controls to toggle various CORS headers
2. Try making requests between different origins to see CORS in action
3. Observe the browser's behavior with different CORS configurations

## License

This project is licensed under the MIT License - see the LICENSE file for details.
