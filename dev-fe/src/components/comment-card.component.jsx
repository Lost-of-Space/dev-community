import { getDay } from "../common/date";

const CommentCard = ({ index, leftVal, commentData }) => {

  let { commented_by: { personal_info: { profile_img, fullname } }, commentedAt, comment } = commentData

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}` }}>
      <div className="my-5 p-6 border border-grey">
        <div className="flex gap-3 items-center mb-8">
          <img src={profile_img} className="w-6 h-6 rounded-full" alt="profile image" />
          <p className="line-clamp-1">{fullname}</p>
          <p className="-mx-2">•</p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>

        <p className="text-xl ml-3">{comment}</p>

        <div>

        </div>
      </div>
    </div>
  )
}

export default CommentCard;