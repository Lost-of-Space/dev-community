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
import Notification from './Schema/Notification.js';


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

      if (!user.provider_auth) {
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
  let { access_token } = req.body;

  try {
    const decodedUser = await getAuth().verifyIdToken(access_token);
    const { email, name } = decodedUser;

    const existingUser = await User.findOne({ "personal_info.email": email });

    if (existingUser) {
      if (!existingUser.provider_auth) {
        return res.status(403).json({
          error: "This email is already used without Google. login with password or Github."
        });
      }

      return res.status(200).json(formatDataToSend(existingUser));
    }

    const username = await generateUsername(email);

    const newUser = new User({
      personal_info: { fullname: name, email, username },
      provider_auth: true
    });

    const savedUser = await newUser.save();
    return res.status(200).json(formatDataToSend(savedUser));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to authenticate with Google." });
  }
});


//Github auth
server.post("/github-auth", async (req, res) => {
  let { access_token } = req.body;

  try {
    const decodedUser = await getAuth().verifyIdToken(access_token);
    const { email, name } = decodedUser;

    const existingUser = await User.findOne({ "personal_info.email": email });

    if (existingUser) {
      if (!existingUser.provider_auth) {
        return res.status(403).json({
          error: "This email is already used without Github. login with password or Google."
        });
      }

      return res.status(200).json(formatDataToSend(existingUser));
    }

    const username = await generateUsername(email);

    const newUser = new User({
      personal_info: { fullname: name, email, username },
      provider_auth: true
    });

    const savedUser = await newUser.save();
    return res.status(200).json(formatDataToSend(savedUser));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to authenticate with Github." });
  }
});


/*
  Posts
*/

// Latest Posts
server.post('/latest-posts', (req, res) => {

  let { page } = req.body;

  let maxLimit = 5; // The limit of posts that comes from server

  Post.find({ draft: false })
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "publishedAt": -1 })
    .select("post_id title des banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then(posts => {
      return res.status(200).json({ posts })
    })
    .catch(err => {
      return res.status(500).json({ error: err.message })
    })
})


server.post("/all-latest-posts-count", (req, res) => {
  Post.countDocuments({ draft: false })
    .then(count => {
      return res.status(200).json({ totalPosts: count })
    })
    .catch(err => {
      console.log(err.message);
      return res.status(500).json({ error: err.message })
    })
})

// Popular Posts
server.get("/popular-posts", (req, res) => {
  Post.find({ draft: false })
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
    .select("post_id title publishedAt -_id")
    .limit(10)
    .then(posts => {
      return res.status(200).json({ posts })
    })
    .catch(err => {
      return res.status(500).json({ error: err.message })
    })
})

//Get Posts
server.post("/get-post", (req, res) => {
  let { post_id, draft, mode } = req.body;

  let incrementVal = mode != 'edit' ? 1 : 0;

  Post.findOneAndUpdate({ post_id }, { $inc: { "activity.total_reads": incrementVal } })
    .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
    .select("title des content banner activity publishedAt post_id tags")
    .then(post => {

      User.findOneAndUpdate({ "personal_info.username": post.author.personal_info.username }, {
        $inc: { "account_info.total_reads": incrementVal }
      })
        .catch(err => {
          return res.status(500).json({ error: err.message });
        })

      if (post.draft && !draft) {
        return res.status(500).json({ error: 'You can not access a draft post' })
      }
      return res.status(200).json({ post });
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    })

})

// Searching
server.post("/search-posts", (req, res) => {

  let { tag, query, author, page, limit, eliminate_post } = req.body;

  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false, post_id: { $ne: eliminate_post } };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, 'i') }
  } else if (author) {
    findQuery = { author, draft: false }
  }

  let maxLimit = limit ? limit : 2; // The limit of posts that comes from server

  Post.find(findQuery)
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "publishedAt": -1 })
    .select("post_id title des banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then(posts => {
      return res.status(200).json({ posts })
    })
    .catch(err => {
      return res.status(500).json({ error: err.message })
    })
})

server.post("/search-posts-count", (req, res) => {
  let { tag, query, author } = req.body;

  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, 'i') }
  } else if (author) {
    findQuery = { author, draft: false }
  }


  Post.countDocuments(findQuery)
    .then(count => {
      return res.status(200).json({ totalPosts: count })
    })
    .catch(err => {
      return res.status(500).json({ error: err.message })
    })
})

server.post("/search-users", (req, res) => {
  let { query, isExact } = req.body;

  let searchCondition;

  if (isExact) {
    //searching by @username
    searchCondition = { "personal_info.username": new RegExp(`^${query}`, 'i') };
  } else {
    //default search
    searchCondition = {
      $or: [
        { "personal_info.username": new RegExp(query, 'i') },
        { "personal_info.fullname": new RegExp(query, 'i') }
      ]
    };
  }

  User.find(searchCondition)
    .limit(50)
    .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
    .then(users => {
      return res.status(200).json({ users });
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });
});

//Get user profile
server.post("/get-profile", (req, res) => {

  let { username } = req.body;

  User.findOne({ "personal_info.username": username })
    .select("-personal_info.password -provider_auth -updatedAt -posts")
    .then(user => {
      return res.status(200).json(user);
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });
})



// Create Post
server.post('/create-post', verifyJWT, (req, res) => {

  let authorId = req.user;

  let { title, des, banner, tags, content, draft, id } = req.body;

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

  let post_id = id || title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + "-" + nanoid();

  if (id) {
    Post.findOneAndUpdate({ post_id }, { title, des, banner, content, tags, draft: draft ? draft : false })
      .then(() => {
        return res.status(200).json({ id: post_id })
      })
      .catch(err => {
        return res.status(500).json({ error: err.message })
      })
  }

  else {
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
  }
})

server.post("/like-post", verifyJWT, (req, res) => {
  let user_id = req.user;

  let { _id, isLikedByUser } = req.body;

  let incrementVal = !isLikedByUser ? 1 : -1;

  Post.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": incrementVal } })
    .then(post => {
      if (!isLikedByUser) {
        let like = new Notification({
          type: "like",
          post: _id,
          notification_for: post.author,
          user: user_id
        })

        like.save().then(notification => {
          return res.status(200).json({ liked_by_user: true })
        })
      } else {
        Notification.findOneAndDelete({ user: user_id, post: _id, type: "like" })
          .then(data => {
            return res.status(200).json({ liked_by_user: false })
          })

          .catch(err => {
            return res.status(500).json({ error: err.message })
          })
      }
    })
})

server.post("/isliked-by-user", verifyJWT, (req, res) => {
  let user_id = req.user;

  let { _id } = req.body;

  Notification.exists({ user: user_id, type: "like", post: _id })
    .then(result => {
      return res.status(200).json({ result })
    })
    .catch(err => {
      return res.status(500).json({ error: err.message })
    })
})


server.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
});