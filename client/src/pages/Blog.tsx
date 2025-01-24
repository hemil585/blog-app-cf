import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Blog = () => {
  const params = useParams();
  const [blog, setBlog] = useState();

  const getBlog = async () => {
    try {
      const res = await axios(
        `https://blog-app-cf.hemilpatel3534.workers.dev/api/v1/blog/${params.id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      );

      setBlog(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBlog();
  }, []);

  return (
    <div>
      <div>
        {blog ? (
          <div>
            <img
              className="object-cover w-[15rem] h-[15rem] bg-center rounded-t-lg md:h-full md:w-1/2 md:rounded-none md:rounded-s-lg md:mr-5"
              src={`data:image/jpeg;base64,${blog.base64String}`}
              alt="image"
            />
            <h1>{blog.post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: blog.post.content }}></div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Blog;
