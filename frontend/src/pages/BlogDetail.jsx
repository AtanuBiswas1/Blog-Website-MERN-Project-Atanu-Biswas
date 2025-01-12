import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import axios from "axios";

function BlogDetail() {
  const { id } = useParams(); // Get the blog ID from the route
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const API_URL = `${API}/blogs/${id}`;
  const token = localStorage.getItem("token");
  

  const fetchBlogs = async () => {
    try {
      setError("");
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setBlog(response.data.data.blog);
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // Fetch the blog post details from your backend using the ID
    // fetch(`https://your-api-url.com/blogs/${id}`)
    //     .then((response) => response.json())
    //     .then((data) => setBlog(data))
    //     .catch((error) => console.error("Error fetching blog:", error));
  }, [id]);

  if (!token) {
    return (
      
        
        <div>Login Please....</div>
     
    );
  }

  if (!blog) {
    return (
        <div>
            <div>{error}</div>
            <div>Loading...</div>
        </div>
    ); // Show a loading message while fetching data
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      {/* <p className="text-gray-600 mt-2">{blog.date}</p> */}
      <div className="mt-4">
        <p>{blog.content}</p> {/* Assuming 'content' holds the blog details */}
      </div>
    </div>
  );
}

export default BlogDetail;
