const express = require('express');
const router = express.Router();
const {getBlogs}=require("./getData");

router.get('/', async (req, res, next) => {
    try {
        const blogs=await getBlogs();
        const query = req.query.query.toLowerCase();
         if (!Array.isArray(blogs)) {
            const errorMessage = 'Failed to fetch data from API';
            console.error(errorMessage);
            return res.status(blogs.response.status).json({ error: errorMessage });
        }
        const blogsWithQuery = blogs.filter((blog) =>
            blog.title.toLowerCase().includes(query)
        );
         res.status(200).json(blogsWithQuery);
    } catch (error) {
        console.error("Error in /api/blog-search:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;