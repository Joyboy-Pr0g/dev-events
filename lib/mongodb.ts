import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env"
  );
}

/**
 * Cached connection interface.
 * Stores the active Mongoose instance and any in-progress connection promise
 * so we can reuse them across hot reloads in development.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Extend the Node.js global type to include our mongoose cache.
 * This prevents TypeScript from complaining about a property that doesn't
 * exist on the built-in `global` object.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * Use the cached connection if it exists, otherwise initialise an empty cache.
 * The global variable persists across Next.js hot reloads in development,
 * which stops the server from opening a new connection on every file change.
 */
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

// Store the cache on the global object for subsequent calls.
global.mongoose = cached;

/**
 * Returns a connected Mongoose instance.
 *
 * - In production a new connection is created once per serverless function
 *   cold start and reused for subsequent invocations.
 * - In development the connection is cached on `global` so that hot-module
 *   replacement doesn't open a new connection on every code change.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // Return the existing connection immediately if one is already open.
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection attempt is in flight yet, start one.
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      // Prevents buffering model calls while the connection is being
      // established; surfaces connection errors immediately instead.
      bufferCommands: false,
    });
  }

  // Await the connection (whether we just started it or it was already pending).
  cached.conn = await cached.promise;

  return cached.conn;
}
