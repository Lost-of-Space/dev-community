import { Link } from "react-router-dom";
import pageNotFoundImage from "../imgs/404error.png";
import TextAnimationWrap from "../common/text-animation";
import logo_white from "../imgs/logo_white.svg";
import FallingStars from "../components/stars.background.component";

const PageNotFound = () => {
  return (
    <div className="relative bg-black-404">
      <FallingStars glowing="true" />
      <section className="h-cover relative p-10 flex flex-col items-center gap-3 text-center">
        <img src={pageNotFoundImage} alt="404 error image" className="select-none border-grey-404 w-auto h-96 max-sm:h-64 aspect-auto object-cover" />

        <TextAnimationWrap text="Oops! Page not found.." className="font-bold text-2xl sm:text-3xl text-white-404" speed={30} />
        <p className="font-medium text-white-404">The page you are looking for does not exists.</p>
        <p className="text-white-404">You can return to the <Link to="/" className="text-royalblue underline">Home Page</Link></p>

        <div className="mt-auto">
          <img src={logo_white} alt="Dev Space logo" className="h-20 object-contain block select-none" />
          <p className="text-grey-404 opacity-60 -mt-4">Maybe you wanna explore another page?</p>
        </div>
      </section>
    </div>
  )
}

export default PageNotFound;