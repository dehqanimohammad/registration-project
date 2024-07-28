"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setAgencyData, login } from "@/redux/authSlice";
import axios from "axios";
import { url } from "inspector";

interface AgentInfoFormData {
  address: string;
  agency_type: string;
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
  const [selectedProvince, setSelectedProvince] = useState({});
  const [allprovinces, setAllProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [branches, setBranches] = useState([]);
  const [typeAgency, setTypeAgency] = useState("");
  const [isAgencyCodeUsed, setIsAgencyCodeUsed] = useState(false);

  useEffect(() => {
    const getProvinces = async () => {
      const response = await axios.get(
        "https://stage-api.sanaap.co/base/provinces_wop/"
      );

      setAllProvinces(response.data);
    };
    getProvinces();
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AgentInfoFormData>();

  const watchedAgencyCode = watch("agent_code");
  const watchedProvince = watch("province");

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
          console.log(response);
          setIsAgencyCodeUsed(response.data.is_success);
        } catch (error) {
          console.log(error);
          setIsAgencyCodeUsed(false);
        }
      };
      checkAgency(watchedAgencyCode);
    }
  }, [watchedAgencyCode]);

  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const finalUserInfo = useSelector((state: RootState) => state.auth.userInfo);

  const onSubmit = async (data: AgentInfoFormData, sendData: any) => {
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

    sendData(finalUserInfo);
  };

  const sendData = async (finalUserInfo: FinalResultInformation) => {
    const result = await dispatch(login(finalUserInfo));
    console.log(result);

    if (login.fulfilled.match(result)) {
      onLoginSuccess();
    }
  };
  console.log(typeof watchedProvince, watchedProvince);
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

  console.log(cities);

  return (
    <div className="p-3 overflow-auto">
      <form className="flex-flex-col" onSubmit={handleSubmit(onSubmit)}>
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
        <input />
        <div className="flex flex-col">
          <select
            id="provinces"
            {...register("province", { required: "استان انتخاب کنید لطفا" })}
          >
            <option value={""}>استان</option>
            {allprovinces.map((option: any, index) => (
              <option value={option.id}>{option.name}</option>
            ))}
          </select>
          <select
            disabled={cities.length === 0}
            className="mt-4"
            id="city"
            {...register("county", { required: "شهرستان را انتخاب کنید لطفا" })}
          >
            <option value={""}>شهر</option>
            {cities.map((option: any, index) => (
              <option value={option.id}>{option.name}</option>
            ))}
          </select>
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
          className="w-full border border-gray-200 bg-gray-100 rounded-md px-2 py-2 mt-2"
        />
      </form>
    </div>
  );
};

export default AgentInfo;
