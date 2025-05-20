import { Schema, model } from "mongoose";

const commentSchema = Schema({
    user:{
      type: Schema.Types.ObjectId,
        ref: "User"
    },
    content:{
        type: String,
        required: true
    },
    publication:{
        type: Schema.Types.ObjectId,
        ref: "Publication",
        required: true
    },
    estado:{
      type: Boolean,
      default: true
    }
}, {
  timestamps: true,
  versionKey: false
});


export default model("Comment", commentSchema);