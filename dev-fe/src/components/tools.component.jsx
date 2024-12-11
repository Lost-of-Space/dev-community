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
const MAX_FILE_SIZE_MB = 2;
const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    // Checking file size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      reject(new Error(`File size exceeds ${MAX_FILE_SIZE_MB} MB`));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      toast.error('Oops! An error occurred while reading..');
      reject(error);
    };
    reader.readAsDataURL(file); // Reading as base64
  });
};

const uploadImageByFile = (file) => {
  return uploadImage(file)
    .then((base64) => {
      toast.success('Successfully Uploaded!');
      return {
        success: 1,
        file: { url: base64 }, // Saves as base64
      };
    })

    .catch((error) => {
      toast.error('Max File size is 4MB!');
      return {
        success: 0,
        message: error.message,
      };
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
