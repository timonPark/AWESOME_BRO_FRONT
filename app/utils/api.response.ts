import {ApiErrorType, ApiResponse} from "@/app/types/api/api.response";

export const apiResponseSuccess = <T>(success: true, data: T):ApiResponse<T> => {
  return {
    success, data, message: null
  }
};

export const apiResponseFail =(success: false, errorCode: number, message: string):ApiErrorType => {
  return {
    success, errorCode, message
  }
};