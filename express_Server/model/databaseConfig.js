// Name: Soh Jian Min
// Class: DIT/FT/1B/04
// Admission Number: 2238856

var mysql = require("mysql");
var dbconnect = {
    getConnection: function () {
    var conn = mysql.createConnection({
    connectionLimit: 100,
    host: "127.0.0.1",
    user: "bed_dvd_root",
    password: "pa$$woRD123",
    database: "bed_dvd_db",
    multipleStatements: false
    });
    return conn;
    }
    };
    module.exports = dbconnect;
