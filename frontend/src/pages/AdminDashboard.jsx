import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API from '../utils/api';

const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [newBlog, setNewBlog] = useState({ title: '', content: '' });
    const [editBlog, setEditBlog] = useState(null);
    const [editContent, setEditContent] = useState({ title: '', content: '' });
    //const { user } = useSelector((state) => state.auth);


    const API_URL = `${API}/blogs`;
    const token = localStorage.getItem('token');


    // Fetch Blogs
    const fetchBlogs = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBlogs(response.data.data.blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error.response?.data?.message || error.message);
        }
    };

    // Create Blog
    const handleCreateBlog = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                API_URL,
                newBlog,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response)
            //setBlogs([...blogs, response.data]);
            setNewBlog({ title: '', content: '' });
        } catch (error) {
            console.error('Error creating blog:',error );
        }
    };

    // Delete Blog
    const handleDeleteBlog = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBlogs(blogs.filter((blog) => blog._id !== id));
        } catch (error) {
            console.error('Error deleting blog:', error.response?.data?.message || error.message);
        }
    };

    // Update Blog
    const handleUpdateBlog = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${API_URL}/${editBlog}`,
                editContent,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setBlogs(
                blogs.map((blog) => (blog._id === editBlog ? response.data : blog))
            );
            setEditBlog(null);
            setEditContent({ title: '', content: '' });
        } catch (error) {
            console.error('Error updating blog:', error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [handleCreateBlog,handleUpdateBlog,handleDeleteBlog]);

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Create Blog Form */}
            <form onSubmit={handleCreateBlog} className="mb-6">
                <div className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={newBlog.title}
                        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Content</label>
                    <textarea
                        value={newBlog.content}
                        onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Create Blog
                </button>
            </form>

            {/* List Blogs */}
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                    <div key={blog._id} className="border p-4 rounded-md mb-4">
                        {editBlog === blog._id ? (
                            <form onSubmit={handleUpdateBlog}>
                                <input
                                    type="text"
                                    value={editContent.title}
                                    onChange={(e) =>
                                        setEditContent({ ...editContent, title: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border rounded-md mb-2"
                                    required
                                />
                                <textarea
                                    value={editContent.content}
                                    onChange={(e) =>
                                        setEditContent({ ...editContent, content: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border rounded-md mb-2"
                                    required
                                />
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditBlog(null)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold">{blog.title}</h2>
                                <p className="mb-4">{blog.content}</p>
                                <button
                                    onClick={() => {
                                        setEditBlog(blog._id);
                                        setEditContent({ title: blog.title, content: blog.content });
                                    }}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteBlog(blog._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-700">No blogs available.</p>
            )}
        </div>
    );
};

export default AdminDashboard;
