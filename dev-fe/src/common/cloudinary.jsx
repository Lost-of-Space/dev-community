// useCloudinaryUpload.js
import { useState } from "react";
import { toast } from "react-hot-toast";

const MAX_FILE_SIZE_MB = 4;

const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`Max File Size ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const imageUrl = data.secure_url;

        return imageUrl;
      } else {
        toast.error(`Error: ${data.error.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadToCloudinary };
};

export default useCloudinaryUpload;