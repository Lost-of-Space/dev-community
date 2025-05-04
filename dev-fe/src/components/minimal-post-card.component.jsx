import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const MinimalPostCard = ({ post, index }) => {

  let { title, post_id: id, author: { personal_info: { fullname, profile_img } }, publishedAt } = post;

  return (
    <Link to={`/post/${id}`} className="flex gap-5 mb-4">
      <h1 className="post-index">{(index + 1).toString().padStart(2, "0")}</h1>

      <div>
        <div className="flex gap-2 items-center mb-4">
          <img src={profile_img} alt="author avatar" className="w-6 h-6 rounded-full" />
          <p className="lime-clamp-1">{fullname}</p>
          <p>•</p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>

        <h1 className="post-title text-2xl font-bold mb-5 line-clamp-1">{title}</h1>
      </div>
    </Link>
  )
}

export default MinimalPostCard;