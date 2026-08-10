import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, Video, X } from "lucide-react";
import { toast } from "react-hot-toast";

const ImageUpload = ({ image, setImage }) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isCameraSupported, setIsCameraSupported] = useState(true);
  const uploadInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setIsCameraSupported(false);
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
    e.target.value = "";
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError("");
  };

  const handleUploadClick = () => uploadInputRef.current?.click();
  const handleCameraClick = async () => {
    if (!isCameraSupported) {
      toast.error("Camera capture is not supported in this browser. Please upload an image instead.");
      return;
    }

    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (error) {
      console.error(error);
      if (error.name === "NotAllowedError") {
        setCameraError("Camera permission was denied. Please allow camera access or upload an image instead.");
      } else {
        setCameraError("Camera is not available on this device.");
      }
      toast.error("Camera access could not be started.");
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 320;
    canvas.height = videoRef.current.videoHeight || 240;
    const context = canvas.getContext("2d");

    if (!context) return;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
      setImage(file);
      stopCameraStream();
      toast.success("Image captured from camera");
    }, "image/jpeg");
  };

  const handleRemove = () => setImage(null);

  return (
    <div className="rounded-2xl border-2 border-dashed border-green-400 bg-green-50 p-4 transition">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleUploadClick}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          <ImagePlus size={18} />
          Upload Image
        </button>

        <button
          type="button"
          onClick={handleCameraClick}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-green-600 bg-white px-4 py-3 font-semibold text-green-700 transition hover:bg-green-100"
        >
          <Camera size={18} />
          Use Camera
        </button>
      </div>

      <input
        ref={uploadInputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

      <input
        ref={cameraInputRef}
        hidden
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
      />

      {isCameraOpen && (
        <div className="mt-4 rounded-xl border border-green-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-gray-700">Camera Preview</p>
            <button
              type="button"
              onClick={stopCameraStream}
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
            >
              Close
            </button>
          </div>

          {cameraError ? (
            <p className="text-sm text-red-600">{cameraError}</p>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="h-64 w-full rounded-xl object-cover" />
              <button
                type="button"
                onClick={handleCapture}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                <Video size={18} />
                Capture Image
              </button>
            </>
          )}
        </div>
      )}

      <div className="mt-4 rounded-xl border border-green-200 bg-white p-4">
        {image ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-green-700">{image.name}</p>
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
              >
                <X size={14} />
                Remove
              </button>
            </div>

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Selected crop"
                className="h-64 w-full rounded-xl object-cover"
              />
            )}
          </div>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center text-center">
            <ImagePlus className="mb-3 h-12 w-12 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-700">Upload Crop Image</h2>
            <p className="mt-2 text-sm text-gray-500">
              JPG • PNG • JPEG • or use your phone camera
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;