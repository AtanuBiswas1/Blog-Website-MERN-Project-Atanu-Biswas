const express = require('express');
const { createBlog, getBlogs, deleteBlog,updateBlog, getBlogbyID } = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getBlogs);
router.get("/:id",getBlogbyID)
router.post('/', protect, admin, createBlog);
router.delete('/:id', protect, admin, deleteBlog);
router.put("/:id", protect,admin, updateBlog);

module.exports = router;
