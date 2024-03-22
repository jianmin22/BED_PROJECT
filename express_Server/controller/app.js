// Name: Soh Jian Min
// Class: DIT/FT/1B/04
// Admission Number: 2238856

const express = require("express");
const bodyParser = require("body-parser");
const dvd = require("../model/dvd");
const { json } = require("express");
const app = express();
const verifyFn = require("../auth/verifyFn");
// cross origin resource sharing
var cors = require('cors');

app.options('*', cors());
app.use(cors());
const urlendcodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(urlendcodedParser);

// Search Film By Title Max Price
app.post("/searchFilmByTitleMaxPrice", function (req, res) {

    const title = req.body.title;
    const maxPrice = req.body.maxPrice;
    dvd.getFilmBytitleMaxPrice(title, maxPrice, function (err, result) {
        if (!err) {
            console.log(title);
            console.log(result)
            res.status(200).send(result);
        }
        else {
            res.status(500).send("Internal server error");
        }
    })
})

// Get All DVD film
app.get("/getAllFilm", function (req, res) {

    dvd.getAllFilm(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }
        else {
            res.status(500).send("Internal server error");
        }
    })
})

// Get Category
app.get("/getCat", function (req, res) {

    dvd.getCategory(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }
        else {
            res.status(500).send("Internal server error");
        }
    })
})

// Get StoreIDAndAdress
app.get("/getStoreIDAdress", function (req, res) {

    dvd.getStoreIDAndAdress(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }
        else {
            res.status(500).send("Internal server error");
        }
    })
})

// Login
app.post('/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    dvd.login(email, password, function (err, token, result, role, id) {
        if (err) {
            if (err == "Incorrect email or password!") {
                res.status(500).send(err)
            } else {
                res.status(500).send("Internal server error");
            }

        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            delete result[0]['password'];//clear the password in json data, do not send back to client
            console.log(result);
            res.json({ success: true, UserData: result, token: token, status: 'You are successfully logged in!', role: role, userID:id });
            res.send();
        }
    })
})

// get dvd film details
app.get("/filmDetails/:dvdID", function (req, res) {
    const dvdID = req.params.dvdID;

    dvd.getFilmDetails(dvdID, function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }
        else {
            res.status(500).send("Internal server error");
        }
    })
})

// Search for actor by name 
app.post("/searchActorByName", verifyFn.verifyToken, verifyFn.verifyAdmin, function (req, res) {
    const name = req.body.name;
    dvd.getActorByName(name, function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }
        else {
            res.status(500).send("Internal server error");
        }
    })
})

// Search for actor by ID 
app.post("/searchActorByID", verifyFn.verifyToken, verifyFn.verifyAdmin, function (req, res) {
    const actorid = req.body.actorId;

    dvd.getActor(actorid, function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }
        else {
            res.status(500).send("Internal server error");
        }
    })
})

// Show all actors
app.get("/actors", verifyFn.verifyToken, verifyFn.verifyAdmin, function (req, res) {
    dvd.getActors(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }
        else {
            res.status(500).send("Internal server error");
        }
    })
})

// add actor
app.post("/actors", verifyFn.verifyToken, verifyFn.verifyAdmin, function (req, res) {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;

    dvd.addActors(first_name, last_name, function (err, result) {
        if (!err) {
            var resultid = result.insertId;
            res.status(201).send({ "actor_id": resultid.toString() })
        }
        else {

            res.status(500).send("Internal server error");

        }
    })
})

// update actor
app.put("/actors/:actor_id", verifyFn.verifyToken, verifyFn.verifyAdmin, function (req, res) {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const actor_id = req.params.actor_id;
    dvd.updateActor(first_name, last_name, actor_id, function (err, result) {
        if (!err) {
            if (result == null) {
                res.status(204).send();
            }
            else {
                res.status(200).send({ "success_msg": "record updated" })
            }
        }
        else {
            if (err == "missing data") {
                res.status(400).send("missing data");
            }
            else {
                res.status(500).send("Internal server error");
            }
        }
    })
})

// delete actor
app.delete("/actors/:actor_id", verifyFn.verifyToken, verifyFn.verifyAdmin, function (req, res) {
    const actor_id = req.params.actor_id;
    dvd.deleteActor(actor_id, function (err, result) {
        if (!err) {
            if (result == null) {
                res.status(204).send();
            }
            else {
                res.status(200).send({ "success_msg": "actor deleted" });
            }
        }
        else {
            if (err.errno == 1451) {
                res.status(409).send("Foreign key constraint");
            }
            else {
                res.status(500).send("Internal server error");
            }

        }
    })
})

// get film by category id & with max price
app.post("/film_categories_films", function (req, res) {
    const category_id = req.body.category_id;
    const maxPrice = req.body.maxPrice;
    dvd.getFilmByCategory(category_id, maxPrice, function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }
        else {
            res.status(500).send("Internal server error");
        }
    })
})

// get all customer
app.get("/allCust", verifyFn.verifyToken, verifyFn.verifyAdmin, function (req, res) {
    dvd.getAllCust(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send("Internal server error");
        }
    })
})

// get customer by name
app.post("/custByName", verifyFn.verifyToken, verifyFn.verifyAdmin, function (req, res) {
    const cust_name = req.body.cust_name;
    dvd.getCustByName(cust_name, function (err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send("Internal server error");
        }
    })
})

// get customer by name
app.post("/custById", verifyFn.verifyToken, verifyFn.verifyAdmin, function (req, res) {
    const custId = req.body.cust_id;
    dvd.getCustByID(custId, function (err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send("Internal server error");
        }
    })
})

// Customer payment info with date
app.post("/customerPayment/:customer_id", verifyFn.verifyToken, function (req, res) {
    const customer_id = req.params.customer_id;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    dvd.getPayment(customer_id, start_date, end_date, function (err, result) {
        if (!err) {
            res.status(200).send(result);

        }
        else {
            res.status(500).send(err)
        }
    })
})

// Admin Payment info with date
app.post("/adminCustPayment", verifyFn.verifyToken, verifyFn.verifyAdmin, function (req, res) {
    const customer_id = req.body.customer_id;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    dvd.getPayment(customer_id, start_date, end_date, function (err, result) {
        if (!err) {
            res.status(200).send(result);

        }
        else {
            res.status(500).send(err)
        }
    })
})

// Customer payment info w/o date
app.get("/allCustomerPaymentCust/:customer_id", verifyFn.verifyToken, function (req, res) {
    const customer_id = req.params.customer_id;
    dvd.getPaymentsCust(customer_id, function (err, result) {
        if (!err) {
            res.status(200).send(result);

        }
        else {
            res.status(500).send(err);
        }
    })
})

// Admin Payment info w/o date
app.get("/allCustomerPaymentAdmin", verifyFn.verifyToken, verifyFn.verifyAdmin, function (req, res) {
    dvd.getAllPaymentsAdmin(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }
        else {
            res.status(500).send(err);
        }
    })
})

// Get all cities
app.get("/getAllCities", verifyFn.verifyToken, verifyFn.verifyAdmin, function (req, res) {
    dvd.getAllCities(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send("Internal server error");
        }
    })
})

// add customer
app.post("/customers", function (req, res) {
    const address1 = req.body.address;
    const address2 = req.body.address2;
    const district = req.body.district;
    const city_id = req.body.city_id;
    const postal_code = req.body.postal_code;
    const phone = req.body.phone;
    const password = req.body.password;
    const email = req.body.email;
    const store_id = req.body.store_id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;

    dvd.addCustomer(address1, address2, district, city_id, postal_code, phone, password, store_id, first_name, last_name, email, function (err, result) {
        if (!err) {
            var resultid = result.insertId;
            res.status(201).send({ "customer_id": resultid.toString() })
        }
        else {
            if (err == "Missing Data") {
                res.status(400).send(err);
            } else if (err == "email already exist") {
                res.status(409).send("Email already registered!");
            }
            else {
                res.status(500).send("Internal server error");
            }
        }
    })
})

module.exports = app;