"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setOtp, verifyOtp } from "../../redux/authSlice";

interface OtpVerificationFormData {
  otp: string;
}

const OtpVerificationStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpVerificationFormData>();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const onSubmit = async (data: OtpVerificationFormData) => {
    dispatch(setOtp(data.otp));
    const result = await dispatch(verifyOtp(data.otp));
    // console.log(result);

    if (verifyOtp.fulfilled.match(result)) {
      onNext();
    }
  };

  return (
    <div className="relative h-full">
      <h2 className="text-center mt-4">مرحله ۲ کد را وارد کنید</h2>
      <form className="mx-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6">
          <input
            id="otp"
            type="text"
            {...register("otp", {
              required: "کد را وارد کنید",
              pattern: {
                value: /^[0-9]{5}$/,
                message: "فرمت اشتباه است",
              },
            })}
            className="mt-1  w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.otp && (
            <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="justify-center absolute bottom-5 w-11/12 mx-auto flex py-2 mt-1 px-4 bg-primary-color text-white font-semibold rounded-md shadow-md hover:bg-gray-700 "
          disabled={isLoading}
        >
          {isLoading ? "درحال ارسال" : "ارسال"}
        </button>
      </form>
    </div>
  );
};

export default OtpVerificationStep;
