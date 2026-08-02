import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const CTA = () => {
  return (
    <section className="bg-green-600 py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-5xl font-bold text-white">
          Ready to Protect Your Crops?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-green-100">
          Detect diseases instantly using AI and improve crop productivity with AgroGuard.
        </p>

        <div className="mt-10 flex justify-center gap-5">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/predict">Start Detection</Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;