import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/authSchema";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse?.credential;

      if (!credential) {
        throw new Error("Google credential was not returned");
      }

      await googleLogin(credential, "login");
      toast.success("Google login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Google login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Login
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...registerField("email")}
              className="w-full rounded-xl border p-3"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...registerField("password")}
              className="w-full rounded-xl border p-3"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          <div className="my-5 flex items-center gap-3">
  <div className="h-px flex-1 bg-gray-300"></div>
  <span className="text-sm text-gray-500">
    OR
  </span>
  <div className="h-px flex-1 bg-gray-300"></div>
</div>

<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => {
    toast.error("Google login failed");
  }}
/>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/forgot-password" className="font-semibold text-green-600">
            Forgot Password?
          </Link>
        </div>

        <p className="mt-6 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-green-600"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;