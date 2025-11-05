import mongoose, { Mongoose } from "mongoose";

const schema_post = new mongoose.Schema({

    title :{
        
        type: String,
        required: true
    },

    content: {

        type: String,
        required: true
    },

    tags: [{type: String}],

    isPublisher: {

        type: Boolean,
        default: false
    },

    author: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
});

const model_posts = mongoose.model("post", schema_post);
export default model_posts