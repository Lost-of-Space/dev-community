import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const PostCard = ({ content, author, style }) => {
  let { publishedAt, tags, title, des, banner, activity: { total_likes }, post_id: id } = content;
  let { fullname, profile_img } = author;

  if (style === 2) {
    return (
      <Link
        to={`/post/${id}`}
        className="flex flex-col gap-8 items-start border-b border-grey pb-5 mb-4 relative"
      >
        <div
          className="w-full bg-cover bg-center p-6 text-black rounded-[20px] overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 255.7), rgba(255, 255, 255, 0.3)), url(${banner})`,
          }}
        >
          <div className="flex gap-2 items-center mb-4">
            <img src={profile_img} alt="author avatar" className="w-6 h-6 rounded-full" />
            <p className="lime-clamp-1">{fullname}</p>
            <p>•</p>
            <p className="min-w-fit">{getDay(publishedAt)}</p>
          </div>

          <h1 className="post-title text-2xl font-bold mb-3">{title}</h1>

          <p className="text-lg line-clamp-2">{des}</p>

          <div className="flex gap-4 mt-4">
            <span className="btn-light py-1 px-4">{tags[0]}</span>
            <span className="ml-3 flex items-center gap-2 text-light-grey">
              <span className="fi fi-br-heart -mb-1"></span>
              {total_likes}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (style === 3) {
    return (
      <Link
        to={`/post/${id}`}
        className="flex flex-col gap-8 items-start border-b border-grey pb-5 mb-4 relative"
      >
        <div
          className="w-full bg-cover bg-center p-6 text-white rounded-[20px] overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url(${banner})`,
          }}
        >
          <div className="flex gap-2 items-center mb-4">
            <img src={profile_img} alt="author avatar" className="w-6 h-6 rounded-full" />
            <p className="lime-clamp-1">{fullname}</p>
            <p>•</p>
            <p className="min-w-fit">{getDay(publishedAt)}</p>
          </div>

          <h1 className="post-title text-2xl font-bold mb-3">{title}</h1>

          <p className="text-lg line-clamp-2">{des}</p>

          <div className="flex gap-4 mt-4">
            <span className="btn-light py-1 px-4">{tags[0]}</span>
            <span className="ml-3 flex items-center gap-2 text-light-grey">
              <span className="fi fi-br-heart -mb-1"></span>
              {total_likes}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  if (style === 4) {
    return (
      <Link
        to={`/post/${id}`}
        className="relative flex h-full flex-col border border-grey rounded-[14px] overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="relative w-full h-36">
          <img
            src={banner}
            alt="post banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-5 bg-white flex flex-col h-full justify-between">

          <div className="flex items-center gap-3 -mt-[52px] z-10">
            <img
              src={profile_img}
              alt="author avatar"
              className="w-20 h-20 rounded-[16px] bg-white p-1 -ml-1"
            />

            <div className="flex flex-row mt-10">
              <h1 className="text-[24px] font-bold text-black line-clamp-1">{title}</h1>
            </div>
          </div>

          <p className="text-xl text-dark-grey line-clamp-2">{des}</p>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1 text-dark-grey">
              <span className="fi fi-br-heart -mb-1"></span>
              <span className="text-xs mx-1">{total_likes}</span>
              <span className="btn-light text-black py-1 ml-2 px-3 rounded-full text-xs">{tags[0]}</span>

            </div>
            <div className="flex">
              <p className="text-xs font-medium text-dark-grey">{fullname}</p>
              <p className="mx-3 text-xs text-dark-grey">•</p>
              <p className="text-xs text-dark-grey">{getDay(publishedAt)}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  else {
    return (
      <Link
        to={`/post/${id}`}
        className="relative flex flex-col gap-8 border-b border-grey pb-5 mb-4"
      >
        <div className="relative z-10 p-6 rounded-[20px] overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <div className="flex gap-2 items-center mb-4">
            <img src={profile_img} alt="author avatar" className="w-6 h-6 rounded-full" />
            <p className="lime-clamp-1">{fullname}</p>
            <p>•</p>
            <p className="min-w-fit">{getDay(publishedAt)}</p>
          </div>

          <h1 className="post-title text-2xl font-bold mb-3">{title}</h1>

          <p className="text-lg line-clamp-2">{des}</p>

          <div className="flex gap-4 mt-4">
            <span className="btn-light py-1 px-4">{tags[0]}</span>
            <span className="ml-3 flex items-center gap-2 text-dark-grey">
              <span className="fi fi-br-heart -mb-1"></span>
              {total_likes}
            </span>
          </div>

          <div className="absolute inset-0 -z-10 h-full w-full">
            <img
              src={banner}
              alt="post banner"
              className="w-[65%] h-full object-cover ml-auto"
            />
            <div className="absolute w-[65%] inset-0 ml-auto bg-gradient-to-l from-transparent to-white"></div>
          </div>
        </div>
      </Link>
    )
  }
};

export default PostCard;
