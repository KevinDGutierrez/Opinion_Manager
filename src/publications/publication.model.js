import { Schema, model } from "mongoose";

const publicationSchema = Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    titulo:{
        type: String,
        required: true,
        lowercase: true
    },
    course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true
    },
    content:{
        type: String,
        required: true
    },
    comment:[{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    estado:{
        type: Boolean,
        default: true
    }

    },
    {
        timestamps: true,
        versionKey: false   
    }
);


export default model("Publication", publicationSchema);