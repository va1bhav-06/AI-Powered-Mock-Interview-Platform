// ============================================
// server.js - Entry Point
// ============================================
// This is where the app starts. It:
//   1. Loads environment variables
//   2. Connects to MongoDB
//   3. Starts the Express server
// ============================================

// Load environment variables FIRST (before anything else uses them)

// Browser polyfill setup to stop pdfjs-dist from crashing on Node.js startup

// import './patch.js'; // MUST BE LINE 1 - BEFORE ANY OTHER IMPORTS
// import express from 'express'; 
// import cors from 'cors';
// ... the rest of your imports and code

// server.js - PLACE THIS AT THE ABSOLUTE TOP OF THE FILE
import fetch, { Headers } from 'node-fetch';
import stream, { Readable } from 'stream';

// 1. Apply global fetch/headers for Gemini
if (typeof globalThis.fetch === 'undefined') globalThis.fetch = fetch;
if (typeof globalThis.Headers === 'undefined') globalThis.Headers = Headers;

// 2. Define the conversion logic layout
const toWebPolyfill = function (nodeStream) {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk) => controller.enqueue(chunk));
      nodeStream.on('end', () => controller.close());
      nodeStream.on('error', (err) => controller.error(err));
    }
  });
};

// 3. Force the patch directly onto the internal module exports that AssemblyAI reads
if (typeof Readable.toWeb !== 'function') {
  Readable.toWeb = toWebPolyfill;
}
if (typeof stream.toWeb !== 'function') {
  stream.toWeb = toWebPolyfill;
}

import "dotenv/config";

// Import our configured Express app
import app from "./src/app.js";

// Import the database connection function
import connectDB from "./src/config/db.config.js";

// Get the port from .env or use 5000 as default
const PORT = process.env.PORT || 5000;

// ---- Start the Server ----

const startServer = async () => {
  try {
    // Step 1: Connect to MongoDB (wait until connected)
    await connectDB();

    // Step 2: Start listening for HTTP requests
    app.listen(PORT, () => {
      console.error(`\n Server is running on port ${PORT}`);
      console.error(` Environment: ${process.env.NODE_ENV || "development"}`);
      console.error(` URL: http://localhost:${PORT}\n`);
    });
  } catch (error) {
    // If anything fails, log the error and exit
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

// Call the function to start everything
startServer();
