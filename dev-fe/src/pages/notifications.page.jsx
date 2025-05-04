import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { filterPaginationData } from "../common/filter-pagination-data";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import NoDataMessage from "../components/nodata.component";
import NotificationCard from "../components/notification-card.component";
import LoadMoreDataBtn from "../components/load-more.component";

const NotificationsPage = () => {

  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(null);

  let { userAuth, userAuth: { access_token, new_notification_available }, setUserAuth } = useContext(UserContext);

  const filters = [
    { value: "all", label: "All" },
    { value: "like", label: "Likes" },
    { value: "comment", label: "Comments" },
    { value: "reply", label: "Replies" },
  ];


  const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/notifications", { page, filter, deletedDocCount }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
      .then(async ({ data: { notifications: data } }) => {

        if (new_notification_available) {
          setUserAuth({ ...userAuth, new_notification_available: false })
        }

        let formatedData = await filterPaginationData({
          state: notifications,
          data, page,
          countRoute: "/all-notifications-count",
          data_to_send: { filter },
          user: access_token
        })

        setNotifications(formatedData)
      })
      .catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    if (access_token) {
      fetchNotifications({ page: 1 })
    }
  }, [access_token, filter])

  const handleFilter = (selectedFilter) => {
    if (filter !== selectedFilter) {
      setFilter(selectedFilter);
      setNotifications(null);
    }
  }

  return (
    <div>
      <h1 className="max-md:hidden text-xl">Recent Notifications</h1>

      <div className="my-8 flex gap-6">
        {
          filters.map(({ value, label }, i) => (
            <button
              key={i}
              onClick={() => handleFilter(value)}
              className={`tag-btn max-md:text-base max-md:py-2 max-md:px-4 ${filter === value ? "tag-btn-active" : ""}`}
            >
              {label}
            </button>
          ))
        }

      </div>

      {
        notifications == null ? <Loader />
          :
          <>
            {
              notifications.results.length ?
                notifications.results.map((notification, i) => {
                  return <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                    <NotificationCard data={notification} index={i} notificationState={{ notifications, setNotifications }} />
                  </AnimationWrapper>
                })
                :
                <NoDataMessage message="There is no notifications now." />
            }

            <LoadMoreDataBtn className="my-4" state={notifications} fetchDataFunc={fetchNotifications} additionalParam={{ deletedDocCount: notifications.deletedDocCount }} />
          </>
      }
    </div>
  )
}

export default NotificationsPage;