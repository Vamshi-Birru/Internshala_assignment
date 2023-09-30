const express = require('express');
const axios = require('axios');
const {memoize}=require('lodash');
const analyseData=require('./routes/analyseData');
const searchBlog=require("./routes/searchBlog");
const cors=require("cors");

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/blog-stats",analyseData);
app.use("/api/blog-search",searchBlog);
app.listen(8080, () => {
    console.log("Its connected!!!");
})