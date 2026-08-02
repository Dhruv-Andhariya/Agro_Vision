import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Leaf className="text-green-400" />
              <h2 className="text-2xl font-bold">AgroGuard</h2>
            </div>

            <p className="text-slate-400">
              AI-powered crop disease detection platform for modern agriculture.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Product</h3>

            <div className="space-y-3 text-slate-400">
              <Link to="/">Home</Link><br />
              <Link to="/predict">Predict</Link><br />
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Company</h3>

            <div className="space-y-3 text-slate-400">
              <p>About</p>
              <p>Contact</p>
              <p>Privacy Policy</p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">AI Model</h3>

            <div className="space-y-3 text-slate-400">
              <p>MobileNetV2</p>
              <p>TensorFlow</p>
              <p>FastAPI</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-700 pt-6 text-center text-slate-500">
          © 2026 AgroGuard. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;