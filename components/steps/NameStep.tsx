import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setName } from "../../redux/authSlice";

interface UserInfoFormData {
  first_name: string;
  last_name: string;
}

const NameStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfoFormData>();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const onSubmit = (data: UserInfoFormData) => {
    dispatch(
      setName({ first_name: data.first_name, last_name: data.last_name })
    );
    onNext();
  };

  return (
    <div className="relative h-full">
      <form className="mx-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6">
          <input
            placeholder="نام"
            id="name"
            type="text"
            {...register("first_name", { required: "نام را وارد کنید" })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.first_name.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <input
            placeholder="نام خانوادگی"
            id="last_name"
            type="text"
            {...register("last_name", {
              required: "نام خانوادگی را وارد کنید",
            })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.last_name.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="justify-center absolute bottom-5 w-11/12 mx-auto flex py-2 mt-1 px-4 bg-primary-color text-white font-semibold rounded-md shadow-md hover:bg-gray-700 "
          disabled={isLoading}
        >
          {isLoading ? "در حال ارسال" : "مرحله بعد"}
        </button>
      </form>
    </div>
  );
};

export default NameStep;
