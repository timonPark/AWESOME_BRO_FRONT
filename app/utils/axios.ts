import axios from "axios";
export const LOCATOR = {
  backend: process.env.BACKEND_URL
}
export const Get = (url: string, accessToken: string) => {
  console.log(`url`);
  console.log(url)
  return accessToken ? axios.get(url, {
    headers: {Authorization: accessToken}
  }) : axios.get(url);
}

export const Post = (url: string, data: any) => {
  console.log(`url`);
  console.log(url)
  console.log(`data`);
  console.log(data)
  return axios.post(url, data);
}