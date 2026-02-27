import mongoose, {Document, Model, Schema} from "mongoose";

// Types
export type EventMode = "online" | "offline" | "hybrid";

export interface IEvent extends Document {
    title: string;
    slug: string;
    desc: string;
    overview: string;
    venue: string;
    location: string;
    image: string;
    // dates stored as YYYY-MM-DD after normalization
    date: string;
    // time stored as HH:MM (24 hrs) after normalization
    time: string;
    mode: EventMode;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

//Helpers
const generateSlug = (slug: string): string => {
    return slug.trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // strip non-alphanumeric chars
        .replace(/\s+/g, "-")          // spaces → hyphens
        .replace(/-+/g, "-")           // collapse consecutive hyphens
        .replace(/^-|-$/g, "");
}

function normalizeDate(value: string): string {
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) {
        throw new Error(`Invalid date:
        "${value}" Expected  date string`);
    }
    // toIsoString() always return date like YYYY-MM-DDTHH:mm:ss:sssz:
    return parsed.toISOString().split("T")[0];
}

function normalizeTime(value: string): string {
    const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) {
        throw new Error(
            `Invalid time: "${value}". Expected formats: "HH:MM", "H:MM AM", 
            or "H:MM PM".`
        );
    }

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3]?.toUpperCase();

    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;

    if (hours > 23 || minutes > 59) {
        throw new Error(`Time out of range: "${value}".`);
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// Schema

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            require: [true, "Title is required"],
            trim: true,
            maxLength:[100,'Title cannot exceed 100 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        desc: {
            type: String,
            require: [true, "Description is required"],
            trim: true,
            maxLength:[1000,'Desc cannot exceed 1000 characters'],
        },
        overview: {
            type: String,
            require: [true, "Overview is required"],
            trim: true,
            maxLength:[500,'Overview cannot exceed 500 characters'],
        },
        image: {
            type: String,
            required: [true, "Image URL is required"],
            trim: true,
        },
        venue: {
            type: String,
            required: [true, "Venue is required"],
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        date: {
            type: String,
            required: [true, "Date is required"],
        },
        time: {
            type: String,
            required: [true, "Time is required"],
        },
        mode: {
            type: String,
            required: [true, "Mode is required"],
            enum: {
                values: ["online", "offline", "hybrid"] satisfies EventMode[],
                message: 'Mode must be "online", "offline", or "hybrid".',
            },
        },
        audience: {
            type: String,
            required: [true, "Audience is required"],
            trim: true,
        },
        agenda: {
            type: [String],
            required: [true, "Agenda is required"],
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: "Agenda must contain at least one item.",
            },
        },
        organizer: {
            type: String,
            required: [true, "Organizer is required"],
            trim: true,
        },
        tags: {
            type: [String],
            required: [true, "Tags are required"],
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: "Tags must contain at least one item.",
            },
        },
    },
    {timestamps: true}
);

// Pre-save hook

EventSchema.pre("save", async function() {
    const event = this as IEvent;
    if(this.isModified("title") || event.isNew) {
        event.slug = generateSlug(event.title);
    }

    if(this.isModified("date")) {
        event.date = normalizeDate(event.date);
    }

    if(this.isModified("time")) {
        event.time = normalizeTime(event.time);
    }
})

//Model

const Event: Model<IEvent> =
    (mongoose.models.Event as Model<IEvent>) ??
    mongoose.model<IEvent>("Event", EventSchema);

export default Event;