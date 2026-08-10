import heroImage from "../../assets/images/hero.png";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";



const Hero = () => {
  const { user } = useAuth();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50 via-white to-white">
      <div className="mx-auto grid min-h-[90vh] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            <Sparkles size={16} />
            AI Powered Agriculture
          </div>

          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 lg:text-6xl">
            Detect Crop Diseases
            <span className="block text-green-600">In Seconds</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-gray-600">
            Upload a crop image and receive AI-powered disease detection,
            confidence score, and treatment recommendations instantly.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild>
              <Link to={user ? "/predict" : "/login"}>
                Scan Crop
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
  <Link to="#">Watch Demo</Link>
</Button>
<div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-600">
  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow">
    ✅ <span>74.19% Validation Accuracy</span>
  </div>

  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow">
    🌿 <span>800+ Training Images</span>
  </div>

  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow">
    🤖 <span>MobileNetV2 AI</span>
  </div>
</div>
          </div>
        </motion.div>

        {/* Right */}
       <motion.div
  initial={{ opacity: 0, x: 60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  className="relative flex items-center justify-center"
>
  <div className="absolute h-[420px] w-[420px] rounded-full bg-green-200/40 blur-3xl" />

  <img
    src={heroImage}
    alt="AgroGuard"
    className="relative z-10 w-full max-w-xl"
  />

  <div className="absolute left-2 top-8 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md">
    <p className="text-xs text-gray-500">Prediction</p>
    <h3 className="font-bold text-green-600">Healthy 🌱</h3>
    <p className="text-sm">96.8% Confidence</p>
  </div>

  <div className="absolute right-0 top-20 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md">
    <p className="text-xs text-gray-500">AI Engine</p>
    <h3 className="font-bold">MobileNetV2</h3>
  </div>

  <div className="absolute bottom-6 right-8 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md">
    <p className="text-xs text-gray-500">Predictions</p>
    <h3 className="font-bold text-green-600">2,431+</h3>
  </div>
</motion.div>
      </div>
    </section>
  );
};

export default Hero;