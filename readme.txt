// Name: Soh Jian Min
// Class: DIT/FT/1B/04
// Admission Number: 2238856

Steps
=====

1. unizip "P2238856CA2-1B04"

2. open "bed_dvd_db_Soh_Jian_Min_P2238856" with notepad

3. copy the text from the notepad

4. open mysql and add a new sql file

5. paste the copied text to the new sql file and run to create the "bed_dvd_db" schema

6. Open "P2238856CA2-1B04" folder in visual studio code

7. go to the terminal and choose cmd

8. cd front_End

9. run server for front_End (http://localhost:3001/)
	-->nodemon server.js

10. cd express_Server

11. run server for express_Server (http://localhost:8081/)
	-->nodemon server.js



Steps to test
=============

1. Proceed to http://localhost:3001/home.html to test the home page for public (Assignment requirement 2, 3, 4)

2. Proceed to http://localhost:3001/login.html, login to admin with email: Jon.Stephens@sakilastaff.com and password: Pa$$w0rd (Assignment requirement 1)

3. You can now test (Assignment requirement 5,6) (The add actor and customer is beside the logout button at the navigation header)

4. To login as a customer, logout, and proceed to http://localhost:3001/login.html, login to customer with email: MARY.SMITH@sakilacustomer.org and password: Pa$$w0rd 

5. Steps to test additional features is provided under "P2238856CA2-1B04" folder in "AdditionalFeatures_Documentation"


Changes made to database
========================
1. Password in staff table (admin) is configured to be not null.
3. A column named password is made to be not null and added for the customer table.
