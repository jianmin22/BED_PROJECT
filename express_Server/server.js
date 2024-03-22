// Name: Soh Jian Min
// Class: DIT/FT/1B/04
// Admission Number: 2238856

const app = require("./controller/app");
const port = 8081;
const hostname = "localhost";
const server = app.listen(port, hostname, function(){
    console.log(`Web app hosted at http://${hostname}:${port}`);
}) 