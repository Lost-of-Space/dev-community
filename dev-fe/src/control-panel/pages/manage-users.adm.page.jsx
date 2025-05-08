import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../../App";
import Loader from "../../components/loader.component";
import NoDataMessage from "../../components/nodata.component";
import LoadMoreDataBtn from "../../components/load-more.component";
import { filterPaginationData } from "../../common/filter-pagination-data";
import ManageUserCard from "../components/manage-user-card.component";
import SortButton from "../components/sort-button.component";

const ManageUsersPage = () => {

  let { userAuth: { access_token, isAdmin } } = useContext(UserContext);

  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState({
    search: "",
    userFilter: {
      user: false,
      admin: false,
      blocked: false
    }
  });

  const [sortField, setSortField] = useState("personal_info.username");
  const [sortOrder, setSortOrder] = useState("desc");

  const getUsers = ({ page, deletedDocCount = 0 }) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-users", {
      page,
      filter: query.search ? "search" : "all",
      query: query.search,
      userFilter: query.userFilter,
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
          state: users,
          data: data.users,
          page,
          user: access_token,
          countRoute: "/get-users-count",
          data_to_send: {
            filter: query.search ? "search" : "all",
            query: query.search,
            userFilter: query.userFilter
          }
        });

        setUsers(formatedData);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (access_token && users == null) {
      getUsers({ page: 1 });
    }
  }, [access_token, users, query]);

  const handleSearch = (e) => {
    const searchQuery = e.target.value;

    if (e.keyCode === 13) {
      setQuery(prev => ({ ...prev, search: searchQuery }));
      setUsers(null);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    if (!value.length) {
      setQuery(prev => ({ ...prev, search: "" }));
      setUsers(null);
    }
  };

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
    setUsers(null);
  };

  const toggleFilter = (key) => {
    setQuery(prev => {
      let newFilter = { ...prev.userFilter };

      if (key === "admin") newFilter.user = false;
      if (key === "user") newFilter.admin = false;

      newFilter[key] = !prev.userFilter[key];

      return {
        ...prev,
        userFilter: newFilter
      };
    });
    setUsers(null);
  };

  return (
    <>
      <h1 className="max-md:hidden text-xl">Manage Users</h1>
      <Toaster />

      <div className="relative max-md:mt-5 md:mt-8 mb-2">
        <input type="search" onChange={handleSearchChange} onKeyDown={handleSearch} className="input-box search-remove-x" placeholder="Search Users" />
        <span className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey icon"></span>
      </div>
      <div className="flex gap-2 mb-2 flex-wrap">
        <p className="text-dark-grey mt-1">Show Only:</p>
        <div className="flex gap-2">
          <button
            onClick={() => toggleFilter("admin")}
            className={`btn-filter px-2 py-1 ${query.userFilter.admin ? 'bg-black text-white' : 'bg-grey text-black'}`}
          >Admins</button>
          <button
            onClick={() => toggleFilter("user")}
            className={`btn-filter px-2 py-1 ${query.userFilter.user ? 'bg-black text-white' : 'bg-grey text-black'}`}
          >Users</button>
          <button
            onClick={() => toggleFilter("blocked")}
            className={`btn-filter px-2 py-1 ${query.userFilter.blocked ? 'bg-black text-white' : 'bg-grey text-black'}`}
          >Blocked</button>
        </div>
      </div>

      {
        users == null ? <Loader />
          :
          users.results.length ?
            <>
              {
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-grey text-left">
                      <th className="border-r border-grey">
                        <SortButton sortFunc={handleSort} sortBy={"personal_info.username"} fieldState={sortField} orderState={sortOrder} label="User" />
                      </th>
                      <th className="py-3 px-4 border-r border-grey">Email</th>
                      <th className="border-r border-grey">
                        <SortButton sortFunc={handleSort} sortBy={"joinedAt"} fieldState={sortField} orderState={sortOrder} label="Joined At" />
                      </th>
                      <th className="border-r border-grey">
                        <SortButton sortFunc={handleSort} sortBy={"account_info.total_posts"} fieldState={sortField} orderState={sortOrder} label="Posts" />
                      </th>
                      <th className="py-3 px-4 border-r border-grey">Role</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.results.map(user => <ManageUserCard key={user._id} user={user} setUsers={setUsers} />)}
                  </tbody>
                </table>

              }

              <LoadMoreDataBtn className="my-4" state={users} fetchDataFunc={getUsers} additionalParam={{ draft: false, deletedDocCount: users.deletedDocCount }} />
            </>
            :
            <NoDataMessage message="No users found." />
      }

    </>
  )
}

export default ManageUsersPage;