//API endpoint
let projectData = {};

const express=require('express');
const app=express();


//undertand cors and body parser
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());


app.use(express.static('website'));


const port=3000;
app.listen(port, ()=> console.log("Running on port",port));

app.get('/getAll',(req,res)=>{
    
    res.send(projectData);
});

app.post('/addData',(req,res)=>{

    let data=req.body;
    projectData={
        temp: data.temp,
        city:data.city,
        date: data.date,
        content: data.content

    };
  
     res.send(projectData);
    
});







