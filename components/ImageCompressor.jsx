import React, { useCallback } from "react";
import imageCompression from "browser-image-compression";
import Card from "react-bootstrap/Card";
import Spinner from 'react-bootstrap/Spinner';
import S3 from "react-aws-s3";
import { getImageUrlWithFallback } from "../lib/image-rendering";

const PLACEHOLDER_IMAGE_URL = "http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png";

export default function ImageCompressor () {
  const [originalImage, setOriginalImage] = React.useState(undefined);
  const [compressedImage, setCompressedImage] = React.useState(undefined);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = React.useCallback((event) => {
    setOriginalImage(event.target.files[0]);
  }, []);

  const uploadToS3 = useCallback(async (compressedImage) => {
    try {
      setIsUploading(true);
      // await new Promise((resolve) => setTimeout(() => resolve(), 4000));
      const config = {
        bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME,
        region: process.env.NEXT_PUBLIC_REGION,
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_ACCESS_KEY,
      };
      const s3Client = new S3(config);
      const data = await s3Client.uploadFile(compressedImage, compressedImage.name);
      if (data.status !== 204) {
        throw new Error("Failed to upload to S3, please try again");
      }
    } catch (error) {
      alert(JSON.stringify(error));
      return new Error(error?.message || "Something went wrong uploading to S3, please try again");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleCompress = React.useCallback(async (event) => {
    event.preventDefault();
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true
      };
      const imageSizeMB = originalImage.size / (1024 * 1024);
      if (options.maxSizeMB >= imageSizeMB) {
        throw new Error("Image is too small, can't be compressed!");
      }
      const compressedImage = await imageCompression(originalImage, options);
      setCompressedImage(compressedImage);
      const error = await uploadToS3(compressedImage);
      // Purposefully use verbose error checking for easier understanding of the logic
      if (error) {
        throw error;
      }
      return 1;
    } catch (error) {
      alert(error?.message || "Something went wrong, please try again");
      return 0;
    }
  }, [originalImage]);
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
            src={getImageUrlWithFallback(originalImage, PLACEHOLDER_IMAGE_URL)}
          />
          <div className="d-flex justify-content-center">
            <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2 btn btn-dark w-75" />
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-12 mb-5 mt-5 col-sm-12 d-flex justify-content-center align-items-baseline">
          <br />
          {originalImage && (
            <button type="button" className="btn btn-dark" onClick={handleCompress}>
              Compress
            </button>
          )}
        </div>

        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-3">
          <Card.Img variant="top" src={getImageUrlWithFallback(compressedImage, PLACEHOLDER_IMAGE_URL)} />
          <div className="d-flex justify-content-center">
            {compressedImage && !isUploading && (
              <a href={URL.createObjectURL(compressedImage)} download={URL.createObjectURL(compressedImage)} className="mt-2 btn btn-dark w-75">
                Download
              </a>
            )}
            {isUploading && (
              <div className="mt-2 btn p-4 justify-content-center">
                <Spinner animation="grow" />
                <span>Uploading...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}