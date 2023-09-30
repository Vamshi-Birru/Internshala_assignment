const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const app = express();
const getBlogs=async ()=>{
    try{
        const apiUrl = "https://intent-kit-16.hasura.app/api/rest/blogs";
        const adminSecret = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';
        const response = await axios.get(apiUrl, {
            headers: {
                'x-hasura-admin-secret': adminSecret,
            },
        });

        if (response.status !== 200) {
            const errorMessage = `Failed to fetch data from the API. Status code: ${response.status}`;
            console.error(errorMessage);
            return res.status(response.status).json({ error: errorMessage });
        }
        return response.data.blogs;
    }
    catch(err){
       return err;
    }
}
app.get("/api/blog-stats", async (req, res, next) => {
    try {
        const blogs = getBlogs();
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
app.get('/api/blog-search', async (req, res, next) => {
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





app.listen(8080, () => {
    console.log("Its connected!!!");
})