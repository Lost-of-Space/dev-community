import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component"
import axios from "axios";
import PostCard from "../components/post-card.component";
import MinimalPostCard from "../components/minimal-post-card.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

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

  let [cardStyle, setCardStyle] = useState(() => {
    return parseInt(localStorage.getItem("cardStyle")) || 1;
  });

  const changeCardStyle = () => {
    let newStyle = cardStyle + 1;
    if (newStyle > 4) {
      newStyle = 1;
    }
    setCardStyle(newStyle);
    //saves to local storage
    localStorage.setItem("cardStyle", newStyle);
  };

  const fetchLatestPosts = ({ page = 1 }) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-posts", { page })
      .then(async ({ data }) => {

        let formatedData = await filterPaginationData({
          state: latestPosts,
          data: data.posts,
          page,
          countRoute: "/all-latest-posts-count"
        })

        setLatestPosts(formatedData);
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

  const fetchPostsByCategory = ({ page = 1 }) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-posts", { tag: pageState, page })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: latestPosts,
          data: data.posts,
          page,
          countRoute: "/search-posts-count",
          data_to_send: { tag: pageState }
        })

        setLatestPosts(formatedData);
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
      fetchLatestPosts({ page: 1 });
    } else {
      fetchPostsByCategory({ page: 1 });
    }

    if (!trendingPosts) {
      fetchTrendingPosts();
    }

  }, [pageState])

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest posts */}
        <div className="w-full">

          <InPageNavigation routes={[pageState, "trending posts"]} defaultHidden={["trending posts"]}
            panelElements={
              <div className="flex justify-center items-center ml-auto">
                <button className="btn-mini w-10 h-10" onClick={changeCardStyle}>
                  <span className="fi fi-br-objects-column -mb-[4px]"></span>
                </button>
              </div>
            }>
            <>
              {
                latestPosts == null ?
                  (
                    <Loader />
                  ) : (
                    latestPosts.results.length ?
                      <div className={cardStyle === 4 ? "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-3" : ""}>
                        {
                          latestPosts.results.map((post, i) => {
                            return (<AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                              <PostCard content={post} author={post.author.personal_info} style={cardStyle} />
                            </AnimationWrapper>);
                          })
                        }
                      </div>
                      :
                      <NoDataMessage message="No such posts found!" />
                  )
              }
              <LoadMoreDataBtn state={latestPosts} fetchDataFunc={(pageState == "home" ? fetchLatestPosts : fetchPostsByCategory)} />
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
        <div className="min-w-[30%] lg-min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
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