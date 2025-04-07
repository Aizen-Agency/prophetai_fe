import React from 'react';
import './styles.css';
import RevealText from './RevealText';
import { WhatWeDoComponent } from './what-we-do';

const Header: React.FC = () => {
  return (
    // <div className="flex flex-col items-center justify-center text-center px-4 py-20 bg-[#121218] text-white">
    //   {/* Rounded subtitle */}

    //   <div className="absolute top-0 left-0 z-0">
    //     <div className="blob-gradient" />
    //   </div>
    <div className="flex flex-col items-center justify-center text-center pt-20 text-white bg-black z-[-2]">
      {/* Rounded subtitle */}

      <div className="absolute top-0 left-0 z-10">
        <div className="blob-gradient" />
      </div>

      <video
        className="absolute left-0 w-full h-[120vh] object-cover pointer-events-none top-[300px] z-0"
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        controlsList="nodownload noplaybackrate"
      >
        <source src="/FlowingBackground.mp4" type="video/mp4" />
      </video>
      <div className="bg-gray-800 border border-white/20 rounded-full px-3 py-1.5 mb-6 flex items-center gap-2 text-xs z-[10]">
        <span className="bg-purple-500 text-xs font-semibold px-2 py-0.5 rounded-full">#1</span>
        <span className="text-gray-300">Rated Voice AI Platform</span>
        <span className="text-gray-300 ml-1">›</span>
      </div>

      <h1 className="text-6xl font-semibold mb-4 font-[Poppins] tracking-wide drop-shadow-[0_0_25px_rgba(168,85,247,0.2)]">
        <RevealText text="Transform Your Voice" />
        <br />
        <span className="reveal-delay-1 inline-block">
          <RevealText text="with " delay={0.2} />
          <span className="inline-block hover:scale-105 transition-transform duration-300">
            <RevealText 
              text="Wavii" 
              delay={0.6}
              className="wavii-gradient font-bold"
            />
          </span>
        </span>
      </h1>
      
      <p className="text-gray-400 max-w-2xl mb-8 font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
        <RevealText 
          text="Unleash the power of AI voice technology. Create stunning voiceovers, clone voices, and generate natural speech in seconds with our cutting-edge platform"
          delay={0.3}
        />
      </p>
      
      <div className="flex gap-4 mb-16 z-[1]">
        <button className="px-6 py-3 font-medium bg-gradient-to-r from-purple-600 to-purple-800 rounded-full hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300">
          Try Wavii Free
        </button>

      </div>

      <div className="max-w-[1080px] mx-auto relative">

        <video 
          className="w-full rounded-lg shadow-lg relative z-10 drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]"
          controls
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/aizen.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Clean transition using pure gradient */}
      <div className="w-full relative mt-20">
        <div className="w-full h-[50px] bg-gradient-to-b from-transparent to-black" />
        <WhatWeDoComponent />
      </div>
    </div>
  );
};

export default Header;