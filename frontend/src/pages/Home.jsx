import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import { fetchBlogs } from '../redux/slices/blogSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from '../utils/api';

//const API_URL = 'http://localhost:8000/api/blogs';
const API_URL = `${API}/blogs`;
//const token = localStorage.getItem('token');

const Home = () => {
    //const dispatch = useDispatch();
    const [Blogs,setBlogs]=useState([])
    const [loading,setLoading]=useState(false)
    //const { posts, loading } = useSelector((state) => state.blogs);
    const { token } = useSelector((state) => state.auth);

    const fetchBlogs = async () => {
        setLoading(true)
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.data.blogs)
            setBlogs(response.data.data.blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error.response?.data?.message || error.message);
        }
        setLoading(false)
    };

    useEffect(() => {
        if (token) fetchBlogs();
    }, [token]);

    if (!token) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-2xl font-bold">Please login to read blogs</h2>
            </div>
        );
    }

    return (
        <div className="p-6">
            {loading ? (
                <h2 className="text-center text-xl">Loading blogs...</h2>
            ) : Blogs.length === 0 ? (
                <h2 className="text-center text-xl">No blogs posted yet!</h2>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Blogs.map((post) => (
                        <div
                            key={post._id}
                            className="border rounded p-4 shadow hover:shadow-lg"
                        >
                            <h3 className="font-bold text-lg">{post.title}</h3>
                            <p className="mt-2">{post.content.substring(0, 100)}...</p>
                            <Link
                                to={`/blogs/${post._id}`}
                                className="text-blue-500 mt-4 inline-block"
                            >
                                Read More
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
