# MyProfile

Personal portfolio and profile website built with Next.js (App Router), React 19, TypeScript, and TailwindCSS.

---

## 🐳 Docker Setup

This project is fully containerized using a multi-stage Docker build optimized for Next.js standalone output. It produces lightweight, secure images running under a non-root user.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your system.

---

### Running with Docker Compose (Recommended)

You can run Docker commands either from the repository root or from inside the `my-profile` directory:

#### 1. Production Mode (Optimized)
Builds and starts the optimized production standalone container:
```bash
docker compose up --build
```
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Stop the container with `Ctrl+C` or by running `docker compose down`.

#### 2. Development Mode (Hot Reloading)
Runs Next.js in development mode with volume mounting so changes update instantly:
```bash
docker compose --profile dev up --build my-profile-dev
```
- Accessible on [http://localhost:3000](http://localhost:3000).

---

### Running Directly with Docker CLI

You can also build and run the Docker image directly:

```bash
# Build the production image
docker build -t my-profile:latest ./my-profile

# Run the container
docker run -p 3000:3000 --name my-profile-app my-profile:latest
```

---

## 💻 Local Development (Without Docker)

```bash
cd my-profile
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
