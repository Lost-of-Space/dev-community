import { useContext, useEffect } from "react";
import { PostContext } from "../pages/post.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const PostInteraction = () => {

  let { post, post: { _id, title, banner, post_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setPost, isLikedByUser, setIsLikedByUser, setCommentsWrapper } = useContext(PostContext)

  let { userAuth: { username, access_token } } = useContext(UserContext);

  useEffect(() => {
    if (access_token) {
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", { _id }, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      })
        .then(({ data: { result } }) => {
          setIsLikedByUser(Boolean(result));
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [])

  const handleLike = () => {
    if (access_token) {
      setIsLikedByUser(preVal => !preVal);

      !isLikedByUser ? total_likes++ : total_likes--;

      setPost({ ...post, activity: { ...activity, total_likes } })

      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-post", { _id, isLikedByUser }, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      })
        .then(({ data }) => {
          console.log(data);
        })
        .catch(err => {
          console.log(err);
        })

    } else {
      toast.error("Log in to like the post")
    }
  }

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-6">
          <div className="flex gap-3 items-center">
            <button
              onClick={handleLike}
              className={"w-10 h-10 rounded-full flex items-center justify-center " + (isLikedByUser ? "bg-red/20 text-red" : "bg-grey")}>
              <span className={"icon fi " + (isLikedByUser ? "fi-sr-heart" : "fi-br-heart")}></span>
            </button>
            <p className="text-xl text-dark-grey">{total_likes}</p>
          </div>

          <div className="flex gap-3 items-center">
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey"
              onClick={() => setCommentsWrapper(preVal => !preVal)}
            >
              <span className="fi fi-br-comment-dots"></span>
            </button>
            <p className="text-xl text-dark-grey">{total_comments}</p>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          {
            username == author_username ?
              <Link to={`/editor/${post_id}`} className="w-auto h-10 px-3 btn-mini">Edit</Link>
              :
              ""
          }
          <Link to={`https://twitter.com/intent/tweet?text=Read Post: ${title}&url=${location.href}`} target="_blank">
            <span className="fi fi-brands-twitter text-xl hover:text-twitter"></span>
          </Link>
        </div>
      </div>
      <hr className="border-grey my-2" />
    </>
  )

}

export default PostInteraction;