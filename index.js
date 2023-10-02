const express = require('express');
const axios = require('axios');
const {memoize}=require('lodash');
const analyzeData=require('./routes/analyzeData');
const searchBlog=require("./routes/searchBlog");
const cors=require("cors");

const app = express(); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/blog-stats",analyzeData);
app.use("/api/blog-search",searchBlog);

app.listen(8080, () => {
    console.log("Its working!!!");
})