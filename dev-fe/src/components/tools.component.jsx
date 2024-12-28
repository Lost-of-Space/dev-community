//Importing tools
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { toast } from "react-hot-toast";


// Uploading via URL
const uploadImageByURL = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e)
    }
    catch (err) {
      reject(err)
    }
  })

  return link.then(url => {
    return {
      success: 1,
      file: { url }
    }
  })
}


// Uploading as file
const MAX_FILE_SIZE_MB = 4;

const uploadImageByFile = (file) => {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB} MB`);
      reject(new Error(`File size exceeds ${MAX_FILE_SIZE_MB} MB`));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // preset name
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME); // cloudinary username

    fetch(import.meta.env.VITE_CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.secure_url) {
          const optimizedUrl = `${data.secure_url}?c_fill&auto=webp&quality=auto`;
          toast.success('Uploaded');
          resolve({
            success: 1,
            file: { url: optimizedUrl }
          });
        } else {
          toast.error('Image upload failed!');
          reject(new Error('Image upload failed!'));
        }
      })
      .catch((error) => {
        toast.error('Error uploading image');
        reject(error);
      });
  });
};


// Tools config
export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [1, 2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
};
