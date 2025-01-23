import { TfiWrite } from "react-icons/tfi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout,isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/signin");
  };

  const onLogin = () => {
    navigate("/signin");
  };

  const onWrite = () => {
    if (isLoggedIn) {
      navigate("/publish");
    }else{
      navigate("/signin");
    }
  };

  return (
    <div className="flex items-center justify-between p-2 sm:p-4 border border-b-zinc-300">
      <div>
        <Link to={"/"}>Logo</Link>
      </div>
      <div className="flex items-center gap-5 sm:gap-14">
        <button onClick={onWrite} className="ml-2 flex items-center">
          <TfiWrite size={25} />
          <p className="ml-2">Write</p>
        </button>
        {isLoggedIn ? (
          <button
            onClick={onLogout}
            className="text-red-400 border border-black rounded-md px-3 py-2"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={onLogin}
            className="text-red-400 border border-black rounded-md px-3 py-2"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
