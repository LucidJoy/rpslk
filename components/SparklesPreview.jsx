"use client";
import React from "react";
import { SparklesCore } from "./ui/sparkles";

export function SparklesPreview() {
  return (
    <div className='h-[100vh] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden'>
      <div className='w-full absolute inset-0 h-screen'>
        <SparklesCore
          id='tsparticlesfullpage'
          background='transparent'
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className='w-full h-full'
          particleColor='#b159fe'
        />
      </div>

      {/* <h1 className='md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20'>
        Build great products
      </h1> */}
    </div>
  );
}
