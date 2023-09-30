const express = require('express');
const router = express.Router();
const _ = require('lodash');

const {getBlogs}=require("./getData");

router.get("/", async (req, res, next) => {
    try {
        const blogs =await getBlogs();

        if (!Array.isArray(blogs)) {
            const errorMessage = 'Failed to fetch data from API';
            console.error(errorMessage);
            return res.status(blogs.response.status).json({ error: errorMessage });
        }
        const totalBlogs = blogs.length;
        const longestTitleBlog = _.maxBy(blogs, (blog) => blog.title.length);
        const blogsWithPrivacy = blogs.filter((blog) =>
            blog.title.toLowerCase().includes('privacy')
        );
        const uniqueBlogTitles = _.uniqBy(blogs, 'title');
        const statistics = {
            totalBlogs,
            longestTitle: longestTitleBlog.title,
            blogsWithPrivacy: blogsWithPrivacy.length,
            uniqueBlogTitles: uniqueBlogTitles.map((blog) => blog.title),
        };
        
        res.status(200).json(statistics);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router; 