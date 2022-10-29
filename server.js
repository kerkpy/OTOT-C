require('dotenv').config();
// Import express
const express = require('express');
// Import Body parser
const bodyParser = require('body-parser');
// Import Mongoose
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./userModel")
const auth = require("./auth");
const admin = require("./admin")

// Initialise the app
let app = express();
app.use(cors())



// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Connect to Mongoose and set connection variable
mongoose.connect(process.env.LOCALDB_URI, { useNewUrlParser: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 8080;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

// requires a token
app.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome");
});

var roles = ["admin"];

app.get("/admin", admin(roles), (req, res) => {
  res.status(200).json("You are an admin");
});

app.get("/:id", auth, async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).select('-__v').lean();
    res.status(200).json(user);
});

app.delete("/:id", auth, async (req, res) => {
    const {id} = req.params;
    const user = await User.findByIdAndDelete(id).select('-__v').lean();
    res.status(200).json(user);
});

app.post("/register", async (req, res) => {
    try {
        const { name,  email, password, role } = req.body;
        if (!(name && email && password && role)) {
          res.status(400).send("Incomplete input");
        }

        hashedpassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedpassword,
            role,
        });

         const token = jwt.sign(
            { user_id: user._id, email, role },
            process.env.TOKEN_KEY,
            {
            expiresIn: "1h",
            }
        );

        
        user.token = token;
        user.save()
        res.status(201).json(user);
      } catch (err) {
        console.log(err);
      }
});
    
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if (!(email && password)) {
          res.status(400).send("Incomplete input");
        }
        const user = await User.findOne({ email });
        const role = user.role
        if (user && (await bcrypt.compare(password, user.password))) {
          const token = jwt.sign(
            { 
                user_id: user._id, email, role 
            },
            process.env.TOKEN_KEY,
            {
              expiresIn: "1h",
            }
        );
          user.token = token;
          user.save()
    
          res.status(200).json(user);
        } else{
            res.status(401).send("Invalid Credentials");
        }
      } catch (err) {
        console.log(err);
      }
});

app.all('*', (req, res) => { 
    res.status(404).send('<h1>404! Page not found</h1>'); 
  });
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});

module.exports = app