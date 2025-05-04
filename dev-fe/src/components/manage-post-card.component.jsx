import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";


const PostStats = ({ stats }) => {
  return (
    <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">
      {
        Object.keys(stats).map((key, i) => {
          return !key.includes("parent") ? <div key={i} className={"flex flex-col items-center w-full h-full justify-center p-4 px-6 " + (i != 0 ? "border-grey border-l" : "")}>
            <h1 className="text-xl lg:text-2xl mb-2">{stats[key].toLocaleString()}</h1>
            <p className="max-lg:text-dark-grey capitalize">{key.split("_")[1]}</p>
          </div>
            : ""
        })
      }
    </div>
  )
}

export const ManagePublishedPostCard = ({ post }) => {

  let { banner, post_id, title, publishedAt, activity } = post;

  let { userAuth: { access_token } } = useContext(UserContext);

  let [showStats, setShowStats] = useState(false);

  return (
    <>
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
        <img src={banner} className="max:md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover" alt="post banner" />

        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <Link to={`/post/${post_id}`} className="post-title mb-4 hover:underline">{title}</Link>

            <p className="line-clamp-1">Published on {getDay(publishedAt)}</p>
          </div>

          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${post_id}`} className="pt-4 py-2 underline">Edit</Link>

            <button onClick={() => setShowStats(preVal => !preVal)} className="lg:hidden pt-4 py-2 underline">Stats</button>

            <button onClick={(e) => deletePost(post, access_token, e.target)} className="pt-4 py-2 underline text-red">Delete</button>
          </div>

        </div>

        <div className="max-lg:hidden">
          <PostStats stats={activity} />
        </div>

      </div>

      {
        showStats ? <div className="lg:hidden">
          <PostStats stats={activity} />
        </div>
          :
          ""
      }
    </>
  )
}

export const ManageDraftPostCard = ({ post }) => {

  let { title, des, post_id, index } = post;

  let { userAuth: { access_token } } = useContext(UserContext);

  index++;

  return (
    <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">
      <h1 className="post-index text-center pl-4 md:pl-6 flex-none text-6xl">{(index + 1).toString().padStart(2, "0")}</h1>

      <div>
        <h1 className="post-title mb-3">{title}</h1>
        <p className="line-clamp-2">{des.length ? des : "No description"}</p>

        <div className="flex gap-6 mt-3">
          <Link to={`/editor/${post_id}`} className="pt-4 py-2 underline">Edit</Link>

          <button onClick={(e) => deletePost(post, access_token, e.target)} className="pt-4 py-2 underline text-red">Delete</button>
        </div>
      </div>
    </div>
  )
}

const deletePost = (post, access_token, target) => {

  let { index, post_id, setStateFunc } = post;

  target.setAttribute("disabled", true);

  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-post", { post_id }, {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  })
    .then(({ data }) => {
      target.removeAttribute("disabled");

      setStateFunc(preVal => {
        let { deletedDocCount, totalDocs, results } = preVal;

        results.splice(index, 1);

        if (!deletedDocCount) {
          deletedDocCount = 0;
        }

        if (!results.length && totalDocs - 1 > 0) {
          return null;
        }

        return { ...preVal, totalDocs: totalDocs - 1, deletedDocCount: deletedDocCount + 1 }

      })
    })
    .catch(err => {
      console.log(err);
    })
}