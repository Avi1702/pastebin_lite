# Pastebin Lite

A minimal Pastebin-like application that allows users to create text pastes and share them via a unique URL.

## Features
- Create a text paste
- Optional time-to-live (TTL)
- Optional maximum view count
- Shareable URL
- Pastes expire automatically based on constraints

## Tech Stack
- Next.js (App Router)
- TypeScript
- Vercel KV (Redis via Upstash)

## Running Locally

1. Install dependencies:
   ```bash
   npm install

2. Create a .env.local file in the project root and add:
    KV_REST_API_URL=...
    KV_REST_API_TOKEN=...
    KV_REST_API_READ_ONLY_TOKEN=...

3. Start the dev server: npm run dev

4. Open : http://localhost:3000


Persistence Layer

This project uses Vercel KV, a Redis-based key–value store backed by Upstash, which is suitable for serverless environments and persists data across requests.

Notes:
In test environments, deterministic expiry is supported via TEST_MODE=1 and the x-test-now-ms request header.
