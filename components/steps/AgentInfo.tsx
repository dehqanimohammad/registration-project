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
    if (watchedAgencyCode !== null) {
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
  useEffect(() => {
    const getCities = async (watchedProvince: number) => {
      if (watchedProvince !== undefined) {
        const URL =
          "https://stage-api.sanaap.co/base/counties_wop/" +
          "province=" +
          String(watchedProvince);
        const response = await axios.get(URL); //request doesnt work
        console.log(response);
        setCities(response.data);
        console.log(URL);
      }
    };
    getCities(watchedProvince);
  }, [watchedProvince]);

  // console.log(cities);

  return (
    <div className="p-3 overflow-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="کد نمایندگی"
          id="agent_code"
          type="text"
          {...register("agent_code", { required: "کد را وارد کنید" })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.agent_code && (
          <p className="text-red-500 text-sm mt-1">
            {errors.agent_code.message}
          </p>
        )}
        {isAgencyCodeUsed === true && <p>کد را میتوان استفاده کرد</p>}
        <input />
        <select
          id="provinces"
          {...register("province", { required: "استان انتخاب کنید لطفا" })}
        >
          <option value={""}>استان</option>
          {allprovinces.map((option: any, index) => (
            <option value={option.id}>{option.name}</option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default AgentInfo;
