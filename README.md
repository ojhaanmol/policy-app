# 🛡️ Insuredime – Policy Management & Messaging Platform

A **Clean-Architecture based backend system** for:

- Insurance policy ingestion (CSV/XLSX)
- Policy search & aggregation
- Asynchronous background processing
- Delayed message scheduling
- High-availability self-healing runtime
- Built with Node.js, MongoDB, Worker Threads, PM2, and Clean Architecture.

## 🧱 Architecture

This project strictly follows **Clean Architecture:**

```
Controller → Use Case → Gateway → Infrastructure
```

Nothing in your business logic knows about:

- Express
- MongoDB
- Workers
- CSV files
- PM2

Everything is **injected**.

This makes the system:

- testable
- scalable
- replaceable
- cloud-ready

## 📂 Project Structure

```
src/
├── infrastructure        # Real implementations (DB, workers, express, CPU guard)
├── interfaces-adapters   # Controllers, gateways, presenters
├── usecase               # Business rules
├── tests                 # Unit tests
```

**Why this matters**

You can replace:

- MongoDB → PostgreSQL
- In-memory queue → Redis
- Express → Fastify

…without changing any business logic.

## 🚀 Features

### Policy Management

Upload insurance data via CSV:

```
POST /v1/policies/upload
```

Search policies:

```
GET /v1/policies/by-username?username=John
```

Aggregate policy stats:

```
GET /v1/policies/aggregated-by-user
```

### High-Performance CSV Ingestion

Uploads go to:

```
.volumes → Worker Thread → MongoDB
```

This ensures:

- No request blocking
- Large files handled safely
- Parallel ingestion

### Delayed Message Scheduling

Schedule messages in the future:

```
POST /v1/messages/schedule
```

```
{
  "message": "Hello future",
  "date": "2026-01-15",
  "time": "10:30"
}
```

Pipeline:

```
API → InMemory Queue → Worker → MongoDB
```

This is how:

- Kafka
- Redis delay queues
- Stripe schedulers

are built.

### Self-Healing CPU Protection

The system watches CPU usage:

```
> 70% CPU → process exits → PM2 restarts
```

Prevents:

- infinite loops
- runaway workers
- memory leaks
- system crashes

### Tests

- This system has:
- Use-case tests
- Controller tests
- Gateway tests
- Error handling tests

Run:

```
npm test
```

## 🏗️ Run the project

### Install

```
npm install
```

### Start with PM2

```
pm2 start ecosystem.config.js
pm2 logs
```

## 📥 Upload CSV

```
curl -X POST http://localhost:3000/v1/policies/upload \
  -F "file=@policies.csv"
```

## 🔍 Check health

```
curl http://localhost:3000/health
```

## 🧠 Why this project is different

- Most backend projects:
- Mix business logic with DB
- Block threads during uploads
- Have no job scheduling
- Crash under load

This project:

- Uses Clean Architecture
- Uses worker threads
- Has a real scheduler
- Has CPU protection
- Has testable domain logic

This is **enterprise-grade backend engineering**.