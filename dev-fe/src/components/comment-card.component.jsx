import toast from "react-hot-toast";
import { UserContext } from "../App";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import CommentField from "./comment-field.component";
import { PostContext } from "../pages/post.page";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {

  let { commented_by: { personal_info: { profile_img, fullname, username: commented_by_username } }, commentedAt, comment, _id, children } = commentData;

  let { post, post: { comments, activity, activity: { total_parent_comments }, comments: { results: commentsArr }, author: { personal_info: { username: post_author } } }, setPost, setTotalParentCommentsLoaded } = useContext(PostContext);

  let { userAuth: { access_token, username } } = useContext(UserContext);

  const [isReplying, setReplying] = useState(false);

  const getParentIndex = () => {
    let startingPoint = index - 1;

    try {
      while (commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel) {
        startingPoint--;
      }
    } catch {
      startingPoint = undefined;
    }

    return startingPoint;
  }

  const removeCommentsCards = (startingPoint, isDelete = false) => {
    if (commentsArr[startingPoint]) {
      while (commentsArr[startingPoint].childrenLevel > commentData.childrenLevel) {
        commentsArr.splice(startingPoint, 1);
        if (!commentsArr[startingPoint]) {
          break;
        }
      }
    }

    if (isDelete) {
      let parentIndex = getParentIndex();

      if (parentIndex != undefined) {
        commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child != _id)

        if (!commentsArr[parentIndex].children.length) {
          commentsArr[parentIndex].isReplyLoaded = false;
        }
      }

      commentsArr.splice(index, 1);
    }

    if (commentData.childrenLevel == 0 && isDelete) {
      setTotalParentCommentsLoaded(preVal => preVal - 1);
    }

    setPost({ ...post, comments: { results: commentsArr }, activity: { ...activity, total_parent_comments: total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0) } })
  }

  const deleteComment = (e) => {
    e.target.setAttribute("disabled", true)

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment", { _id }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
      .then(() => {
        e.target.removeAttribute("disabled");
        removeCommentsCards(index + 1, true);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const hideReplies = () => {
    commentData.isReplyLoaded = false;

    removeCommentsCards(index + 1);
  }

  const loadReplies = ({ skip = 0 }) => {
    if (children.length) {
      hideReplies();

      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies", { _id, skip })
        .then(({ data: { replies } }) => {

          commentData.isReplyLoaded = true;

          for (let i = 0; i < replies.length; i++) {

            replies[i].childrenLevel = commentData.childrenLevel + 1;

            commentsArr.splice(index + 1 + i + skip, 0, replies[i])

          }
          setPost({ ...post, comments: { ...comments, results: commentsArr } })

        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  const handleReplyClick = () => {
    if (!access_token) {
      return toast.error("Login to reply.")
    }

    setReplying(preVal => !preVal);
  }

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-5 border border-grey">
        <div className="flex gap-3 items-center mb-8">
          <img src={profile_img} className="w-6 h-6 rounded-full" alt="profile image" />
          <p className="line-clamp-1">{fullname}</p>
          <p className="-mx-2">•</p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>

        <p className="text-xl ml-3">{comment}</p>

        <div className="flex gap-5 items-center justify-end mt-5">

          {
            commentData.isReplyLoaded ?
              <button onClick={hideReplies} className="text-dark-grey p-2 px-3 hover:bg-grey/30 flex items-center gap-2">
                <span className="fi fi-br-comment-dots"></span> Hide Replies
              </button>
              :
              children.length ?
                <button onClick={loadReplies} className="text-dark-grey p-2 px-3 hover:bg-grey/30 flex items-center gap-2">
                  <span className="fi fi-br-comment-dots"></span> Show Replies ({children.length})
                </button>
                :
                ""
          }

          <button onClick={handleReplyClick} className="h-7 w-7 text-dark-grey hover:text-royalblue active:text-royalblue hover:bg-royalblue/30 active:bg-royalblue/30 rounded-sm">
            <span className={"fi fi-br-" + (isReplying ? "cross-small" : "arrow-turn-down-left")}></span>
          </button>

          {
            username === commented_by_username || username === post_author ?
              <button onClick={deleteComment} className="h-7 w-7 text-dark-grey hover:text-red active:text-red hover:bg-red/30 active:bg-red/30 rounded-sm">
                <span className="fi fi-br-trash"></span>
              </button>
              : ""
          }
        </div>

        {
          isReplying ?
            <div className="mt-3">
              <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying} />
            </div> : ""
        }
      </div>
    </div>
  )
}

export default CommentCard;