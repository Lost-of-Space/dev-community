import { useContext } from "react";
import { UserContext } from "../../App";
import toast from "react-hot-toast";
import axios from "axios";
import { NavLink } from "react-router-dom";
import DialogWrapper from "../../components/dialog-window.component";

const ManageUserCard = ({ user, setUsers }) => {
  const { userAuth, userAuth: { access_token, isAdmin } } = useContext(UserContext);

  const {
    _id,
    personal_info: { profile_img = "/default-profile.png", fullname, username, email },
    admin,
    joinedAt,
    blocked,
    account_info: { total_posts = 0 }
  } = user;

  const toggleUserFlag = async (targetUserId, fieldToToggle) => {
    let loadingToast = toast.loading(`Toggling ${fieldToToggle}...`);

    try {
      const response = await axios.patch(
        import.meta.env.VITE_SERVER_DOMAIN + "/toggle-user-flag",
        {
          targetUserId,
          isAdmin,
          field: fieldToToggle,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          }
        }
      );

      setUsers(prevUsers => ({
        ...prevUsers,
        results: prevUsers.results.map(user =>
          user._id === targetUserId
            ? { ...user, [fieldToToggle]: response.data[fieldToToggle] }
            : user
        )
      }));

      toast.dismiss(loadingToast);
      toast.success(response.data.message);

    } catch (error) {
      console.error(`Failed to toggle ${fieldToToggle}:`, error);
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.error || `Failed to update ${fieldToToggle}`);
    }
  };


  return (
    <tr className="border-b border-grey hover:bg-grey/20">
      <td className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={profile_img}
            className="w-10 h-10 rounded-full object-cover"
            alt={fullname}
          />
          <div>
            <p className="font-medium">{fullname}</p>
            <NavLink to={`/user/${username}`} className="text-dark-grey text-sm hover:underline active:underline">@{username}</NavLink>
          </div>
        </div>
      </td>

      <td className="p-4">
        <p>{email}</p>
      </td>

      <td className="p-4">
        <p>{new Date(joinedAt).toLocaleDateString()}</p>
      </td>

      <td className="p-4">
        <p>{total_posts}</p>
      </td>

      <td className="p-4">
        {
          admin ?
            <span className="bg-royalblue/30 text-royalblue py-1 px-2 rounded text-xs">Admin</span>
            :
            <span className="bg-yellow/30 text-yellow py-1 px-3 rounded text-xs">User</span>
        }
      </td>

      <td className="p-4">
        <div className="flex gap-2">
          <DialogWrapper
            onConfirm={() => toggleUserFlag(_id, "admin")}
            message={<p>Are you sure you want to <span className="underline">{admin ? "remove" : "add"}</span> <span className="text-yellow bg-yellow/20 px-2">admin</span> status of user <span className="text-royalblue">{username}</span>?</p>}
            confirmText={"Confirm"}
          >
            <button
              className="flex items-center justify-center hover:bg-yellow/20 hover:text-yellow active:bg-yellow/20 active:text-yellow px-2 py-1 h-8 w-8 rounded font-bold disabled:bg-grey/70 disabled:text-black/50"
              disabled={email === userAuth.email}
            >
              <span className={`-mb-1 fi fi-${admin ? "sr-star text-yellow" : "rr-star"}`}></span>
            </button>
          </DialogWrapper>
          <DialogWrapper
            onConfirm={() => toggleUserFlag(_id, "blocked")}
            message={<p>Are you sure you want to <span className={"px-2 " + (blocked ? "text-green bg-green/30" : "text-red bg-red/30")}>{blocked ? "unblock" : "block"}</span> user <span className="text-royalblue">{username}</span>?</p>}
            confirmText={!blocked ? "Block" : "Unblock"}
          >
            <button
              disabled={email === userAuth.email}
              className="hover:bg-red/30 hover:text-red px-2 py-1 rounded disabled:bg-grey disabled:opacity-60 disabled:text-black"
            >
              {!blocked ? "Block" : "Unblock"}
            </button>
          </DialogWrapper>
        </div>
      </td>
    </tr>
  );
};

export default ManageUserCard;