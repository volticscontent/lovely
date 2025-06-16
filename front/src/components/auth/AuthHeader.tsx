"use client";

import React from 'react';
import Image from 'next/image';

const AuthHeader = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/20 to-black/80 min-h-[300px]">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 flex items-center justify-center">
        <Image
          src="/images/logo.png"
          alt="Lovely Logo"
          width={200}
          height={200}
          className="w-auto h-auto max-w-[150px] md:max-w-[200px]"
          priority
        />
      </div>
    </div>
  );
};

export default AuthHeader; 