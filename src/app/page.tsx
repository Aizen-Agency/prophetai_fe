"use client";

import { useLogin } from "@/context/LoginContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isLoggedIn } = useLogin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/register");
    } else {
      // If logged in, you can navigate to any page the user needs access to
      // For example, you could redirect to a dashboard or home page
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  return null;
}
