import axios from "axios";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "../utils/Editor";

const WriteBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);

  const onPublish = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", title);
      data.append("content", content);
      data.append("file", files[0]);
      const dataObj = Object.fromEntries(data.entries());
      await axios.post(
        "https://blog-app-cf.hemilpatel3534.workers.dev/api/v1/blog",
        {
          dataObj,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={onPublish}>
      <div className="md:p-5 p-2">
        <input
          type="file"
          accept="image/*"
          id="image"
          onChange={(e) => setFiles(e.target.files)}
          required
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full md:mb-4 md:p-5 p-2 mb-2 font-bold md:text-5xl border border-blue-500"
          required
        />
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={content}
          placeholder="Write your content here..."
          onChange={setContent}
        />
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={onPublish}
            className="border border-green-400 px-28 md:px-40 py-3 my-5 rounded-full font-bold hover:bg-green-500 hover:text-white hover:border-green-900 transition-all duration-300"
          >
            Publish
          </button>
          <div className="border border-red-400 px-28 md:px-40 py-3 rounded-full hover:bg-red-500 hover:text-white hover:border-red-900 transition-all duration-300">
            Cancel
          </div>
        </div>
      </div>
    </form>
  );
};

export default WriteBlog;
