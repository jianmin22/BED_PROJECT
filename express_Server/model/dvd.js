// Name: Soh Jian Min
// Class: DIT/FT/1B/04
// Admission Number: 2238856
const db = require("./databaseConfig");
const config = require('../config');
const jwt = require('jsonwebtoken');

const dvd = {
    // search film
    getFilmBytitleMaxPrice: function (title, maxPrice, callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                if (maxPrice != null && maxPrice.length != 0 && maxPrice != "") {
                    const sql1 = "SELECT film_id, title, release_year,rating FROM film where title like ? and rental_rate<=?;";
                    conn.query(sql1, [('%' + title + '%'), maxPrice], function (err, result) {
                        conn.end();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        }
                        else {
                            console.log(result);
                            return callback(null, result);
                        }
                    })
                } else {
                    const sql2 = "SELECT film_id, title, release_year,rating FROM bed_dvd_db.film where title like ?;";
                    conn.query(sql2, [('%' + title + '%')], function (err, result) {
                        conn.end();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        }
                        else {
                            console.log(result);
                            return callback(null, result);
                        }
                    })
                }

            }
        })
    },
    // get category
    getCategory: function (callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql = "SELECT category_id, name FROM bed_dvd_db.category;";
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // get store_id and address
    getStoreIDAndAdress: function (callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql = "select address.address, store.store_id from address, store where address.address_id=store.address_id";
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // login
    login: function (email, password, callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback("Internal Server Error", null, null);
            }
            // connection successful
            else {
                let sql1 = 'select * from staff where email =? and password =?';
                conn.query(sql1, [email, password], function (err, result) {
                    if (err) {
                        conn.end();
                        return callback(err, null, null, null);
                    }
                    // no err
                    else {
                        // successful login
                        if (result.length == 1) {
                            conn.end();
                            // create jwt
                            let staffid = result[0].staff_id;
                            let role = 'admin';
                            const payload = { id: staffid, role: role };
                            // sign to create a token.
                            const token = jwt.sign(payload, config.key,
                                { expiresIn: 86400 }); // expires in 24 hours
                            return callback(null, token, result, role, staffid);
                        }
                        // Failed login
                        else {
                            let sql2 = 'select * from customer where email =? and password =?';
                            conn.query(sql2, [email, password], function (err, result) {
                                conn.end();
                                if (err) {
                                    return callback(err, null, null, null);
                                }
                                // no err
                                else {
                                    // successful login
                                    if (result.length == 1) {
                                        // create jwt
                                        const custid = result[0].customer_id;
                                        const role = 'customer';
                                        const payload = { id: custid, role: role };
                                        // sign to create a token.
                                        const token = jwt.sign(payload, config.key,
                                            { expiresIn: 86400 }); // expires in 24 hours
                                        return callback(null, token, result, role, custid);
                                    }
                                    // Failed login
                                    else {
                                        return callback("Incorrect email or password!", null, null, null);
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    },

    getAllFilm: function (callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql = "SELECT film_id, title, release_year,rating FROM film ;";
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })

            }
        })
    },

    // get dvd film details
    getFilmDetails: function (dvdID, callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql1 = "SELECT title, release_year, rating, description FROM bed_dvd_db.film where film_id=?;";
                conn.query(sql1, [dvdID], function (err, result1) {
                    if (err) {
                        conn.end();
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result1);
                        const res1 = result1;
                        const sql2 = "SELECT category.name FROM category, film_category where film_category.film_id=? and film_category.category_id= category.category_id;";
                        conn.query(sql2, [dvdID], function (err, result2) {
                            if (err) {
                                conn.end();
                                console.log(err);
                                return callback(err, null);
                            }
                            else {
                                console.log(result2);
                                const res2 = result2;
                                const sql3 = "SELECT CONCAT (actor.first_name,' ', actor.last_name) AS fullname  FROM actor, film_actor where film_id=? and film_actor.actor_id=actor.actor_id;";
                                conn.query(sql3, [dvdID], function (err, result3) {
                                    conn.end();
                                    if (err) {
                                        console.log(err);
                                        return callback(err, null);
                                    }
                                    else {
                                        console.log(result3);
                                        let category = '';
                                        for (let i = 0; i < res2.length; i++) {
                                            if (i != (res2.length - 1)) {
                                                category += res2[i].name + ", ";
                                            } else {
                                                category += res2[i].name;
                                            }
                                        }
                                        let actors = '';
                                        for (let i = 0; i < result3.length; i++) {
                                            if (i != (result3.length - 1)) {
                                                actors += result3[i].fullname + ", ";
                                            } else {
                                                actors += result3[i].fullname;
                                            }
                                        }
                                        const results = { title: res1[0].title, category: category, release_year: res1[0].release_year, rating: res1[0].rating, actors: actors, description: res1[0].description };
                                        console.log(results);
                                        return callback(null, results);
                                    }
                                })
                            }
                        })

                    }
                })
            }
        })
    },

    // search actor by name
    getActorByName: function (name, callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql = "SELECT actor_id, first_name, last_name, DATE_FORMAT(last_update, '%m-%d-%Y %H:%i:%s') as last_update  FROM actor where CONCAT(actor.first_name,' ',actor.last_name) like ? ;";
                conn.query(sql, [('%' + name + '%')], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // search actor by actor id
    getActor: function (actorid, callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql = "SELECT actor_id, first_name, last_name, DATE_FORMAT(last_update, '%m-%d-%Y %H:%i:%s') as last_update  FROM actor where actor_id=?";
                conn.query(sql, [actorid], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // get all actors
    getActors: function (callback) {

        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql = "SELECT actor_id, first_name, last_name, DATE_FORMAT(last_update, '%m-%d-%Y %H:%i:%s') as last_update  FROM actor";
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // add new actor
    addActors: function (first_name, last_name, callback) {
        const conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql = "insert into actor (first_name, last_name) values (?,?);";
                conn.query(sql, [first_name, last_name], function (err, result) {
                    conn.end();
                    if (first_name == null || last_name == null || first_name.length == 0 || last_name.length == 0) {
                        console.log("Missing Data");
                        return callback("missing data", null);
                    }
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // update actor
    updateActor: function (first_name, last_name, actor_id, callback) {
        const conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }

            else {
                console.log("Database connected");
                if ((first_name == null || first_name.length == 0) && (last_name == null || last_name.length == 0)) {
                    return callback("missing data", null);
                }
                else if (first_name != null && first_name.length != 0 && last_name != null && last_name.length != 0) {
                    let sql = "update actor set first_name=?, last_name = ? where actor_id=?"
                    conn.query(sql, [first_name, last_name, actor_id], function (err, result) {
                        let results = result.affectedRows;
                        conn.end();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        }
                        else if (results == 0) {
                            console.log("Actor_Id doesn't exist");
                            return callback(null, null);
                        }
                        else {
                            console.log(result);
                            return callback(null, result);
                        }
                    })
                }
                else if (first_name != null && first_name.length != 0) {
                    let sql = "update actor set first_name = ? where actor_id=?"
                    conn.query(sql, [first_name, actor_id], function (err, result) {
                        let results = result.affectedRows;
                        conn.end();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        }
                        else if (results == 0) {
                            console.log("Actor_Id doesn't exist");
                            return callback(null, null);
                        }
                        else {
                            console.log(result);
                            return callback(null, result);
                        }
                    })
                }
                else {
                    let sql = "update actor set last_name = ? where actor_id=?"
                    conn.query(sql, [last_name, actor_id], function (err, result) {
                        let results = result.affectedRows;
                        conn.end();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        }
                        else if (results == 0) {
                            console.log("Actor_Id doesn't exist");
                            return callback(null, null);
                        }
                        else {
                            console.log(result);
                            return callback(null, result);
                        }
                    })
                }
            }

        })
    },

    // delete actor
    deleteActor: function (actor_id, callback) {
        const conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql = "delete from actor where actor_id =?";
                conn.query(sql, [actor_id], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        let results = result.affectedRows;
                        if (results == 0) {
                            console.log("Actor's id not found");
                            return callback(null, null);
                        }
                        else {
                            console.log(result);
                            return callback(null, result);
                        }
                    }
                })
            }
        })
    },

    // search film by category id w/o max price
    getFilmByCategory: function (category_id, maxPrice, callback) {
        const conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                if (maxPrice != null && maxPrice.length != 0 && maxPrice != "") {
                    const sql1 = "SELECT film.film_id, film.title, film.release_year, film.rating FROM film,category,film_category where film_category.category_id=? AND film_category.film_id=film.film_id  AND film_category.category_id=category.category_id AND rental_rate<=?;";
                    conn.query(sql1, [category_id, maxPrice], function (err, result) {
                        conn.end();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        }
                        else {
                            for (var i = 0; i < result.length; i++) {
                                result[i].film_id = (result[i].film_id).toString();
                                result[i].release_year = (result[i].release_year).toString();
                            }
                            console.log(result);
                            return callback(null, result);

                        }
                    })
                } else {
                    const sql2 = "SELECT film.film_id, film.title, film.release_year, film.rating FROM film,category,film_category where film_category.category_id=? AND film_category.film_id=film.film_id  AND film_category.category_id=category.category_id";
                    conn.query(sql2, [category_id], function (err, result) {
                        conn.end();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        }
                        else {
                            for (var i = 0; i < result.length; i++) {
                                result[i].film_id = (result[i].film_id).toString();
                                result[i].release_year = (result[i].release_year).toString();
                            }
                            console.log(result);
                            return callback(null, result);

                        }
                    })
                }
            }
        })
    },

    // Get all the customers
    getAllCust: function (callback) {
        const conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql = "SELECT customer.customer_id, customer.first_name, customer.last_name, customer.email, address.address, address.address2, address.postal_code, address.phone FROM customer, address where customer.address_id=address.address_id;";
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // search customers by name
    getCustByName: function (cust_name, callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql = "SELECT customer.customer_id, customer.first_name, customer.last_name, customer.email, address.address, address.address2, address.postal_code, address.phone FROM customer, address where customer.address_id=address.address_id AND CONCAT(customer.first_name,' ',customer.last_name) like ?;";
                conn.query(sql, [('%' + cust_name + '%')], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // search customer by customerid
    getCustByID: function (custId, callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql = "SELECT customer.customer_id, customer.first_name, customer.last_name, customer.email, address.address, address.address2, address.postal_code, address.phone FROM customer, address where customer.address_id=address.address_id AND customer.customer_id=?;";
                conn.query(sql, [custId], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // get payment with date for admin and customer
    getPayment: function (customer_id, start_date, end_date, callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback("Internal server error", null);
            }
            else {
                console.log("Database connected");
                var sql1 = "SELECT payment.payment_id, film.title,payment.amount,DATE_FORMAT(payment.payment_date, '%m-%d-%Y %H:%i:%s') as 'payment_date' FROM payment,rental,inventory, film  WHERE payment.payment_date >= ? AND payment.payment_date <= ? AND payment.customer_id=? AND payment.rental_id=rental.rental_id AND rental.inventory_id=inventory.inventory_id AND inventory.film_id=film.film_id;";
                conn.query(sql1, [start_date, end_date, customer_id], function (err, result1) {
                    if (err) {
                        console.log(err);
                        return callback("Internal server error", null);
                    }
                    else {
                        var res1 = result1;
                        var sql2 = "SELECT * from payment WHERE customer_id= ?;";
                        conn.query(sql2, [customer_id], function (err, result2) {
                            conn.end();
                            if (err) {
                                console.log(err);
                                return callback("Internal server error", null);
                            }
                            else if (result2.length != 0) {
                                if (res1.length == 0) {
                                    if (start_date > end_date) {
                                        return callback("Inavlid date range, start date should be earlier than the end date!", null);
                                    } else {
                                        return callback(null, res1);
                                    }
                                }
                                else {
                                    return callback(null, res1);
                                }
                            }
                            else {
                                return callback("Customer not found!", null);
                            }
                        })
                    }
                })
            }
        })
    },

    // get payment w/o date for customer
    getPaymentsCust: function (customer_id, callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback("Internal server error", null);
            }
            else {
                console.log("Database connected");
                var sql1 = "SELECT film.title,payment.amount,DATE_FORMAT(payment.payment_date, '%m-%d-%Y %H:%i:%s') as 'payment_date' FROM payment,rental,inventory, film  WHERE payment.customer_id=? AND payment.rental_id=rental.rental_id AND rental.inventory_id=inventory.inventory_id AND inventory.film_id=film.film_id;";
                conn.query(sql1, [customer_id], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback("Internal server error", null);
                    }
                    else {
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // get payment w/o date and cust ID for admin
    getAllPaymentsAdmin: function (callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback("Internal server error", null);
            }
            else {
                console.log("Database connected");
                var sql = "SELECT payment.payment_id,film.title,payment.amount,DATE_FORMAT(payment.payment_date, '%m-%d-%Y %H:%i:%s') as 'payment_date' FROM payment,rental,inventory, film  WHERE payment.rental_id=rental.rental_id AND rental.inventory_id=inventory.inventory_id AND inventory.film_id=film.film_id;";
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback("Internal server error", null);
                    }
                    else {
                        return callback(null, result);
                    }
                })
            }
        })
    },


    // Get all the customers
    getAllCities: function (callback) {
        const conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                const sql = "SELECT city_id,city FROM bed_dvd_db.city;";
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // add customer
    addCustomer: function (address1, address2, district, city_id, postal_code, phone, password, store_id, first_name, last_name, email, callback) {
        const conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log("Database not connected");
                return callback(err, null);
            }
            else {
                console.log("Database connected");
                var array = [address1, address2, district, city_id, postal_code, phone];
                const sql1 = "INSERT INTO address (address, address2, district, city_id, postal_code, phone)VALUES(?, ?,?,?,?,?)"
                conn.query(sql1, [address1, address2, district, city_id, postal_code, phone], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        const sql2 = "INSERT INTO customer (store_id, first_name, last_name, email, address_id, password)VALUES(?, ?,?,?,(SELECT address_id FROM address ORDER BY address_id DESC LIMIT 1), ?)"
                        conn.query(sql2, [store_id, first_name, last_name, email, password], function (err, result) {
                            conn.end();
                            if (err) {
                                if (err.code == "ER_DUP_ENTRY") {
                                    console.log("Duplicate entry");
                                    return callback("email already exist", null);
                                }
                                else {
                                    console.log(err);
                                    return callback(err, null);
                                }
                            }
                            else {
                                console.log(result);
                                return callback(null, result);
                            }
                        })
                    }
                })
            }
        })
    }

}
module.exports = dvd;