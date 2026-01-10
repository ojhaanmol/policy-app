# 📂 .volumes — Upload & Ingestion Workspace

This directory is used as a **persistent staging area** for all uploaded CSV files before they are processed by worker threads.

It acts as the **bridge between HTTP uploads and background ingestion**.

## 🧠 Why this folder exists

- The .volumes folder ensures:
- Files survive even if the server restarts
- Workers can process files asynchronously
- Uploads are decoupled from ingestion
- Large files don’t live in memory