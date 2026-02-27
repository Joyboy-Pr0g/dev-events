// Single entry point for all database models and their TypeScript interfaces.
// Import from "@/database" anywhere in the application.

export { default as Event } from "./event.model";
export type { IEvent, EventMode } from "./event.model";

export { default as Booking } from "./booking.model";
export type { IBooking } from "./booking.model";
