const express=require("express");
const mongoose=require("mongoose");
const ejs=require('ejs');


const app=express();
app.use(express.json());
app.use(express.urlencoded({extented:true}));
app.set('view engine','ejs');

app.get("/",(req,res)=>{
    res.send("hello");
})

app.listen(3000,()=>{
    console.log("server running")
})