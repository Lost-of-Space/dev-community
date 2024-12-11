import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/default_banner.png"
import { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs"; //lib for text editor
import { tools } from "./tools.component";

const PostEditor = () => {

  let { post, post: { title, banner, content, tags, des }, setPost, textEditor, setTextEditor } = useContext(EditorContext)

  //useEffect
  useEffect(() => {
    setTextEditor(new EditorJS({
      holder: "textEditor",
      data: '',
      tools: tools,
      placeholder: "Type here something..."
    }))
  }, [])

  const [bannerImg, setBannerImg] = useState(defaultBanner);

  const handleBannerUpload = (e) => {
    let img = e.target.files[0];
    if (img) {

      let loadingBannerToast = toast.loading("Uploading...")

      const reader = new FileReader();
      reader.onload = () => {
        setBannerImg(reader.result); //Banner img updating
        //notifiers
        toast.dismiss(loadingBannerToast)
        toast.success('Successfully Uploaded!');
      };
      reader.readAsDataURL(img);
    }
  };

  //Text editor
  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  }

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = 'auto';
    input.style.height = input.scrollHeight + "px";

    setPost({ ...post, title: input.value })
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-20">
          <img src={logo} alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Post"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">
            Publish
          </button>
          <button className="btn-light py-2">
            Save Draft
          </button>
        </div>

      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-70 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img src={bannerImg} alt="banner image"
                  className="z-20" />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              placeholder="Post Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-monospace"></div>

          </div>
        </section>
      </AnimationWrapper>
    </>
  )
}

export default PostEditor;