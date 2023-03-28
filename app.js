const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const popup = require('popups');
const ejs = require('ejs');
const { stringify } = require('querystring');
const { appendFile } = require('fs');
const { BlockList } = require('net');
const { posix } = require('path');

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

var userIsLoggedIn = false;
var driIsLoggedIn = false;
const spots = ["Main Gate", "Jaggi Complex", "G-Block", "Library", "Tan Building","E,G,I- Hostel", "dispensary", "H-Hostel", "J-Hostel", "Cos Complex", "M-Hostel", "L-Hostel", "K-Hostel", "A-Hostel", "B-Hostel", "C-Hostel", "PG-Hostel", "Q-Hostel", "E-block", "Mechanical Department"];
const route1 = ["Main Gate",]

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
    dfLocation1: String,
    dfLocation2: String,
    dfLocation3: String,
    dfLocation4: String,
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

const driListSchema = new Schema({
    name: String,
    username: String,
    autoNumber: Number,
    password: String
})
//////////////////////////////////////////// .   SCHEMAS END     /////////////////////////////////

//////////////////////////////////////////// .   MODEL FORMATIONS   ///////////////////////////////
const driver = mongoose.model('driver', driverSchema);
const student = mongoose.model('student', studentSchema);
const stuList = mongoose.model('stuList', stuListSchema);
const driList = mongoose.model('driList', driListSchema);
/////////////////////////////////////////// .   MODEL FORMATIONS DONE    ////////////////////////////////


////////////////////////////////////////// .   DUMMY DATA /////////////////////
 
/////////////// . DUMMUY DATA FOR DRIVERS   //////////////////
function dummyDrivers() {
    for (var i = 0; i < spots.length; i++ ) {
        var random1 = Math.floor(Math.random() * (spots.length) );
        var random3 = Math.floor(Math.random() * (5) );
            const autoDriver = new driver ({
                diLocation: spots[random1],
                // dfLocation: spots[random2],
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

function deleteDummy() {
    driver.deleteMany({dNumber: "+91 94534 34232"}, (err, db) => {
        if (err) {
            console.log(err)
        } else {
            db.close;
        }
    })
}
// function deleteStu() {
//     stuList.deleteMany({}, (err, db) => {
//         if (err) {
//             console.log(err)
//         }
//     })
// }

// app.get("/n", (req, res) => {
//     console.log(spots.length);
//     console.log(random1);
// })

app.get('/', (req, res) => {
    driIsLoggedIn = false;
    userIsLoggedIn = false;
    res.render(__dirname + "/public/frontFrontPage.html");
    deleteDummy();
})

app.get("/driver", (req, res)=>{
    driIsLoggedIn = false;
    res.render(__dirname + "/public/driFrontPage.html");
})

app.get("/driver/signin", (req, res) => {
    driIsLoggedIn = false;
    res.render(__dirname + "/public/driSignin.html");
})

app.post("/driver/signin", (req, result) => {
    const name = req.body.name;
    const autoNumber = req.body.autoNumber;
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);

    const newDriver = new driList({
        name: name,
        autoNumber: autoNumber,
        username: username,
        password: hashedPassword
    })

    driList.find({username: username}, (err, res) => {
        if (err) {
            console.log("err " + err)
        } else if(res.length != 0) {
            result.send("username already exists, it should be unique.")
        } else {
            newDriver.save((err, response) => {
                if (err) return handleError(err);
                else return console.log("save successful")
            })
            driIsLoggedIn = true;
            result.redirect('/driver/home');
        }
    })
})

app.get("/driver/login", (req, res) => {
    driIsLoggedIn = false;
    res.render(__dirname+ "/public/driLogin.html")
})

app.post("/driver/login", (req, result) => {
    driList.find({username: req.body.username}, (err, res) => {
        if (err) return handleError(err)
        else if (res.length == 0) {
            result.send("Incorrect password or username, RETRY.")
        } else {
            var passwordMatches = bcrypt.compareSync(req.body.password, res[0].password)
            if (passwordMatches) {
                driIsLoggedIn = true;
                result.redirect("/driver/home");
            } else {
                result.send("Incorrect password or username, RETRY.")
            }
        }
    })
})
app.get("/driver/home", (req, res) => {
    if (driIsLoggedIn) {
        res.render(__dirname + "/public/driHome.html")

        // navigator.geolocation.getCurrentPosition(position => console.log(position), err => console.log(err))
    } else {
        res.redirect("/driver");
    }
})

app.get("/user", (req, res) => {
    userIsLoggedIn = false;
    res.render(__dirname + "/public/usrFrontPage.html")
})

app.get("/user/signin", (req, res) => {
    userIsLoggedIn = false;
    res.render(__dirname + "/public/usrSignin.html");
})

app.post('/user/signin', (req, result) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);
    const newStudent = new stuList({
        name: name,
        username: username,
        password: hashedPassword
    })

    var unAlreadyExists = 0;

    stuList.find({username: req.body.username}, (err, res) => {
        if (err) {
            console.log("err " + err)
        } else if (res.length !== 0) {
            // popup.alert({
            //     content: "The username you entered is already in use, use some other username. IT SHOULD BE UNIQUE."
            // });
            result.redirect("/user/home");
        } else {
            newStudent.save((err, res) => {
                if (err) return handleError(err);
                else return console.log('saved successfully.');
            })
            userIsLoggedIn = true;
            result.redirect('/user/home');
        }
    })
})

app.get('/user/login', (req, res) => {
    userIsLoggedIn = false;
    res.render(__dirname + '/public/usrlogin.html');
})
app.post('/user/login', (req, res) => {
    stuList.find({username: req.body.username}, (err, response) => {
        if (err) {
            console.log(err)
        } else if (response.length == 0) {
            res.send("Incorrect password or username, RETRY.")
        } else {
            var passwordMatches = bcrypt.compareSync(req.body.password, response[0].password);
            if (passwordMatches) {
                res.redirect('/user/home');
                userIsLoggedIn = true;
            } else {
                res.send("Incorrect password or username, RETRY.")
            }
        }
    })
})

app.get("/user/home", (req, res) => {
    if (userIsLoggedIn) {
        // res.render(__dirname + "/public/home.html")
        driver.find({}, (err, list) => {
            if (err) {
                console.log(err);
            } else {
                var availableDrivers = list.filter(autoDriver => autoDriver.occupancy<4)
                res.render('home', {availableDrivers: availableDrivers});
            }
        })        
    } else {
        res.redirect("/user");
    }
})

app.get('/user/book/:params', (req, res)=>{
    console.log(req.params.params);
    res.send("underConstruction");
    driver.findById(req.params.params, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            console.log(doc);
        }
    })
})

app.listen(port, () => {
    console.log(port);
})
