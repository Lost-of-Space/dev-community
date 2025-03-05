import { Link } from "react-router-dom";
import pageNotFoundImage from "../imgs/404error.png";
import TextAnimationWrap from "../common/text-animation";
import logo from "../imgs/logo.svg";
import FallingStars from "../components/stars.background.component";

const PageNotFound = () => {
  return (
    <div className="relative bg-black">
      <FallingStars glowing="true" />
      <section className="h-cover relative p-10 flex flex-col items-center gap-3 text-center">
        <img src={pageNotFoundImage} alt="404 error image" className="select-none border-grey w-auto h-96 max-sm:h-64 aspect-auto object-cover" />

        <TextAnimationWrap text="Oops! Page not found.." className="font-bold text-2xl sm:text-3xl text-white" speed={30} />
        <p className="font-medium text-white">The page you are looking for does not exists.</p>
        <p className="text-white">You can return to the <Link to="/" className="text-royalblue underline">Home Page</Link></p>

        <div className="mt-auto">
          <img src={logo} alt="Dev Space logo" className="h-20 object-contain block select-none invert brightness-0" />
          <p className="text-grey opacity-60 -mt-4">Maybe you wanna explore another page?</p>
        </div>
      </section>
    </div>
  )
}

export default PageNotFound;