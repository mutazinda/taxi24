 var express = require('express')
var app = express()
var session = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv').config()
var exphbs = require('express-handlebars')
var path = require('path');
 var hbs =require('express-hbs')
 //const { Pool, Client } = require('pg')
const connectionString = 'postgresql://postgres:123@localhost:5432/postgres'
const nunjucks = require("nunjucks");
nunjucks.configure("views", { express: app });

const pg = require("pg");
const { Client } = require("pg");
const client = new Client({
  connectionString: connectionString })


client.connect();

//For BodyParser

app.use(bodyParser.json());
app.use( express.static( './pepe/views')) 
app.use(bodyParser.urlencoded({
    extended: true
})); 
 
//For Handlebars
app.set('views', './pepe/exercise')
app.set('view engine', '.hbs');
 app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

nunjucks.configure(path.join(__dirname,'./pepe/views'),{
autoescape:true,
express:app
});

app.get( '/html', async function(req, res)  {

const data = { driver_id  : req.body.driver_id} 
   const rez = await client.query('SELECT  driver_id FROM driver');
const driver = rez.rows;
  return res.render("driver.html", { driver });
});

app.get( '/htmle', async function(req, res)  {

const data = {location_name  : req.body.location_name, driver_name : req.body.driver_name, distance_km  : req.body.distance_km} 
   const rez = await client.query("SELECT location_name, driver_name, distance_km FROM driver_tax where location_name=($1)", [data.location_name]);
const driver_tax = rez.rows;
  return res.render("drive.html", { driver_tax });
});

app.post('/complete', async function(req, res, next)  {
    
const data = { trip_id  : req.body.trip_id, status  : req.body.status} 
   const rez = await client.query("update  trip  set status ='completed' where trip_id=($1)", [data.trip_id]);
 return res.render("tripupdate.html")    
//res.send('ok')
})
app.post('/creat', async function(req, res, next)  {
    
const data = { driver_id  : req.body.driver_id, rider_id  : req.body.rider_id} 
   const rez = await client.query('insert into trip (driver_id,rider_id) values($1, $2) allow duplicate status = "completed" ',  [data.driver_id, data.rider_id] );
 return res.render("tripupdate.html")    
//res.send('ok')
})
app.get("/li", async function(req, res) {
  // show list of all students
  const rez = await client.query("SELECT  driver_id, driver_name,availability  FROM driver");
  const driver = rez.rows;
  return res.render("output.html", { driver });
});
app.get("/litrip", async function(req, res) {
  // show list of all students
  const rez = await client.query("SELECT  *  FROM trip_view where status = 'active' ");
  const trip_view = rez.rows;
  return res.render("activetrip.html", { trip_view });
});
app.get("/lis", async function(req, res) {
  // show list of all students
  const rez = await client.query("SELECT  driver_id, driver_name,availability  FROM driver where availability=($1)",['yes']);
  const driver = rez.rows;
  return res.render("output.html", { driver });
});
app.get("/invoice", async function(req, res) {
  // show list of all students
  const rez = await client.query("SELECT  *  FROM get_invoice where status ='completed' ");
  const get_invoice = rez.rows;
  return res.render("invoice.html", { get_invoice });
});
app.post('/lise', async function(req, res) {
  // show list of all students
const data = {location_name  : req.body.location_name, driver_name : req.body.driver_name, distance_km  : req.body.distance_km} 
   const rez = await client.query("SELECT location_name, driver_name, distance_km FROM driver_tax where location_name=($1)", [data.location_name]);
const driver_tax = rez.rows;
return res.render("contacte.html", { driver_tax });
});
app.post('/list', async function(req, res) {
const data = { driver_id  : req.body.driver_id, driver_name  : req.body.driver_name, availability  : req.body.availability}
  const rez = await client.query("SELECT  driver_id, driver_name, availability  FROM driver where driver_id=($1)", [data.driver_id]);
const driver = rez.rows;
  return res.render("output.html", { driver });
});
app.post('/riders', async function(req, res) {
const data = { rider_id  : req.body.rider_id, rider_name  : req.body.rider_name}
  const rez = await client.query("SELECT  rider_id, rider_name  FROM rider where rider_id=($1)", [data.rider_id]);
const rider = rez.rows;
  return res.render("listrider.html", { rider });
});
app.get("/allrider", async function(req, res) {
  // show list of all students
  const rez = await client.query("SELECT  rider_id, rider_name  FROM rider");
  const rider = rez.rows;
  return res.render("listrider.html", { rider });
});

app.listen(5000, function(err) {
 
    if (!err)
 
        console.log("Site is live");
         
    else console.log(err)
 
});



