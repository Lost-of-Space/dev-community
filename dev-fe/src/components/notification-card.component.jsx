import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import NotificationCommentField from "./notification-comment-field.component";
import { UserContext } from "../App";
import axios from "axios";

const NotificationCard = ({ data, index, notificationState }) => {

  let [isReplying, setIsReplying] = useState();

  let { seen, type, reply, createdAt, comment, replied_on_comment, user, user: { personal_info: { username, profile_img } }, post: { _id, post_id, title }, _id: notification_id } = data;

  let { userAuth: { username: author_username, profile_img: author_profile_img, access_token } } = useContext(UserContext);

  let { notifications, notifications: { results, totalDocs }, setNotifications } = notificationState;

  const handleReply = () => {
    setIsReplying(preVal => !preVal)
  }

  const handleDelete = (comment_id, type, target) => {
    target.setAttribute("disabled", true);

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment", { _id: comment_id }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
      .then(() => {
        if (type == 'comment') {
          results.splice(index, 1);

        } else {
          delete results[index].reply;
        }

        target.removeAttribute("disabled")
        setNotifications({ ...notifications, results, totalDocs: totalDocs - 1, deleteDocCount: notifications.deleteDocCount + 1 })
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className={"p-6 border-b border-grey my-1 border-l-black " + (!seen ? "border-l-2" : "")}>

      <div className="flex gap-5 mb-3">
        <img src={profile_img} alt="profile img" className="w-14 h-14 flex-none rounded-full select-none" />

        <div className="w-full">
          <h1 className="font-medium text-xl text-dark-grey">
            <Link to={`/user/${username}`} className="hover:underline hover:text-royalblue max-sm:underline active:text-royalblue mx-1 text-black">@{username}</Link>
            <span className="font-normal">
              {
                type == 'like' ? " liked your post" :
                  type == 'comment' ? " commented on" :
                    " replied on"
              }
            </span>
          </h1>

          {
            type == "reply" ?
              <div className="p-3.5 pr-8 mt-4 bg-grey relative rounded-br-xl">
                <p>{replied_on_comment.comment}</p>
                <span className="fi fi-br-arrow-turn-down-left absolute right-3 top-[47%] text-dark-grey/80"></span>
              </div>
              : <Link to={`/post/${post_id}`} className="text-xl pt-2 inline-block font-medium text-dark-grey hover:underline line-clamp-1 hover:text-royalblue active:text-royalblue">{`"${title}"`}</Link>
          }
        </div>
      </div>
      {
        type != 'like' ?
          <p className="ml-14 pl-5 text-xl my-5">{comment.comment}</p>
          : ""
      }

      <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
        <p>{getDay(createdAt)}</p>
        {
          type != "like" ?
            <>
              {
                !reply ?
                  <button onClick={handleReply} className="hover:text-black">Reply</button>
                  :
                  ""
              }
              <button onClick={(e) => handleDelete(comment._id, "comment", e.target)} className="hover:text-black select-none disabled:opacity-50 disabled:cursor-not-allowed">Delete</button>
            </>
            : ""
        }
      </div>

      {
        isReplying ?
          <div className="mt-8">
            <NotificationCommentField _id={_id} post_author={user} index={index} replyingTo={comment._id} setReplying={setIsReplying} notification_id={notification_id} notificationData={notificationState} />
          </div>
          :
          ""
      }

      {
        reply ?
          <div className="ml-20 p-5 bg-grey mt-5 rounded-md">
            <div className="flex gap-3 mb-3">
              <img src={author_profile_img} className="w-8 h-8 rounded-full select-none" alt="author profile image" />

              <div>
                <h1 className="font-medium text-xl text-dark-grey">
                  <Link to={`/user/${author_username}`} className="hover:underline hover:text-royalblue max-sm:underline active:text-royalblue mx-1 text-black">@{author_username}</Link>
                  <span className="font-normal"> replied to </span>
                  <Link to={`/user/${username}`} className="hover:underline hover:text-royalblue max-sm:underline active:text-royalblue mx-1 text-black">@{username}</Link>
                </h1>
              </div>
            </div>
            <p className="ml-14 text-xl mt-2 mb-1">{reply.comment}</p>

            <button onClick={(e) => handleDelete(reply._id, "reply", e.target)} className="hover:text-black ml-14 mt-2 select-none disabled:opacity-50 disabled:cursor-not-allowed">Delete</button>
          </div>
          :
          ""
      }
    </div>
  )
}

export default NotificationCard;