const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    msg: {
        type: String,
        maxLength: 50,
    },
    created_at: {  //we can keep upadted_at also so that it can store time of updation when the msg was updated
        type: Date,
        required: true,
    },
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports  = Chat;