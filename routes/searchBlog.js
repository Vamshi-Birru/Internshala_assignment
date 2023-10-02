const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { getBlogs } = require("./getData");

const memoizedSearch = _.memoize(searchBlogs, (query) => query, {
    maxAge: 6000,
});

router.get('/', async (req, res) => {
    try {
        const query = req.query.query.toLowerCase();
        const cachedResult = await memoizedSearch(query);

        if (cachedResult) {
            console.log(`Cached result found for query: ${query}`);
            return res.status(200).json(cachedResult);
        }

        const blogs = await getBlogs();

        if (!Array.isArray(blogs)) {
            const errorMessage = 'Failed to fetch data from API';
            console.error(errorMessage);
            return res.status(500).json({ error: errorMessage });
        }

        const blogsWithQuery = blogs.filter((blog) =>
            blog.title.toLowerCase().includes(query)
        );

        memoizedSearch(query, blogsWithQuery); 

        res.status(200).json(blogsWithQuery);
    } catch (error) {
        console.error("Error in /api/blog-search:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

function searchBlogs(query) {
    return null; 
}
