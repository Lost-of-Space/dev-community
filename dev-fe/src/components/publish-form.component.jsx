import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";

const PublishForm = () => {

  let characterLimit = 200;
  let tagLimit = 10;

  let { post, post: { banner, title, tags, des }, setEditorState, setPost } = useContext(EditorContext);

  const handleCloseEvent = () => {
    setEditorState("editor")
  }

  const handlePostTitleChange = (e) => {
    let input = e.target;

    setPost({ ...post, title: input.value })
  }

  const handlePostDesChange = (e) => {
    let input = e.target;

    setPost({ ...post, des: input.value })
  }

  const handleEnterKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  }

  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keCode == 188) {
      e.preventDefault();

      let tag = e.target.value;

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setPost({ ...post, tags: [...tags, tag] })
        }
        if (tags.includes(tag)) {
          toast.error("Tag must be unique!")
        }
      } else {
        toast.error(`Max tag count is ${tagLimit}`)
      }
      e.target.value = "";
    }
  }

  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">

        <Toaster />

        <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <span className="fi fi-br-cross"></span>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1">Preview</p>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={banner} alt="banner preview" />
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
          <p className="line-clamp-2 text-xl leading-7 mt-4">{des}</p>
        </div>

        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Post title</p>
          <input type="text" placeholder="Post Title" className="input-box pl-4"
            defaultValue={title} onChange={handlePostTitleChange}
          />

          <p className="text-dark-grey mb-2 mt-9">Short description</p>

          <textarea maxLength={characterLimit} defaultValue={des}
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={handlePostDesChange}
            onKeyDown={handleEnterKeyDown}
            placeholder="*Description affects search results">
          </textarea>

          <p className="mt-1 text-dark-grey text-sm text-right">{des.length}/{characterLimit}</p>
          <p className="text-dark-grey mb-2 mt-9">*Topics helps in searching and ranking your post</p>

          <div className="relative input-box pl-2 py-2 pb-4">
            <input type="text" placeholder="Tag"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleKeyDown}
            />
            {tags.map((tag, i) => {
              return <Tag tag={tag} tagIndex={i} key={i} />
            })
            }

          </div>
          <p className="mt-1 text-dark-grey text-sm text-right">{tags.length}/{tagLimit}</p>

          <button className="btn-dark px-8">Publish</button>
        </div>

      </section>
    </AnimationWrapper>
  )
}

export default PublishForm;