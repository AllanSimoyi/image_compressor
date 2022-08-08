import React from "react";
import imageCompression from "browser-image-compression";
import Card from "react-bootstrap/Card";

export default function ImageCompressor () {
  const [state, setState] = React.useState({
    compressedLink: "http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png",
    originalImage: undefined,
  });

  const handleFileChange = React.useCallback((event) => {
    const imageFile = event.target.files[0];
    setState((prevState) => ({
      ...prevState,
      originalImage: imageFile,
    }));
  }, []);

  const handleCompress = React.useCallback(async (event) => {
    event.preventDefault();
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true
      };
      const imageSizeMB = state.originalImage.size / (1024 * 1024);
      if (options.maxSizeMB >= imageSizeMB) {
        throw new Error("Image is too small, can't be compressed!");
      }
      const output = await imageCompression(state.originalImage, options);
      setState((prevState) => ({
        ...prevState,
        compressedLink: URL.createObjectURL(output)
      }));
      return 1;
    } catch (error) {
      alert(error?.message || "Something went wrong, please try again");
      return 0;
    }
  }, [state.originalImage]);
  return (
    <div className="m-5">
      <div className="text-light text-center">
        <h1>Three Simple Steps</h1>
        <h4>1. Upload Image</h4>
        <h4>2. Click on Compress</h4>
        <h4>3. Download Compressed Image</h4>
      </div>

      <div className="row mt-5">
        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
          <Card.Img
            className="ht"
            variant="top"
            src={state.originalImage ? URL.createObjectURL(state.originalImage) : "http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png"}
          />
          <div className="d-flex justify-content-center">
            <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2 btn btn-dark w-75" />
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-12 mb-5 mt-5 col-sm-12 d-flex justify-content-center align-items-baseline">
          <br />
          {state.originalImage && (
            <button type="button" className="btn btn-dark" onClick={handleCompress}>
              Compress
            </button>
          )}
        </div>

        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-3">
          <Card.Img variant="top" src={state.compressedLink} />
          {state.compressedLink && (
            <div className="d-flex justify-content-center">
              <a href={state.compressedLink} download={state.compressedLink} className="mt-2 btn btn-dark w-75">
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}