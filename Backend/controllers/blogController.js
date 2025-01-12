const Blog = require("../models/Blog");
const asyncHandaler=require("../utils/asyncHandaler.js")
const ApiError=require("../utils/ApiError.js")
const ApiResponce=require("../utils/ApiResponce.js")

// const createBlog = async (req, res) => {
//   try {
//     const blog = await Blog.create({ ...req.body, author: req.user.id });
//     res.status(201).json(blog);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
const createBlog = asyncHandaler(async (req, resp) => {
    
      const blog = await Blog.create({ ...req.body, author: req.user.id });
      //res.status(201).json(blog);
      // console.log("blogcon===>18==>",req.body)
      // console.log("blogcon===>19==>",blog)
      const checkUserBlogCreate = await Blog.findById(blog._id);

      if (!checkUserBlogCreate) {
        console.log(new ApiError(500, "server Error for add blog "));
        return resp
          .status(500)
          .json(new ApiResponce(500, " ", "server Error for add Blog "));
      }

      return resp.status(201).json(
        new ApiResponce(
          200,
          {
            Blog:blog
          },
          "successfully created"
        )
      );

    
      
    
  });


const getBlogs = asyncHandaler(async (req, res) => {
  
  const blogs = await Blog.find().populate("author", "name email");
  
  if (!blogs) {
    console.log(new ApiError(404, "No blogs found"));
    return res
      .status(404)
      .json(new ApiResponce(404, null, "No blogs found"));
  }

  return res.status(200).json(
    new ApiResponce(
      200,
      {
        blogs,
      },
      "Blogs retrieved successfully"
    )
  );
});

const getBlogbyID = asyncHandaler(async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const blog = await Blog.findById(id).populate("author", "name email");
  console.log(blog)
  if (!blog) {
    console.log(new ApiError(404, "No blogs found"));
    return res
      .status(404)
      .json(new ApiResponce(404, null, "No blogs found"));
  }

  return res.status(200).json(
    new ApiResponce(
      200,
      {
        blog,
      },
      "Blogs retrieved successfully"
    )
  );
});



// const getBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find().populate("author", "name email");
//     res.json(blogs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const deleteBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog || blog.author.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     await blog.remove();
//     res.json({ message: "Blog deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const deleteBlog = asyncHandaler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  console.log(blog)

  // Check if the blog exists and if the user is authorized to delete it
  if (!blog || blog.author.toString() !== req.user.id) {
    console.log(new ApiError(403, "Access denied"));
    return res.status(403).json(new ApiResponce(403, null, "Access denied"));
  }

  // Remove the blog
  //await blog.remove();
  await Blog.deleteOne({ _id:req.params.id });

  return res.status(200).json(
    new ApiResponce(200, null, "Blog deleted successfully")
  );
});

const updateBlog = asyncHandaler(async (req, res) => {
  const { title, content} = req.body;

  // Find the blog by ID
  const blog = await Blog.findById(req.params.id);

  // Check if the blog exists and if the user is authorized to update it
  if (!blog || blog.author.toString() !== req.user.id) {
    console.log(new ApiError(403, "Access denied"));
    return res.status(403).json(new ApiResponce(403, null, "Access denied"));
  }

  // Update the blog fields
  if (title) blog.title = title;
  if (content) blog.content = content;
  

  // Save the updated blog
  const updatedBlog = await blog.save();

  return res.status(200).json(
    new ApiResponce(200, updatedBlog, "Blog updated successfully")
  );
});



module.exports = { createBlog, getBlogs, deleteBlog,updateBlog ,getBlogbyID};
