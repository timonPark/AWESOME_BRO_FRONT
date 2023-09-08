export type SocialUser = {
  "name" :string,
  "email": string,
  "nickname": string,
  "loginType": "regular" | "naver" | "kakao",
  "socialId": string,
  "profilePicture": string | null
}