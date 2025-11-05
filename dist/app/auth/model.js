import mongoose from "mongoose";
const schema_users = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
const rating_system_users = mongoose.model("users", schema_users);
export default rating_system_users;
