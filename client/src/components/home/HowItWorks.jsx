import { Upload, BrainCircuit, SearchCheck, Stethoscope } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Image",
    desc: "Upload a crop leaf image from your device.",
  },
  {
    icon: BrainCircuit,
    title: "AI Analysis",
    desc: "Our MobileNetV2 model processes the image.",
  },
  {
    icon: SearchCheck,
    title: "Prediction",
    desc: "Disease class and confidence score are generated.",
  },
  {
    icon: Stethoscope,
    title: "Treatment",
    desc: "Receive disease information and recommendations.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-green-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold">
            How <span className="text-green-600">AgroGuard</span> Works
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="rounded-3xl bg-white p-8 text-center shadow-lg"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Icon size={30} />
                </div>

                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>

                <p className="text-gray-600">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;