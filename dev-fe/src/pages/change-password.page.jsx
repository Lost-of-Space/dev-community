import { useContext, useRef } from "react"
import AnimationWrapper from "../common/page-animation"
import InputBox from "../components/input.component"
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../App";

const ChangePasswordPage = () => {

  let changePasswordForm = useRef();

  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  let { userAuth: { access_token } } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    let form = new FormData(changePasswordForm.current);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value
    }

    let { currentPassword, newPassword } = formData;

    if (!currentPassword.length || !newPassword.length) {
      return toast.error("Fill all of the inputs.");
    }

    if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
      return toast.error("Password should be 6 to 20 chars long with at least 1 numeric, 1 lowercase and 1 uppercase letters.")
    }

    e.target.setAttribute("disabled", true);

    let loadingToast = toast.loading("Updating...")

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", formData, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
      .then(() => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        changePasswordForm.current.reset();
        return toast.success("Password Changed.")
      })
      .catch(({ response }) => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        return toast.error("Error Changing Password... " + response.data.error);
      })
  }

  return (
    <AnimationWrapper>
      <Toaster />
      <form ref={changePasswordForm}>
        <h1 className="max-md:hidden text-xl">Change Password</h1>

        <div className="py-6 w-full md:max-w-[400px]">
          <InputBox name="currentPassword" type="password" className="profile-edit-input" placeholder="Current Password" icon="fi-rr-unlock" />
          <InputBox name="newPassword" type="password" className="profile-edit-input" placeholder="New Password" icon="fi-rr-unlock" />

          <button onClick={handleSubmit} className="btn-dark px-10" type="submit">Change Password</button>
        </div>
      </form>
    </AnimationWrapper>
  )
}

export default ChangePasswordPage