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
import UserCard from "../components/usercard.component";

const SearchPage = () => {

    let { query } = useParams()

    let [latestPosts, setLatestPosts] = useState(null);

    let [users, setUsers] = useState(null);

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

    const fetchUsers = () => {
        const isExact = query.startsWith('@');
        const searchQuery = isExact ? query.slice(1) : query;

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query: searchQuery, isExact })
            .then(({ data: { users } }) => {
                setUsers(users);
            })
            .catch(err => {
                console.log(err);
            });
    };


    useEffect(() => {
        setLatestPosts(null);
        setUsers(null);
        searchPosts({ page: 1, create_new_arr: true });
        fetchUsers();

    }, [query])

    const UserCardWrapper = () => {
        return (
            <>
                {
                    users == null ? <Loader />
                        :
                        users.length ?
                            users.map((user, i) => {
                                return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                                    <UserCard user={user} />
                                </AnimationWrapper>;
                            })
                            :
                            <NoDataMessage message="No such user found." />
                }
            </>
        )
    }

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

                    <>
                        <UserCardWrapper />
                    </>

                </InPageNavigation>
            </div>

            <div className="min-w-[30%] lg-min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                <h1 className="font-medium text-xl mb-8">Users related to search
                    <span className="fi fi-rr-user ml-2 mt-1"></span>
                </h1>

                <UserCardWrapper />
            </div>

        </section>
    )
}

export default SearchPage;