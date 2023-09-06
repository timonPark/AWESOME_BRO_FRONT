"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { useRouter } from "next/navigation";

const imageToLoginType = (image: string | undefined | null) => {
  if (!image) {
    return "regular";
  }
  if (image.includes("pstatic.net")) {
    return "naver";
  }
  if (image.includes("kakaocdn.net")) {
    return "kakao";
  }
  return "regular";
};

function SignInButton() {
  const { data: session } = useSession();
  const { push } = useRouter();
  const image = session?.user?.image;
  const loginType = imageToLoginType(image);
  console.log(`session: ${JSON.stringify(session)}`);
  if (session && session.user) {
    return (
      <button
        className="px-12 py-4 border rounded-xl bg-red-300"
        onClick={() => signOut()}
      >
        <div className="float-left">
          {loginType === "regular" ? (
            <></>
          ) : (
            <input
              className="mr-2"
              type="image"
              width={20}
              src={
                loginType === "naver"
                  ? "/icon/naver.png"
                  : loginType === "kakao"
                  ? "/icon/kakao.png"
                  : ""
              }
            ></input>
          )}
        </div>
        {session.user.name}님 Log Out
      </button>
    );
  }
  if (session !== undefined) {
    // 세션이 로딩 중일 때의 상태를 처리합니다
    push("api/auth/signin");
  }
  if (session === undefined) {
    // 세션이 로딩 중일 때의 상태를 처리합니다
    return (
      <button className="px-12 py-4 border rounded-xl bg-gray-300" disabled>
        Loading...
      </button>
    );
  }
  return (
    <button
      className="px-12 py-4 border rounded-xl bg-yellow-300"
      onClick={() => signIn()}
    >
      LogIn
    </button>
  );
}

export default SignInButton;
