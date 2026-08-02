import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
} from "../ui/avatar";

const Navbar = () => {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteAccount();
      navigate("/register");
    } catch (error) {
      console.error("Delete account failed", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <Link
          to="/"
          className="text-2xl font-bold text-green-700"
        >
          🌱 AgroVision
        </Link>

        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="font-medium hover:text-green-600"
          >
            Home
          </Link>

          {user && (
            <>
              <Link
                to="/predict"
                className="font-medium hover:text-green-600"
              >
                Predict
              </Link>

              <Link
                to="/dashboard"
                className="font-medium hover:text-green-600"
              >
                Dashboard
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="font-medium hover:text-green-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
              >
                Register
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-xl border px-3 py-2 transition hover:bg-green-50">

                  <Avatar>
                    <AvatarFallback className="bg-green-600 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-left">
                    <p className="text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">

                <DropdownMenuLabel>
                  My Account
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  Logout
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleDeleteAccount}
                  className="text-red-700"
                >
                  Delete Account
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;