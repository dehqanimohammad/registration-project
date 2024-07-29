"use client";
import AgentInfo from "@/components/steps/AgentInfo";
import NameStep from "@/components/steps/NameStep";
import OtpVerificationStep from "@/components/steps/OtpVerificationStep";
import PhoneNumberStep from "@/components/steps/PhoneNumberStep";
import { RootState } from "@/redux/store";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function page() {
  const accesstoken = useSelector((state: RootState) => state.auth.accessToken);
  const userState = useSelector((state: RootState) => state.auth.userInfo);
  console.log(accesstoken);
  console.log(userState);
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  console.log(step);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleLoginSuccess = () => {
    console.log("you have a token you are logged in");
    console.log(accesstoken);
    router.push("/");
  };
  return (
    <>
      <div className="bg-white flex flex-col mx-auto w-10/12 h-[570px] rounded-xl">
        {step === 1 && <PhoneNumberStep onNext={handleNext} />}
        {step === 2 && <OtpVerificationStep onNext={handleNext} />}
        {step === 3 && <NameStep onNext={handleNext} />}
        {step === 4 && <AgentInfo onLoginSuccess={handleLoginSuccess} />}
      </div>
    </>
  );
}

export default page;
