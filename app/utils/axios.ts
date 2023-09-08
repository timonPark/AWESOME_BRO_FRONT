import axios from "axios";
export const LOCATOR = {
  backend: process.env.BACKEND_URL
}
export const Post = (url: string, data: any) => {
  console.log(`url`);
  console.log(url)
  console.log(`data`);
  console.log(data)
  return axios.post(url, data);
}