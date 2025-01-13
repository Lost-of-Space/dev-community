import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
  return (
    <div className={"md:w-[90%] md:mt-7 " + className}>
      <p className="text-xl leading-7">{bio.length ? bio : "No bio written"}</p>

      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey/40">
        {
          Object.keys(social_links).map((key) => {

            let link = social_links[key];

            return link ? <Link to={link} key={key} target="_blank">
              <span className={"fi " + (key != 'website' ? "fi-brands-" + key : "fi-br-globe") + " text-2xl hover:text-royalblue"}></span>
            </Link>
              :
              "";
          })
        }
      </div>

      <p className="text-xl leading-7 text-dark-grey">Joined on {getFullDay(joinedAt)}</p>
    </div>
  )
}

export default AboutUser;