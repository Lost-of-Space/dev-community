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
  let [popularPosts, setPopularPosts] = useState(null);

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

  const fetchPopularPosts = () => {
    axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/popular-posts")
      .then(({ data }) => {
        setPopularPosts(data.posts)
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

    if (!popularPosts) {
      fetchPopularPosts();
    }

  }, [pageState])

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest posts */}
        <div className="w-full">

          <InPageNavigation routes={[pageState, "popular posts"]} defaultHidden={["popular posts"]}
            panelElements={
              <div className="flex justify-center items-center ml-auto">
                <button className="btn-mini w-10 h-10" onClick={changeCardStyle}>
                  <span className="fi fi-br-objects-column -mb-[4px]"></span>
                </button>
              </div>
            }>
            <>

              <div className="mb-8">
                <h1 className="font-medium max-md:text-xl text-2xl mb-2">Suggested tags:</h1>
                <div className="flex gap-3 flex-wrap">
                  {
                    categories.map((category, i) => {
                      return <button onClick={loadPostByCategory} className={"tag-btn max-md:text-base max-md:py-2 max-md:px-4 " + (pageState == category ? "tag-btn-active" : "")} key={i}>{category}</button>
                    })
                  }
                </div>
              </div>
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
              popularPosts == null ?
                (
                  <Loader />
                ) : (popularPosts.length ?
                  popularPosts.map((post, i) => {
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
        <div className="min-w-[30%] lg:min-w-[250px] max-w-min lg:max-w-[30%] border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            {/* <div>
              <h1 className="font-medium text-2xl mb-8">Suggested tags</h1>
              <div className="flex gap-3 flex-wrap">
                {
                  categories.map((category, i) => {
                    return <button onClick={loadPostByCategory} className={"tag-btn " + (pageState == category ? "tag-btn-active" : "")} key={i}>{category}</button>
                  })
                }
              </div>
            </div> */}

            <div>
              <h1 className="font-medium text-2xl mb-8">
                Top 10 Posts <span className="fi fi-br-arrow-trend-up"></span>
              </h1>

              {
                popularPosts == null ?
                  (
                    <Loader />
                  ) : (popularPosts.length ?
                    popularPosts.map((post, i) => {
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