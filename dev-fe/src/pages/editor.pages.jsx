import { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import PostEditor from "../components/post-editor.component";
import PublishForm from "../components/publish-form.component";

const postStructure = {
  title: '',
  banner: '',
  content: [],
  tags: [],
  des: '',
  author: { personal_info: {} }
}

export const EditorContext = createContext({})

const Editor = () => {

  const [post, setPost] = useState(postStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false })

  let { userAuth: { access_token } } = useContext(UserContext)

  return (
    <EditorContext.Provider value={{ post, setPost, editorState, setEditorState, textEditor, setTextEditor }}>
      {
        access_token === null ? <Navigate to="/signin" />
          :
          editorState == "editor" ? <PostEditor /> : <PublishForm />
      }
    </EditorContext.Provider>
  )
}

export default Editor;