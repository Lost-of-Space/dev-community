import express from 'express';
import mongoose from 'mongoose';//for db connection
import 'dotenv/config'
import bcrypt from 'bcrypt'; //for hashing
import { nanoid } from 'nanoid';//id generator
import jwt from 'jsonwebtoken'
import cors from 'cors';
import admin from "firebase-admin";
import serviceAccountKey from "./dev-community-7f3b8-firebase-adminsdk-lzctm-9acd813bc6.json" assert {type: "json"}
import { getAuth } from "firebase-admin/auth"

//schema
import User from './Schema/User.js';
import Post from './Schema/Post.js';


const server = express();
let PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
})

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true
})


const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "No access token." })
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Access token is invalid." })
    }

    req.user = user.id
    next()
  })
}

const formatDataToSend = (user) => {

  const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)

  return {
    access_token,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
    email: user.personal_info.email,
    profile_img: user.personal_info.profile_img
  }
}

const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameNotUnique = await User.exists({ "personal_info.username": username }).then((result) => result)
  //add unique string to username
  isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";

  return username
}


server.post("/signup", (req, res) => {

  let { fullname, email, password } = req.body;

  //Data validation
  if (fullname.length < 4) {
    return res.status(403).json({ "error": "Fullname must be at least 4 letters long." })
  }
  if (!email.length) {
    return res.status(403).json({ "error": "Enter email." })
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ "error": "Email is invalid." })
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({ "error": "Password should be 6 to 20 chars long with a numeric, lower case and upper case." })
  }

  bcrypt.hash(password, 10, async (err, hashed_password) => {
    //generates username from email
    let username = await generateUsername(email);

    let user = new User({
      personal_info: { fullname, email, password: hashed_password, username }
    })

    user.save().then((u) => {

      return res.status(200).json(formatDataToSend(u))

    })
      .catch(err => {

        if (err.code == 11000) {
          return res.status(500).json({ "error": "Email is already in use." })
        }

        return res.status(500).json({ "error": err.message })
      })

  })

})

server.post("/signin", (req, res) => {

  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ "error": "Invalid Credentials." }) //Email not found
      }

      if (!user.google_auth) {
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err) {
            return res.status(403).json({ "error": "Error occured while login please try again" })
          }
          if (!result) {
            return res.status(403).json({ "error": "Invalid Credentials." }) //Incorrect password
          } else {
            return res.status(200).json(formatDataToSend(user))
          }

        });

      } else {
        return res.status(403).json({ "error": "Account was created using Google. Please, use Google to log in." })
      }

    })

    .catch(err => {
      console.log(err.message);
      return res.status(500).json({ "error": err.message })
    })
})

//Google auth
server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name } = decodedUser;

      let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) => {
        return u || null
      })

        .catch(err => {
          return res.status(500).json({ "error": err.message })
        })

      if (user) { //login
        if (!user.google_auth) {
          return res.status(403).json({ "error": "This email is already used without Google. Please log in with password to access the account." })
        }
      }
      else {//sign up
        let username = await generateUsername(email);

        user = new User({
          personal_info: { fullname: name, email, username },
          google_auth: true
        })

        await user.save().then((u) => {
          user = u;
        })
          .catch(err => {
            return res.status(500).json({ "error": err.message })
          })
      }

      return res.status(200).json(formatDataToSend(user))

    })
    .catch(err => {
      return res.status(500).json({ "error": "Failed to authenticate with google" })
    })

})


server.post('/create-post', verifyJWT, (req, res) => {

  let authorId = req.user;

  let { title, des, banner, tags, content, draft } = req.body;

  if (!title.length) {
    return res.status(403).json({ error: "You must provide a title." });
  }

  if (!draft) {
    if (!des.length || des.length > 200) {
      return res.status(403).json({ error: "You must provide a description under 200 characters." });
    }

    if (!banner.length) {
      return res.status(403).json({ error: "You must provide a banner." });
    }

    if (!content.blocks.length) {
      return res.status(403).json({ error: "There must be some content." });
    }

    if (!tags.length || tags.length > 10) {
      return res.status(403).json({ error: "There must be at least one tag, maximum 10." });
    }
  }

  tags = tags.map(tag => tag.toLowerCase());

  let post_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + "-" + nanoid();

  let post = new Post({
    title, des, banner, content, tags, author: authorId, post_id, draft: Boolean(draft)
  })

  post.save().then(post => {

    // test if post draft == true or false, and updating total posts count
    let incrementVal = draft ? 0 : 1;
    User.findOneAndUpdate({ _id: authorId }, { $inc: { "account_info.total_posts": incrementVal }, $push: { "posts": post._id } })

      .then(user => {
        return res.status(200).json({ id: post.post_id })
      })

      .catch(err => {
        return res.status(500).json({ error: "Failed tp update total posts number" })
      })
  })
    .catch(err => {
      return res.status(500).json({ error: err.message })
    })

})

server.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
});