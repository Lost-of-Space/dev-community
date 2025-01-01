import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component"
import axios from "axios";
import PostCard from "../components/post-card.component";
import MinimalPostCard from "../components/minimal-post-card.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";

const HomePage = () => {

  let [latestPosts, setLatestPosts] = useState(null);
  let [trendingPosts, setTrendingPosts] = useState(null);
  let [pageState, setPageState] = useState("home");


  let categories = [
    "frontend",
    "backend",
    "technology stacks",
    "languages",
    "sky",
    "win11"
  ]

  const fetchLatestPosts = () => {
    axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-posts")
      .then(({ data }) => {
        setLatestPosts(data.posts)
      })
      .catch(err => {
        console.log(err);
      })
  }

  const fetchTrendingPosts = () => {
    axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-posts")
      .then(({ data }) => {
        setTrendingPosts(data.posts)
      })
      .catch(err => {
        console.log(err);
      })
  }

  const fetchPostsByCategory = () => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-posts", { tag: pageState })
      .then(({ data }) => {
        setLatestPosts(data.posts)
      })
      .catch(err => {
        console.log(err);
      })
  }

  const loadPostByCategory = (e) => {

    let category = e.target.innerText.toLowerCase();

    setLatestPosts(null);

    if (pageState == category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  }


  useEffect(() => {
    activeTabRef.current.click();

    if (pageState == "home") {
      fetchLatestPosts();
    }
    if (!trendingPosts) {
      fetchTrendingPosts();
    } else {
      fetchPostsByCategory();
    }

  }, [pageState])

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest posts */}
        <div className="w-full">

          <InPageNavigation routes={[pageState, "trending posts"]} defaultHidden={["trending posts"]}>
            <>
              {
                latestPosts == null ?
                  (
                    <Loader />
                  ) : (
                    latestPosts.length ?
                      latestPosts.map((post, i) => {
                        return (<AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                          <PostCard content={post} author={post.author.personal_info} />
                        </AnimationWrapper>);
                      })
                      :
                      <NoDataMessage message="No such posts found!" />
                  )
              }
            </>

            {
              trendingPosts == null ?
                (
                  <Loader />
                ) : (trendingPosts.length ?
                  trendingPosts.map((post, i) => {
                    return (<AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                      <MinimalPostCard post={post} index={i} />
                    </AnimationWrapper>);
                  })
                  :
                  <NoDataMessage message="Oops! It seems like there is not even one post in our database" />
                )
            }
          </InPageNavigation>

        </div>

        {/* filters and trends */}
        <div className="min-w-[40%] lg-min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">Suggested tags</h1>
              <div className="flex gap-3 flex-wrap">
                {
                  categories.map((category, i) => {
                    return <button onClick={loadPostByCategory} className={"tag " + (pageState == category ? "bg-black text-white" : "")} key={i}>{category}</button>
                  })
                }
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <span className="fi fi-br-arrow-trend-up"></span>
              </h1>

              {
                trendingPosts == null ?
                  (
                    <Loader />
                  ) : (trendingPosts.length ?
                    trendingPosts.map((post, i) => {
                      return (<AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                        <MinimalPostCard post={post} index={i} />
                      </AnimationWrapper>);
                    })
                    :
                    <NoDataMessage message="Oops! It seems like there is not even one post in our database" />
                  )
              }
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default HomePage;