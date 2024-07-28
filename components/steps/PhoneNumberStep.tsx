"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setPhoneNumber, sendOtp } from "../../redux/authSlice";

interface PhoneNumberFormData {
  phone_number: number;
}

const PhoneNumberStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneNumberFormData>();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const onSubmit = async (data: PhoneNumberFormData) => {
    dispatch(setPhoneNumber(data.phone_number));
    const result = await dispatch(sendOtp(data.phone_number));

    if (sendOtp.fulfilled.match(result)) {
      onNext();
    }
  };

  return (
    <div className="relative h-full ">
      <h2 className="text-center mt-4">شماره تلفن همراه را وارد کنید</h2>
      <form className="mx-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6">
          <input
            placeholder="تلفن همراه"
            id="phone_number"
            type="tel"
            {...register("phone_number", {
              required: "شماره موبایل را وارد کنید",
              pattern: {
                value: /^[0-9]{11}$/,
                message: "فرمت اشتباه",
              },
            })}
            className="mt-1 w-11/12 mx-auto flex p-2 border border-gray-300 rounded-md"
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm mt-1 mx-2">
              {errors.phone_number.message}
            </p>
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

export default PhoneNumberStep;
