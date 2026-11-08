# Shipyard Frontend

The Shipyard frontend is a React and TypeScript single-page application built with Vite. It provides the sign-in flow, deployment dashboard, deployment details, and build log views.

## Hosted Demo Status

The hosted backend is paused to keep infrastructure costs down. The frontend is available as a UI preview, but sign-in, deployment creation, deployment details, and live build logs need the API and worker services to be running. The Grafana and Prometheus services are paused as well. See the root README for screenshots and the full architecture.

## Application Flow

- `/login` lets a user sign in or create an account through the API.
- `/` lists deployments and opens the form for a Git URL, project name, optional root directory, and optional environment variables.
- `/deployment/:id` shows deployment status, its generated URL, and repository details.
- `/deployment/:id/logs` loads saved build output and connects to the API WebSocket for live logs.

The application uses cookie credentials for API requests. The hosted notice appears across all routes so visitors know that backend actions are paused.

## Run Locally

From the repository root, start the Docker Compose services and then run the Vite development server:

    docker compose -f docker-compose.dev.yml up --build
    npm run dev --workspace @shipyard/frontend

Vite serves the frontend at http://localhost:4000. Configure `VITE_BACKEND_URL` for the API HTTP base URL and `VITE_WS_URL` for its WebSocket host when those services use non-default addresses. The frontend code defaults to http://localhost:3000 for HTTP and ws://localhost:3010 for WebSockets.

For project-wide setup, environment variables, and service ports, see the root README.