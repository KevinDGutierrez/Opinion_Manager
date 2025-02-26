import { Schema, model } from "mongoose";

const UserSchema = Schema({
        name:{
            type: String,
            required: true
        },
        surname:{
            type: String,
            required: true
        },
        username:{
            type: String,
            unique: true
        },
        email:{
            type: String,
            required: [true, "email is required"],
            unique: true
        },
        password:{
            type: String,
            required: true,
            minlength: [8, "la contraseña debe tener 8 caracteres"]
        },
        phone:{
            type: String,
            minlength: [8, "el telefono debe tener 8 caracteres"],
            maxlength: [8, "el telefono debe tener 8 caracteres"],
            required: true
        },
        role:{
            type: String,
            default: "USER_ROLE",
            enum: [ "ADMIN_ROLE","USER_ROLE" ],
        },
        status:{
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false   
    }
);

UserSchema.methods.toJSON = function (){
    const {__v, password, _id,...user} = this.toObject();
    user.id = _id;
    return user;
}

export default model("User", UserSchema);