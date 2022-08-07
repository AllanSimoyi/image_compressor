import Head from 'next/head';
import React, { Suspense } from "react";

// import ImageCompressor from "../components/ImageCompressor";
import dynamic from 'next/dynamic';

const ImageCompressor = dynamic( () => import( '../components/ImageCompressor' ), {
  ssr: false,
} );

export default function Index () {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="A Simple Offline Image Compressor Built With React"
        />
        <link rel="apple-touch-icon" href="logo192.png" />
      </Head>
      <Suspense fallback={ `Loading...` }>
        <ImageCompressor />
      </Suspense>
    </>
  )
}
