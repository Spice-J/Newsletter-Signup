//jshint esversion: 6
    
    // Require Section
    const express = require("express");
    const bodyParser = require("body-parser");
    const request = require("request");
    const https = require("https");
    
    const app = express();
    
    // Static Folder
    app.use(express.static("public"));
    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    // Tracking HTML File
    app.get("/", function(req, res) {
        res.sendFile(__dirname + "/signup.html");
    });
    // Signup Route
    app.post("/", function(req, res) {
        const firstName = req.body.fName;
        const lastName = req.body.lName;
        const email = req.body.email;
    
    // Construct Requesting data
        const data = {
            members: [
                {
                    email_address: email,
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
                }
            ]
        };
    
    // Stringify Input data
        const jsonData = JSON.stringify(data);
    
    // URL
        const url = "https://us11.api.mailchimp.com/3.0/lists/2321f1cc92";
    
    // Options for accessing mailchimp API
        const options = {
            method: 'POST',
            auth: "SpiceCode:" + process.env.KEY
        };
    
    // Request and send back data to Mailchimp
        const request = https.request(url, options, function(response) {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
    
            response.on("data", function(data) {
                console.log(JSON.parse(data));
            });
        });
    
    // Showing the status code on hyper terminal
        request.write(jsonData);
    // End of Request
        request.end();
    
    });
    
    // Redirecting Codes:
    
    // Failure to Signup
    app.post("/failure", function(req, res) {
        res.redirect("/");
    });
    
    // Success to Signup
    app.post("/success", function(req, res) {
        res.redirect("/");
    });
    
    // Server PORT Starter
    app.listen(process.env.PORT || 3000, function() {
        console.log("Server started on port 3000");
    });