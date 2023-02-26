const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
// var engines = require('consolidate');
const { appendFile } = require('fs');
const { BlockList } = require('net');

const app = express();
const port = 6969;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
// app.set('views', __dirname + '/views');
// app.engine('html', engines.mustache);
// app.set('view engine', 'html');
app.use(express.static('public'));

///////////////////////////////////////////// . GLOBAL VARIABLES      ///////////////////////

var isLoggedIn = false;
const spots = ["Main Gate","Auditorium", "Jaggi Complex", "G-Block", "Library", "Tan Building", "Dispencary", "H-Hostel", "J-Hostel", "Cos Complex", "M-Hostel", "L-Hostel", "K-Hostel", "A-Hostel", "B-Hostel", "C-Hostel", "I-Hostel", "PG-Hostel", "Q-Hostel", "E-block"];


//////////////////////////////////////////// .  MONGODB CONNECTION    ///////////////////////
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://Angad:singh121@ac-tkwxqzt-shard-00-00.cge8liy.mongodb.net:27017,ac-tkwxqzt-shard-00-01.cge8liy.mongodb.net:27017,ac-tkwxqzt-shard-00-02.cge8liy.mongodb.net:27017/?ssl=true&replicaSet=atlas-4r9oy4-shard-0&authSource=admin&retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => {console.log("connection successful")})
.catch((err) => {console.log(err)})


//////////////////////////////////////////// .  SCHEMAS START    /////////////////////////////
const Schema = mongoose.Schema
const driverSchema = new Schema({
    diLocation: String,
    dfLocation: String,
    dNumber: String,
    occupancy: Number
});

const studentSchema = new Schema ({
    siLocation: String,
    sfLocation: String,
    pOccupancy: Number
});

const stuListSchema = new Schema ({
    name: String,
    username: String,
    password: String
})
//////////////////////////////////////////// .   SCHEMAS END     /////////////////////////////////

//////////////////////////////////////////// .   MODEL FORMATIONS   ///////////////////////////////
const driver = mongoose.model('driver', driverSchema);
const student = mongoose.model('student', studentSchema);
const stuList = mongoose.model('stuList', stuListSchema);
/////////////////////////////////////////// .   MODEL FORMATIONS DONE    ////////////////////////////////


////////////////////////////////////////// .   DUMMY DATA /////////////////////
 
/////////////// . DUMMUY DATA FOR DRIVERS   //////////////////
function dummyDrivers() {
    for (var i = 0; i < 15; i++ ) {
        var random1 = Math.floor(Math.random() * (spots.length) );
        var random2 = Math.floor(Math.random() * (spots.length) );
        var random3 = Math.floor(Math.random() * (5) );
        if ( random1 !== random2) {
            const autoDriver = new driver ({
                diLocation: spots[random1],
                dfLocation: spots[random2],
                dNumber: "+91 94534 34232",
                occupancy: random3
            })

            autoDriver.save((err, res) => {
                if (err) {
                    console.log("error: " + err)
                } else {
                    console.log("response: " + res)
                }
            })
        }
    }
}

// function deleteDummy() {
//     driver.deleteMany({dNumber: "+91 94534 34232"}, (err, db) => {
//         if (err) {
//             console.log(err)
//         } else {
//             db.close;
//         }
//     })
// }


// app.get("/n", (req, res) => {
//     
//     console.log(spots.length);
//     console.log(random1);
// })

app.get("/signin", (req, res) => {
    // res.render(__dirname + "/public/index.ejs");
    // res.render(__dirname + '/public/signup-signin/signin.html')
    // dummy();
    res.render(__dirname + "/public/signin.html");
})

app.post('/signin', (req, result) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    // console.log(req.body.name);
    const newStudent = new stuList({
        name: name,
        username: username,
        password: password
    })

    var unAlreadyExists = 0;

    stuList.find({username: req.body.username}, (err, res) => {
        if (err) {
            console.log(err)
            console.log("err")
        } else {
            if (res.length !== 0 ) {
                var passwordMatches = false
                res.forEach(stu => {
                    if (stu.password == password) {
                        passwordMatches = true;
                    }
                });

                if (passwordMatches) {
                    result.send("You are now logged in.");
                    isLoggedIn = true;
                } else {
                    result.send("The username you entered is already in use, use of some other username. IT SHOULD BE UNIQUE.")
                }

            } else {
                newStudent.save((err, res) => {
                    if (err) return handleError(err);
                    else return console.log("saved successfully")
                });

                isLoggedIn = true;
                
                result.redirect("/home")
            }
        }
    })

    // console.log(newStudent.name);
    
})

app.get("/home", (req, res) => {
    if (isLoggedIn) {
        res.render(__dirname + "/public/home.html")
    } else {
        res.redirect("/signin");
    }
})

app.listen(port, () => {
    console.log(port);
})