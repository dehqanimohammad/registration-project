"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setAgencyData, login } from "@/redux/authSlice";
import axios from "axios";

interface AgentInfoFormData {
  address: string;
  agency_type: string;
  agency_type_name?: string;
  agent_code: number;
  city_code: number;
  county: string;
  insurance_branch: string;
  phone: number;
  province: number;
}
interface FinalResultInformation {
  address: string;
  agency_type: string;
  agent_code: number;
  city_code: number;
  county: string;
  first_name: string;
  insurance_branch: string;
  last_name: string;
  phone: number;
  phone_number: number;
  province: number;
}

const AgentInfo: React.FC<{ onLoginSuccess: () => void }> = ({
  onLoginSuccess,
}) => {
  const [allprovinces, setAllProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [branches, setBranches] = useState([]);
  const [typeAgency, setTypeAgency] = useState("");
  const [isAgencyCodeUsed, setIsAgencyCodeUsed] = useState(false);

  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const finalUserInfo = useSelector((state: RootState) => state.auth.userInfo);

  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AgentInfoFormData>();

  useEffect(() => {
    const getProvinces = async () => {
      const response = await axios.get(
        "https://stage-api.sanaap.co/base/provinces_wop/"
      );

      setAllProvinces(response.data);
    };
    getProvinces();
  }, []);

  const watchedAgencyCode = watch("agent_code");
  const watchedProvince = watch("province");
  const watchedCounty = watch("county");
  const watchedAgencyType = watch("agency_type");

  console.log(watchedAgencyType);

  useEffect(() => {
    if (watchedAgencyCode >= 1) {
      const checkAgency = async (watchedAgencyCode: number) => {
        try {
          const response = await axios.post(
            "https://stage-api.sanaap.co/api/v2/app/DEY/agent/verification/signup/check_agency_code/",
            {
              agent_code: watchedAgencyCode,
            }
          );
          setIsAgencyCodeUsed(response.data.is_success);
        } catch (error) {
          console.log(error);
          setIsAgencyCodeUsed(false);
        }
      };
      checkAgency(watchedAgencyCode);
    }
  }, [watchedAgencyCode]);

  const onSubmit = async (data: AgentInfoFormData) => {
    dispatch(
      setAgencyData({
        address: data.address,
        agency_type: data.agency_type,
        agent_code: data.agent_code,
        city_code: data.city_code,
        county: data.county,
        insurance_branch: data.insurance_branch,
        phone: data.phone,
        province: data.province,
      })
    );
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      onLoginSuccess();
    }
  };

  useEffect(() => {
    if (watchedProvince >= 1) {
      const getCities = async (watchedProvince: number) => {
        const URL =
          "https://stage-api.sanaap.co/base/counties_wop/?" +
          "province=" +
          watchedProvince;
        const response = await axios.get(URL); //request doesnt work
        setCities(response.data);
      };

      getCities(watchedProvince);
    }
  }, [watchedProvince]);

  useEffect(() => {
    if (watchedCounty !== undefined) {
      const getBranches = async (
        watchedCounty: any,
        watchedProvince: number
      ) => {
        const branchesURL =
          "https://stage-api.sanaap.co/api/v2/app/selection_item/insurance_branch/wop_list/?province=" +
          watchedProvince; //in docs it says insurance=DEY && name=73 should be sent to the api but with help of watchedCounty it can be dynamic as well
        const response = await axios.get(branchesURL);
        setBranches(response.data.response);
        console.log(response.data.response);
      };
      getBranches(watchedCounty, watchedProvince);
    }
  }, [watchedCounty]);

  return (
    <div className="p-3 overflow-auto  w-full">
      <form className="flex-flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="کد نمایندگی"
          id="agent_code"
          type="text"
          {...register("agent_code", { required: "کد را وارد کنید" })}
          className="my-2 px-1 w-full py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.agent_code && (
          <span className="text-red-500 text-sm mt-1">
            {errors.agent_code.message}
          </span>
        )}
        {isAgencyCodeUsed === true && <span>&#9989;</span>}
        <div className="flex flex-col">
          <select
            className="border border-gray-300 rounded-md py-1 px-1"
            id="provinces"
            {...register("province", { required: "استان انتخاب کنید لطفا" })}
          >
            <option value={""}>استان</option>
            {allprovinces.map((option: any, index) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.province && (
            <span className="text-red-500 text-sm mt-1">
              {errors.province.message}
            </span>
          )}
          <select
            className={` mt-4 border border-gray-300 rounded-md py-1 px-1 ${
              cities.length === 0 ? "bg-gray-400" : ""
            } `}
            disabled={cities.length === 0}
            id="county"
            {...register("county", { required: "شهرستان را انتخاب کنید لطفا" })}
          >
            <option value={""}>شهر</option>
            {cities.map((option: any, index) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.county && (
            <span className="text-red-500 text-sm mt-1">
              {errors.county.message}
            </span>
          )}
        </div>
        <textarea
          id="address"
          {...register(`address`, {
            required: "لطفا آدرس را وارد کنید",
            minLength: {
              value: 10,
              message: "حداقل ده کاراکتر",
            },
          })}
          placeholder="آدرس را وارد کنید"
          className="w-full border border-gray-200 bg-gray-100 rounded-md px-2 py-2 mt-3 h-28"
        />
        {errors.address && (
          <span className="text-red-500 text-sm mt-1">
            {errors.address.message}
          </span>
        )}
        <select
          className={` w-full mt-4 border border-gray-300 rounded-md py-1 px-1 ${
            branches.length === 0 ? "bg-gray-400" : ""
          } `}
          disabled={branches.length < 1}
          id="insurance_branch"
          {...register("insurance_branch", {
            required: "شعبه بیمه را انتخاب کنید لطفا",
          })}
        >
          <option value={""}>بیمه</option>
          {branches.map((option: any, index) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        {errors.insurance_branch && (
          <span className="text-red-500 text-sm mt-1">
            {errors.insurance_branch.message}
          </span>
        )}
        <div className="flex flex-col mt-3 p-3">
          <input
            placeholder="شماره ثابت "
            id="city_code"
            type="text"
            {...register("city_code", {
              required: "شماره کد شهر را وارد کنید",
              pattern: {
                value: /^[0-9]{3}$/,
                message: "فرمت اشتباه",
              },
            })}
            className="border border-gray-300 rounded-lg p-2 mt-1"
          />
          {errors.city_code && (
            <span className="text-red-500 text-sm mt-1">
              {errors.city_code.message}
            </span>
          )}
          <input
            placeholder="شماره ثابت "
            id="phone"
            type="text"
            {...register("phone", {
              required: "شماره ثابت را وارد کنید",
              pattern: {
                value: /^[0-9]{8}$/,
                message: "فرمت اشتباه",
              },
            })}
            className="border border-gray-300 rounded-lg p-2 mt-1"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm mt-1">
              {errors.phone.message}
            </span>
          )}
        </div>
        <div className="flex">
          <label className="flex mt-1" htmlFor="haghighi">
            <input
              className="mx-2 items-center justify-center"
              value="حقیقی"
              type="radio"
              id="haghighi"
              {...register("agency_type", {
                required: "انتخاب کنید",
              })}
            />
            حقیقی
          </label>
          <label className="flex mt-1" htmlFor="haghighi">
            <input
              className="mx-2 items-center justify-center"
              value="حقوقی"
              type="radio"
              id="hoghoghi"
              {...register("agency_type", {
                required: "انتخاب کنید",
              })}
            />
            حقوقی
          </label>
        </div>
        {watchedAgencyType === "حقوقی" && (
          <input
            placeholder="نام نمایندگی "
            id="agencyname"
            type="text"
            {...register("agency_type_name", {
              required: "نام نمایندگی را وارد کنید",
            })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        )}
        {errors.agency_type && (
          <p className="text-red-500 text-sm mt-1">
            {errors.agency_type.message}
          </p>
        )}
        <button
          type="submit"
          className="justify-center  bottom-5 w-11/12 mx-auto flex py-2 mt-1 px-4 bg-primary-color text-white font-semibold rounded-md shadow-md hover:bg-gray-700 "
          disabled={isLoading}
        >
          {isLoading ? "در حال ارسال" : "مرحله بعد"}
        </button>
      </form>
    </div>
  );
};

export default AgentInfo;
