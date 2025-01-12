const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandaler=require("../utils/asyncHandaler.js")
const ApiError=require("../utils/ApiError.js")
const ApiResponce=require("../utils/ApiResponce.js")




const generateAccessToken = async (userId) => {
  console.log("line no 11 ",userId);
  try {
    const user = await User.findById(userId);
    console.log("line no 14 ",user)
    const accessToken = await user.generateAccessToken();
    //console.log({accessToken});
    return accessToken; // if any show error then check this please
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access Token"
    );
  }
};

const register = asyncHandaler(async (req, resp) => {
  // user data get from frontend
  const { name, email, password } = req.body;
  //console.log({userName})

  if (name === "") {
    throw new ApiError(400, "User Name is required !!");
  }
  if (email === "") {
    //throw new ApiError(400, "Email ID is required !!");
    console.log(new ApiError(400, "Email ID is required !!"));
    return resp
      .status(409)
      .json(new ApiResponce(400, "", "Email ID is required !!"));
  }
  if (password === "") {
    console.log(new ApiError(400, "Password is required !!"));
    return resp
      .status(409)
      .json(new ApiResponce(400, "", "Password is required !!"));
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    //throw new ApiError(409, "This mail id already exists");
    console.log(new ApiError(409, "This mail id already exists"));
    return resp
      .status(409)
      .json(new ApiResponce(409, "", "This mail id already exists"));
  }
  /*
  return resp
    .status(201)
    .json( new ApiError(409, "This mail id already exists"));
  */
  // let avatarLocalPath = req.files?.avatar?.avatar[0]?.path;
  // let avatar = "";
  // if (avatarLocalPath) avatar = await uploadOnCloudinary(avatarLocalPath); //|| ""

  // create database
  // const user = await User.create({
  //   name: userName,
  //   // avatar: avatar?.url || "",
  //   //await User.create({ name, email, password })
  //   email,
  //   password,
  // });
  const user = await User.create({ name, email, password });
  const checkUsercreate = await User.findById(user._id).select("-password");

  if (!checkUsercreate) {
    throw new ApiError(500, "Something  went wrong while registering user");
  }

  return resp
    .status(201)
    .json(
      new ApiResponce(200, checkUsercreate, "User registered successfully")
    );
});

// const register = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const user = await User.create({ name, email, password });
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   //console.log(req.body)
//   try {
//     const user = await User.findOne({ email });
//     // console.log(user)
//     // console.log("process.env.JWT_SECRET===>",process.env.JWT_SECRET)
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );
//     console.log("Token----->",token)
//     return res.json({ token });
//   } catch (err) {
//     return res.status(500).json("authController.js file error :",{ error: err.message });
//   }
// };
const login = asyncHandaler(async (req, resp) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new ApiError(400, "Email id and password required");
  }

  const user = await User.findOne({ email });
  //console.log(user);

  if (!user) {
    console.log(new ApiError(404, "User does not exist"));
    return resp
      .status(409)
      .json(new ApiResponce(409, "", "This mail id already exists"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    // throw new ApiError(401, "Password incorrect")
    console.log(new ApiError(401, "Password incorrect"));
    return resp
      .status(401)
      .json(new ApiResponce(401, "", "Password incorrect"));
  }
  //console.log(user._id);

  const accessToken = await generateAccessToken(user._id);
  //console.log("line 103",accessToken);
  const loggedInUser = await User.findById(user._id).select("-password");
  

  const option = {
    // this option works for anyone can't modify cookie by frontend
    //httpOnly: true,
    secure: true,
    sameSite: 'None',               // Allow cross-site cookies
    maxAge:24*60*60*1000,    // 1 day in milliseconds (expire in 24 hours)
    
  };

  return resp
    .status(200)
    .json(
      // send data in cookie from backend to frontend
      new ApiResponce(
        200,
        {
          user: loggedInUser,
          accessToken,
          authenticated:true,
        },
        "User logged In Successfully"
      )
    );
});

// const logout = asyncHandaler(async (req, resp) => {
//   await User.findByIdAndUpdate(req.user._id, {
//     new: true,
//   });
//   const option = {
//     httpOnly: true,
//     secure: true,
//   };
//   return resp
//     .status(200)
//     .json(new ApiResponce(200, {}, "User logged out"));
// });
module.exports = { register, login};
