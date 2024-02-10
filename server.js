const { urlencoded } = require('body-parser')
const express=require('express')
const app=express()
const categorized_workflow=require('./categorized_workflow')
app.use(express.json(urlencoded=true))

app.get('/emergency',(req,res)=>{
    const category=req.body.category
    const latitude=req.body.latitude
    const longitude=req.body.longitude
    categorized_workflow(category,latitude,longitude)

})
app.listen(PORT,(req,res)=>{
    console.log("running on port ");
})