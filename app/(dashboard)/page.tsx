import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="bg-white flex flex-col mx-auto w-10/12 min-h-96">
      <div className="mt-10 mx-5">
        <p>برای ثبت نام دکمه زیر را بزنید</p>
      </div>
      <div className="mx-auto flex mt-10">
        <Link href="/sign-up">
          <span className="py-2 px-20 rounded-lg text-white bg-primary-color">
            ثبت نام
          </span>
        </Link>
      </div>
    </div>
  );
}
