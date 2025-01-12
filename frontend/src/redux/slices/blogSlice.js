import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async (_, thunkAPI) => {
    try {
        const { data } = await API.get('/posts');
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const createBlog = createAsyncThunk('blogs/createBlog', async (blogData, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
        const { data } = await API.post('/posts', blogData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const blogSlice = createSlice({
    name: 'blogs',
    initialState: { posts: [], loading: false, error: null },
    reducers: {
        
    },
    
});

export default blogSlice.reducer;
