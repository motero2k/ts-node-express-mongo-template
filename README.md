# Express TypeScript Boilerplate

A layered Express API boilerplate with TypeScript (Requires Node.js 24+ and MongoDB running locally or remotely).

## Scripts

- `npm install` — Install dependencies
- `npm run dev` — Start in development mode
- `npm run build` — Compile TypeScript to JavaScript
- `npm run start` — Start compiled app

## Docker

Development with Docker Compose (recommended):

```bash
docker compose -f compose.dev.yml up --build --remove-orphans -d
```

Stop and remove containers:

```bash
docker compose -f compose.dev.yml down
```

Production-like local image:

Build image:

```bash
docker build -t template:local .
```

Run container:

```bash
docker run --rm --name template \
 -p 3000:3000 \
 --add-host=host.docker.internal:host-gateway \
 -e MONGO_URI="mongodb://host.docker.internal:27017/mern_example" \
 -e PORT=3000 \
 template:local
```

## Features

- OAS Telemetry middleware with in-memory traces, logs, and metrics
- Swagger API documentation
- Centralized error handling
- Standardized API responses
- Environment variable management with dotenv
- MongoDB integration with Mongoose
- Structured logging with tags
- Layered architecture (routes, controllers, services, models)
- TypeScript for type safety
- ESLint and Prettier for code quality and formatting
- Unit tests with Vitest
- GitHub Actions CI/CD pipeline
- Health check endpoint
- Husky pre-commit hooks
- Dockerfile for containerization
- Request validation with Express Validator
- Helmet for security headers
