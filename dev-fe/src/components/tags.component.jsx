import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

const Tag = ({ tag, tagIndex }) => {

  let { post, post: { tags }, setPost } = useContext(EditorContext);

  const addEditable = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  }

  const handleTagEdit = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();

      let currentTag = e.target.innerText.trim();

      if (currentTag === "") {
        // Remove tag if empty
        tags = tags.filter((_, index) => index !== tagIndex);
      } else {
        // Update tag
        tags[tagIndex] = currentTag;
      }

      setPost({ ...post, tags });

      e.target.setAttribute("contentEditable", false);
    }
  }

  const handleTagDelete = () => {
    tags = tags.filter(t => t != tag);

    setPost({ ...post, tags })
  }

  return (
    <div className="relative p-2 mt-2 mr-2 px-4 bg-white rounded-full inline-block hover:bg-opacity-60 pr-8">
      <p className="outline-none" onClick={addEditable} onKeyDown={handleTagEdit} >{tag}</p>
      <button className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2  opacity-50 hover:opacity-80"
        onClick={handleTagDelete}>
        <span className="fi fi-br-cross text-sm pointer-events-none"></span>
      </button>

    </div>
  )
}

export default Tag;