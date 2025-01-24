import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  published: string;
}

const BlogCard = ({
  id,
  title,
  content,
  author,
  published,
  image,
}: BlogCardProps) => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Link
        to={`${isLoggedIn ? `/blog/${id}` : `/signin`}`}
        className="h-[30rem] md:h-[20rem] border border-b-violet-300 mb-10 flex flex-col items-center rounded-lg md:flex-row "
      >
        <img
          className="object-cover w-full h-[15rem] bg-center rounded-t-lg md:h-full md:w-1/2 md:rounded-none md:rounded-s-lg md:mr-5"
          src={`data:image/jpeg;base64,${image}`}
          alt="image"
        />
        <div className="md:w-1/2 h-full p-1 lg:py-5 flex flex-col justify-between leading-normal">
          <h5 className="mb-2 md:text-3xl sm:text-2xl text-xl font-bold tracking-tight">
            {title}
          </h5>
          <p className="mb-3 font-normal text-sm text-gray-700 dark:text-gray-400">
            {content}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <p className="w-10 h-10 bg-slate-400 rounded-full flex justify-center items-center font-bold">
                {author[0].toUpperCase()}
              </p>
              <span>
                <p>{author}</p>
                <p>{published}</p>
              </span>
            </div>
            <div>
              <p className="mr-5">{`${Math.ceil(
                content.length / 100
              )} min read`}</p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default BlogCard;
