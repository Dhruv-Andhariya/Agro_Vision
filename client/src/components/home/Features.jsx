import { motion } from "framer-motion";
import {
  ScanSearch,
  BrainCircuit,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: ScanSearch,
    title: "Disease Detection",
    description:
      "Upload crop images and detect diseases using AI within seconds.",
  },
  {
    icon: BrainCircuit,
    title: "AI Analysis",
    description:
      "MobileNetV2 analyzes plant health with confidence prediction.",
  },
  {
    icon: ShieldCheck,
    title: "Treatment Guide",
    description:
      "Receive disease information and recommended treatment instantly.",
  },
  {
    icon: BarChart3,
    title: "Prediction History",
    description:
      "Track previous scans and monitor crop health over time.",
  },
];

const Features = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold">
            Why Choose <span className="text-green-600">AgroGuard?</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            AI-powered technology built to help farmers detect diseases early
            and protect crop productivity.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-green-100 bg-white p-8 shadow-lg hover:shadow-2xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                  <Icon size={30} />
                </div>

                <h3 className="mb-3 text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;