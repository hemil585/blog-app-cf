import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import axios from "axios";
import BlogSkeleton from "../components/BlogSkeleton";

type Blog = {
  id: string;
  title: string;
  content: string;
  image:string
  author: {
    username: string;
  };
  createdAt: string;
};

const Home = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [wordLimit, setWordLimit] = useState(50); // default for large screens
  const [loading, setLoading] = useState(true);

  const getBlogs = async () => {
    try {
      const res = await axios("https://blog-app-cf.hemilpatel3534.workers.dev/api/v1/blog/bulk", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      setBlogs(res.data);
      setLoading(false);
    } catch (error: unknown) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWordLimit(window.innerWidth <= 500 ? 35 : 70);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getBlogs();
  }, []);

  const truncateContent = (text: string) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + " ...."
      : text;
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="px-2 md:px-14 py-5">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <>
                <BlogSkeleton key={index} />
              </>
            ))
          : blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                content={truncateContent(blog.content)}
                image={blog.image}
                author={blog.author.username}
                published={formatDate(blog.createdAt)}
              />
            ))}
      </div>
    </>
  );
};

export default Home;
