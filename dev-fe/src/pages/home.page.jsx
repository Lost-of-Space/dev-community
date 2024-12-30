import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component"
import axios from "axios";
import PostCard from "../components/post-card.component";

const HomePage = () => {

  let [posts, setPost] = useState(null);

  const fetchLatestPosts = () => {
    axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-posts")
      .then(({ data }) => {
        setPost(data.posts)
      })
      .catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    fetchLatestPosts();
  }, [])

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest posts */}
        <div className="w-full">

          <InPageNavigation routes={["home", "trending posts"]} defaultHidden={["trending posts"]}>
            <>
              {
                posts == null ? <Loader />
                  :
                  posts.map((post, i) => {
                    return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                      <PostCard content={post} author={post.author.personal_info} />
                    </AnimationWrapper>;
                  })
              }
            </>

            <h1>Trending posts</h1>
          </InPageNavigation>

        </div>

        {/* filters and trends */}
        <div>

        </div>
      </section>
    </AnimationWrapper>
  )
}

export default HomePage;