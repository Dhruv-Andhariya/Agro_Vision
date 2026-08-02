import { UploadCloud } from "lucide-react";

const ImageUpload = ({ image, setImage }) => {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  return (
    <label className="flex h-80 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-400 bg-green-50 transition hover:bg-green-100">
      <UploadCloud className="mb-4 h-14 w-14 text-green-600" />

      <h2 className="text-2xl font-semibold">
        Upload Crop Image
      </h2>

      <p className="mt-2 text-gray-500">
        JPG • PNG • JPEG
      </p>

      {image && (
        <p className="mt-4 font-medium text-green-700">
          {image.name}
        </p>
      )}

      <input
        hidden
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
    </label>
  );
};

export default ImageUpload;