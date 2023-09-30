
const axios = require('axios');

const getBlogs = async () => {
  try {
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
      throw new Error(errorMessage);
    }

    return response.data.blogs;
  } catch (err) {
    throw err;
  }
};

module.exports = { getBlogs };
