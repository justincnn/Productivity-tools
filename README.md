# Full-Stack AI Productivity Tool

This repository contains a complete, production-ready, full-stack AI tool web application. It features a React frontend, a Node.js backend, and leverages the OpenAI API.

## Core Features

- **Modern Tech Stack**: React (Vite, TypeScript) frontend and Node.js (Express, TypeScript) backend.
- **AI Integration**: Seamlessly connects to OpenAI-compatible APIs for chat completions.
- **Persistent Prompt Management**: Administrators can manage a library of prompts via a secure admin panel, with data persisted in a SQLite database.
- **Minimalist & Responsive UI**: Apple-inspired minimalist design with a DHL Express color theme and built-in dark/light mode.
- **Containerized Deployment**: Fully containerized with Docker and orchestrated with Docker Compose for easy, one-command deployment.
- **Centralized Configuration**: All environment variables for Docker deployment are managed directly within the `docker-compose.yml` file, removing the need for `.env` files in production.
- **Automated CI/CD**: A GitHub Actions workflow automatically builds and pushes `linux/arm64` Docker images to Docker Hub on every push to the `main` branch.

## Technology Stack

- **Frontend**: React, Vite, TypeScript, Material-UI (MUI)
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (via `better-sqlite3`)
- **AI**: `openai` Node.js library
- **Deployment**: Docker, Docker Compose, Nginx
- **CI/CD**: GitHub Actions

---

## Local Development Guide

Follow these steps to run the application on your local machine for development.

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install Backend Dependencies**:
    ```bash
    cd server
    # It is recommended to use a Node.js LTS version (e.g., v20.x)
    npm install
    ```

3.  **Configure Backend Environment**:
    Create a `.env` file inside the `server/` directory. This file is for local development only and will be ignored by Git.

    ```
    # server/.env
    OPENAI_API_BASE_URL=https://api.openai.com/v1
    OPENAI_API_KEY="your_api_key_here"
    ADMIN_API_KEY="your_local_admin_password"
    PORT=8080
    ```

4.  **Run Backend Development Server**:
    ```bash
    # From the server/ directory
    npm run dev
    ```
    The backend will be available at `http://localhost:8080`.

5.  **Install Frontend Dependencies**:
    ```bash
    # From the root directory
    cd client
    npm install
    ```

6.  **Run Frontend Development Server**:
    ```bash
    # From the client/ directory
    npm run dev
    ```
    The frontend will automatically open in your browser, likely at `http://localhost:5173`.

---

## Docker Deployment Guide

This is the recommended method for running the application in a production-like environment.

1.  **Prerequisites**:
    - Docker and Docker Compose must be installed.

2.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

3.  **Configure Environment Variables**:
    **IMPORTANT**: Do NOT create a `.env` file. Instead, open the `docker-compose.yml` file and edit the `environment` section for the `server` service directly.

    ```yaml
    # docker-compose.yml

    services:
      # ... client service ...
      server:
        # ... other server config ...
        environment:
          - NODE_ENV=production
          - PORT=8080
          - OPENAI_API_BASE_URL=https://api.openai.com/v1
          # ↓↓↓ REPLACE THESE VALUES ↓↓↓
          - OPENAI_API_KEY="your_real_api_key_goes_here"
          - ADMIN_API_KEY="your_secure_admin_password_goes_here"
          # ↑↑↑ REPLACE THESE VALUES ↑↑↑
    ```

4.  **Build and Run the Application**:
    From the root directory of the project, run:
    ```bash
    docker-compose up -d --build
    ```
    This command will build the Docker images and start the client and server containers in the background.

5.  **Accessing the Application**:
    - **Main Application**: `http://<your-server-ip>:5633`
    - **Admin Panel**: `http://<your-server-ip>:5633/admin`

    To log into the admin panel, use the password you set for `ADMIN_API_KEY` in the `docker-compose.yml` file.

---

## CI/CD Pipeline

The `.github/workflows/docker-publish.yml` workflow will automatically trigger on a push to the `main` branch. It performs the following actions:

1.  Logs into Docker Hub using `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` repository secrets.
2.  Builds the `server` and `client` images for the `linux/arm64` architecture.
3.  Pushes the images to `your_dockerhub_username/ai-tool-server:latest` and `your_dockerhub_username/ai-tool-client:latest`.

**Action Required**: Before this works, you must:
1.  Update the image tags in `docker-publish.yml` to use your Docker Hub username.
2.  Create `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets in your GitHub repository settings.
