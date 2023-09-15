export type ApiResponse<T> = {
  success: boolean,
  data: T,
  message: string | null,
  type: "success",
}

export type ApiErrorType = {
  success: boolean,
  errorCode: number,
  message: string,
  type: "fail",
}