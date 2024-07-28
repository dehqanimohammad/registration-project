"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import Dey from "../../public/dey.webp";
import { Provider } from "react-redux";
import store from "../../redux/store";

function layout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <main className="max-w-[375px] mx-auto relative bg-gray-100 h-screen">
        <div className=" flex ">
          <div className=" h-[207px] rounded-b-3xl w-full items-center justify-center bg-primary-color">
            <Image className="mx-auto mt-[36px]" alt="DeyBank" src={Dey} />
          </div>
        </div>
        <div className="-translate-y-16">{children}</div>
      </main>
    </Provider>
  );
}

export default layout;
