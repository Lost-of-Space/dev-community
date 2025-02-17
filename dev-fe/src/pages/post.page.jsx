import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import PostInteraction from "../components/post-interaction.component";
import PostCard from "../components/post-card.component";
import PostContent from "../components/post-content.component";
import CommentsContainer from "../components/comments.component";

export const postStructure = {
  title: '',
  des: '',
  content: [],
  author: { personal_info: {} },
  banner: '',
  publishedAt: ''
}

export const PostContext = createContext({})

const PostPage = () => {

  let { post_id } = useParams()

  const [post, setPost] = useState(postStructure);
  const [loading, setLoading] = useState(true);
  const [similarPosts, setSimilarPosts] = useState(null);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

  let { title, content, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = post;

  const fetchPost = () => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-post", { post_id })
      .then(({ data: { post } }) => {

        setPost(post);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-posts", { tag: post.tags[0], limit: 3, eliminate_post: post_id })
          .then(({ data }) => {
            setSimilarPosts(data.posts);
          })
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      })
  }

  useEffect(() => {
    resetStates();
    fetchPost();

  }, [post_id])

  const resetStates = () => {
    setPost(postStructure);
    setSimilarPosts(null);
    setLoading(true);
    setIsLikedByUser(false);
    setCommentsWrapper(false);
    setTotalParentCommentsLoaded(0);
  }

  return (
    <AnimationWrapper>
      {
        loading ? <Loader />
          :
          <PostContext.Provider value={{ post, setPost, isLikedByUser, setIsLikedByUser, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded }}>
            <CommentsContainer />

            <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
              <img src={banner} className="aspect-video" alt="post banner" />

              <div className="mt-12">
                <h2>{title}</h2>

                <div className="flex max-sm:flex-col justify-between my-8">
                  <div className="flex gap-5 items-start">
                    <img src={profile_img} className="w-12 h-12 rounded-full" alt="author avatar" />
                    <p className="capitalize text-xl">
                      {fullname}
                      <br />
                      <span className="text-dark-grey">
                        @
                        <Link className="text-base text-dark-grey hover:underline" to={`/user/${author_username}`}>{author_username}</Link>
                      </span>
                    </p>
                  </div>
                  <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">Published on {getDay(publishedAt)}</p>
                </div>
              </div>
              <PostInteraction />

              <div className="my-12 ">
                {
                  content[0].blocks.map((block, i) => {
                    return <div>
                      <PostContent block={block} />
                    </div>
                  })
                }
              </div>

              <hr className="text-dark-grey/20" />

              {
                similarPosts != null && similarPosts.length ?
                  <>
                    <h1 className="text-2xl mt-14 mb-10 font-medium">Check similar posts:</h1>
                    {
                      similarPosts.map((post, i) => {
                        let { author: { personal_info } } = post;

                        return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                          <PostCard content={post} author={personal_info} />
                        </AnimationWrapper>
                      })
                    }
                  </>
                  :
                  ""
              }
            </div>
          </PostContext.Provider>
      }
    </AnimationWrapper>
  )
}

export default PostPage;