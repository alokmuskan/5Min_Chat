const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); 
app.use(express.static(path.join(__dirname, "public"))); // ye batata hai ki hamari static files kaha se serve hone walli hai 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


main()
.then(() => {
    console.log("Connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

// let chat1 = new Chat({
//     from: "neha",
//     to: "priya",
//     msg: "send me your exam sheets",
//     created_at: new Date(),
// });

// chat1.save()
// .then(res => {
//     console.log(res);
// }) 
// .catch((err) => {
//     console.log(err);
// });

//Index Route
app.get("/chats", async(req, res) => {
    let chats = await Chat.find();
    //console.log(chats);
    // res.send("working");
    res.render("index.ejs", { chats });
});


//New Route
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

//Create Route
app.post("/chats", (req, res) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat ({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date(),
    });
    
    //console.log(newChat);
    //we will save the newChat in the database now
    newChat.save()
    .then((res) => {
        console.log("chat was saved");
    })
    .catch((err) => {
        console.log(err);
    });
    // res.send("working");
    res.redirect("/chats");
});


//Edit Route
app.get("/chats/:id/edit", async(req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
});


//Update Route
app.put("/chats/:id", async(req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;  //here we have to give key value pair as newMsg does not exist inside body
    console.log(newMsg);
    let updatedChat = await Chat.findByIdAndUpdate(
        id, 
        {msg: newMsg},
        {runValidators: true, new: true},
    );

    console.log(updatedChat);
    res.redirect("/chats");
});


//Destroy Route
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
});

app.get("/", (req, res) => {
    res.send("root is working");
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
