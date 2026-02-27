import mongoose, {Document, Model, Schema, Types} from "mongoose";

export interface IBooking extends Document {
    // Reference to Event model
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "Event id is required"],
            // indexing on evntId to speed up queries
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            index: true,
            validate: {
                validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                message: "Invalid email address.",
            }
        }
    });

BookingSchema.pre("save", async function () {
    const booking = this as IBooking;
    if (this.isModified("eventId") || booking.isNew) {

        const EventModel = mongoose.model("Event");
        const exists = await EventModel.exists({_id: booking.eventId});

        if (!exists) {
            {
                const error = new Error("Event Doesn't exist");
                error.name = 'ValidationError';
                throw error;
            }
        }
    }
});


const Booking: Model<IBooking> =
    (mongoose.models.Booking as Model<IBooking>) ??
    mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;