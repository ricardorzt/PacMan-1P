//Example usage in the command prompt
//node Server.js

const port=880;//Specify a port for our web browser
const express= require('express'); //load express with the use of requireJS

const app=express();//Create an instance of the express library

app.use(express.static(__dirname +'/')); //Serving static files
app.listen(port, function(){ //Listener for specified port
    console.log("Server running at http://localhost:"+port);
});