import { Schema, model } from "mongoose";

const categoriesSchema = Schema({
      name:{
        type: String,
        required: true,
        unique: true
    },
    estado:{
      type: Boolean,
      default: true
    }
}, {
  timestamps: true,
  versionKey: false
});


export default model("Categorie", categoriesSchema);