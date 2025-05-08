import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../../App";
import Loader from "../../components/loader.component";
import NoDataMessage from "../../components/nodata.component";
import LoadMoreDataBtn from "../../components/load-more.component";
import { filterPaginationData } from "../../common/filter-pagination-data";
import SortButton from "../components/sort-button.component";
import ManagePostsCard from "../components/manage-posts-card.component";

const PostsManagementPage = () => {
  let { userAuth: { access_token, isAdmin } } = useContext(UserContext);

  const [posts, setPosts] = useState(null);
  const [query, setQuery] = useState({
    search: "",
    postFilter: {
      published: false,
      draft: false
    }
  });

  const [sortField, setSortField] = useState("publishedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const getPosts = ({ page, deletedDocCount = 0 }) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-posts-adm", {
      page,
      filter: query.search ? "search" : "all",
      query: query.search,
      postFilter: query.postFilter,
      isAdmin,
      deletedDocCount,
      sortField,
      sortOrder
    }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
      .then(async ({ data }) => {
        const formatedData = await filterPaginationData({
          state: posts,
          data: data.posts,
          page,
          user: access_token,
          countRoute: "/get-posts-count-adm",
          data_to_send: {
            filter: query.search ? "search" : "all",
            query: query.search,
            postFilter: query.postFilter
          }
        });

        setPosts(formatedData);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (access_token && posts == null) {
      getPosts({ page: 1 });
    }
  }, [access_token, posts, query, sortField, sortOrder]);

  const handleSearch = (e) => {
    const searchQuery = e.target.value;

    if (e.keyCode === 13) {
      setQuery(prev => ({ ...prev, search: searchQuery }));
      setPosts(null);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    if (!value.length) {
      setQuery(prev => ({ ...prev, search: "" }));
      setPosts(null);
    }
  };

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
    setPosts(null);
  };

  const toggleFilter = (key) => {
    setQuery(prev => {
      let newFilter = { ...prev.postFilter };

      if (key === "published") newFilter.draft = false;
      if (key === "draft") newFilter.published = false;

      newFilter[key] = !prev.postFilter[key];

      return {
        ...prev,
        postFilter: newFilter
      };
    });
    setPosts(null);
  };

  return (
    <>
      <h1 className="max-md:hidden text-xl">Manage Posts</h1>
      <Toaster />

      <div className="relative max-md:mt-5 md:mt-8 mb-2">
        <input type="search" onChange={handleSearchChange} onKeyDown={handleSearch} className="input-box search-remove-x" placeholder="Search Posts" />
        <span className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey icon"></span>
      </div>
      <div className="flex gap-2 mb-2 flex-wrap">
        <p className="text-dark-grey mt-1">Show Only:</p>
        <div className="flex gap-2">
          <button
            onClick={() => toggleFilter("published")}
            className={`btn-filter px-2 py-1 ${query.postFilter.published ? 'bg-black text-white' : 'bg-grey text-black'}`}
          >Published</button>
          <button
            onClick={() => toggleFilter("draft")}
            className={`btn-filter px-2 py-1 ${query.postFilter.draft ? 'bg-black text-white' : 'bg-grey text-black'}`}
          >Draft</button>
        </div>
      </div>

      {
        posts == null ? <Loader />
          :
          posts.results.length ?
            <>
              {
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-grey text-left">
                      <th className="border-r border-grey">
                        <SortButton sortFunc={handleSort} sortBy={"title"} fieldState={sortField} orderState={sortOrder} label="Title" />
                      </th>
                      <th className="py-3 px-4 border-r border-grey">Author</th>
                      <th className="border-r border-grey">
                        <SortButton sortFunc={handleSort} sortBy={"publishedAt"} fieldState={sortField} orderState={sortOrder} label="Published At" />
                      </th>
                      <th className="border-r border-grey">
                        <SortButton sortFunc={handleSort} sortBy={"activity.total_likes"} fieldState={sortField} orderState={sortOrder} label="Likes" />
                      </th>
                      <th className="py-3 px-4 border-r border-grey">Status</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {posts.results.map(post => (
                      <ManagePostsCard key={post.post_id} post={post} setPosts={setPosts} />
                    ))}
                  </tbody>
                </table>
              }

              <LoadMoreDataBtn className="my-4" state={posts} fetchDataFunc={getPosts} additionalParam={{ deletedDocCount: posts.deletedDocCount }} />
            </>
            :
            <NoDataMessage message="No posts found." />
      }
    </>
  )
}

export default PostsManagementPage;