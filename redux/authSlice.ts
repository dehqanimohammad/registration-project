"use client";

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

interface AuthState {
  otp: string;
  userInfo: {
    address: string;
    agency_type: string;
    agent_code: number | null;
    city_code: number | null;
    county: string;
    first_name: string;
    insurance_branch: string;
    last_name: string;
    phone: number | null;
    phone_number: number | null;
    province: number | null;
  };
  isLoading: boolean;
  error: null;
  accessToken: null;
}

const initialState: AuthState = {
  otp: "",
  userInfo: {
    address: "",
    agency_type: "",
    agent_code: null,
    city_code: null,
    county: "",
    first_name: "",
    insurance_branch: "",
    last_name: "",
    phone: null,
    phone_number: null,
    province: null,
  },
  isLoading: false,
  error: null,
  accessToken: null,
};

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (phone_number: number, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://stage-api.sanaap.co/api/v2/app/DEY/agent/verification/signup/create_otp/",
        { phone_number }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otp: string, { getState, rejectWithValue }) => {
    try {
      const { auth }: any = getState();
      const response = await axios.post(
        "https://stage-api.sanaap.co/api/v2/app/DEY/agent/verification/signup/validate_otp/",
        {
          code: otp,
          phone_number: auth.userInfo.phone_number,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userInfo: any, { getState, rejectWithValue }) => {
    try {
      const { auth }: any = getState();
      const response = await axios.post(
        "https://stage-api.sanaap.co/api/v2/app/DEY/agent/verification/signup/check_agency_code/ ",
        {
          ...userInfo,
        }
      );
      const { accessToken } = response.data;
      Cookies.set("accessToken", accessToken, { expires: 7 }); // Store token in cookies for 7 days
      return accessToken;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPhoneNumber(state, action: PayloadAction<number>) {
      state.userInfo.phone_number = action.payload;
    },
    setOtp(state, action: PayloadAction<string>) {
      state.otp = action.payload;
    },
    setName(
      state,
      action: PayloadAction<{ first_name: string; last_name: string }>
    ) {
      state.userInfo.first_name = action.payload.first_name;
      state.userInfo.last_name = action.payload.last_name;
    },
    setAgencyData(
      state,
      action: PayloadAction<{
        address: string;
        agency_type: string;
        agent_code: number;
        city_code: number;
        county: string;
        insurance_branch: string;
        phone: number;
        province: number;
      }>
    ) {
      state.userInfo.address = action.payload.address;
      state.userInfo.agency_type = action.payload.agency_type;
      state.userInfo.agent_code = action.payload.city_code;
      state.userInfo.county = action.payload.county;
      state.userInfo.insurance_branch = action.payload.insurance_branch;
      state.userInfo.phone = action.payload.phone;
      state.userInfo.province = action.payload.province;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendOtp.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload.message || "Failed to send OTP";
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(verifyOtp.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload.message || "OTP verification failed";
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload.message || "Login failed";
      });
  },
});

export const { setPhoneNumber, setOtp, setName, setAgencyData } =
  authSlice.actions;

export default authSlice.reducer;
