import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component"
import axios from "axios";
import PostCard from "../components/post-card.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const SearchPage = () => {

    let { query } = useParams()

    let [latestPosts, setLatestPosts] = useState(null);

    let [cardStyle, setCardStyle] = useState(1);

    const changeCardStyle = () => {
        setCardStyle(cardStyle + 1);
        if (cardStyle >= 4) {
            setCardStyle(1);
        }
    }

    const searchPosts = ({ page = 1, create_new_arr = false }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-posts", { query, page })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: latestPosts,
                    data: data.posts,
                    page,
                    countRoute: "/search-posts-count",
                    data_to_send: { query },
                    create_new_arr
                })

                setLatestPosts(formatedData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        setLatestPosts(null);
        searchPosts({ page: 1, create_new_arr: true });

    }, [query])

    return (
        <section className="h-cover flex justify-center gap-10">

            <div className="w-full">
                <InPageNavigation routes={[`search results for "${query}"`, "users matched"]} defaultHidden={["users matched"]}
                    panelElements={
                        <div className="flex justify-center items-center ml-auto">
                            <button className="btn-mini w-10 h-10" onClick={changeCardStyle}>
                                <span className="fi fi-br-objects-column -mb-[4px]"></span>
                            </button>
                        </div>
                    }>
                    <>
                        {latestPosts == null ?
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
                            )}
                        <LoadMoreDataBtn state={latestPosts} fetchDataFunc={searchPosts} />
                    </>

                </InPageNavigation>
            </div>

        </section>
    )
}

export default SearchPage;