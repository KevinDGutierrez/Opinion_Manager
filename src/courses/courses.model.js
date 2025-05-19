import { Schema, model } from "mongoose";

const coursesSchema = Schema({
      name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true,
    },
    status:{
      type: Boolean,
      default: true
    }
}, {
  timestamps: true,
  versionKey: false
});


export default model("Course", coursesSchema);