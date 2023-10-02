const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { getBlogs } = require("./getData");

async function analyzeData() {
    try {
        const blogs = await getBlogs();
        if (!Array.isArray(blogs)) {
            const errorMessage = 'Failed to fetch data from API';
            console.error(errorMessage);
            return { error: errorMessage };
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
        return statistics;
    } catch (err) {
        console.error("Error: ", err);
        return { error: 'Internal Server Error' };
    }
}

const memoizedAnalyzeData = _.memoize(analyzeData, () => 'statistics', {
    maxAge: 60000,
});

router.get("/", async (req, res, next) => {
    try {
       
        const cachedResult = await memoizedAnalyzeData();
        if (cachedResult.error) {
            return res.status(500).json({ error: cachedResult.error });
        }
        res.status(200).json(cachedResult);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
