const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require ("./ExpressError");


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
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
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
    throw new ExpressError(404, "Page not found");  // this same thing will not work inside async functions 
    res.render("new.ejs");
});

//Create Route
app.post("/chats", async(req, res) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat ({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date(),
    });
    
    //console.log(newChat);
    //we will save the newChat in the database now
    // newChat.save()
    // .then((res) => {
    //     console.log("chat was saved");
    // })
    // .catch((err) => {
    //     console.log(err);
    // });
    // // res.send("working");
    // res.redirect("/chats");

    //instead of the above block of code we to save data and redirect we can write
    await newChat.save();
    res.redirect("/chats");
});


//NEW - Show Route  (new show created in index.ejs create separate page show.ejs for this)
app.get("/chats/:id", async(req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if(!chat) {  // async error ko handel krne ke liye express by default next() ko call nahi lagayega to hume next() ko call lagana pagega
        next(new ExpressError(404, "Chat not found"));
    }
    res.render("edit.ejs", { chat }); //create a separete page show.ejs for this show button instead of edit.ejs
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

//Error handling Middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Some Error Occured"} = err;
    res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
