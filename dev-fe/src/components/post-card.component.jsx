import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const PostCard = ({ content, author }) => {
  let { publishedAt, tags, title, des, banner, activity: { total_likes }, post_id: id } = content;
  let { fullname, profile_img } = author;

  return (
    <>
      <Link
        to={`/post/${id}`}
        className="flex flex-col gap-8 items-start border-b border-grey pb-5 mb-4 relative"
      >
        {/* Контейнер із фоновим зображенням */}
        <div
          className="w-full bg-cover bg-center rounded-[20px] p-6 text-white"
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

      <Link
        to={`/post/${id}`}
        className="relative flex flex-col gap-8 border-b border-grey pb-5 mb-4"
      >
        {/* Головний контейнер */}
        <div className="relative z-10 p-6">
          {/* Інформація про автора */}
          <div className="flex gap-2 items-center mb-4">
            <img src={profile_img} alt="author avatar" className="w-6 h-6 rounded-full" />
            <p className="lime-clamp-1">{fullname}</p>
            <p>•</p>
            <p className="min-w-fit">{getDay(publishedAt)}</p>
          </div>

          {/* Заголовок */}
          <h1 className="post-title text-2xl font-bold mb-3">{title}</h1>

          {/* Опис */}
          <p className="text-lg line-clamp-2">{des}</p>

          {/* Теги та лайки */}
          <div className="flex gap-4 mt-4">
            <span className="btn-light py-1 px-4">{tags[0]}</span>
            <span className="ml-3 flex items-center gap-2 text-dark-grey">
              <span className="fi fi-br-heart -mb-1"></span>
              {total_likes}
            </span>
          </div>
        </div>

        {/* Зображення з градієнтом */}
        <div className="absolute inset-0 -z-10 h-full w-full">
          <img
            src={banner}
            alt="post banner"
            className="w-full h-full object-cover rounded-r-[20px]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white"></div>
        </div>
      </Link>

      <Link
        to={`/post/${id}`}
        className="relative flex items-start border-b border-grey pb-5 mb-4" // Контейнер із позицією relative
      >
        {/* Зображення як окремий блок */}
        <div className="absolute top-0 right-0 w-1/2 h-full rounded-r-[20px] overflow-hidden pointer-events-none">
          <img
            src={banner}
            alt="post banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white"></div>
        </div>

        {/* Текстовий блок */}
        <div className="relative z-10 bg-white p-5 w-1/2"> {/* Текст завжди поверх */}
          {/* Інформація про автора */}
          <div className="flex gap-2 items-center mb-4">
            <img src={profile_img} alt="author avatar" className="w-6 h-6 rounded-full" />
            <p className="lime-clamp-1">{fullname}</p>
            <p>•</p>
            <p className="min-w-fit">{getDay(publishedAt)}</p>
          </div>

          {/* Заголовок */}
          <h1 className="post-title text-2xl font-bold mb-3">{title}</h1>

          {/* Опис */}
          <p className="text-lg leading-7 line-clamp-2">{des}</p>

          {/* Теги та лайки */}
          <div className="flex gap-4 mt-4">
            <span className="btn-light py-1 px-4">{tags[0]}</span>
            <span className="ml-3 flex items-center gap-2 text-dark-grey">
              <span className="fi fi-br-heart -mb-1"></span>
              {total_likes}
            </span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default PostCard;
