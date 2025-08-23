"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function verifyOTP(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" };
  }

  const otp = formData.get("token");

  if (!otp) {
    return { error: "Verification code is required" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otp.toString(),
        }),
      }
    );

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to verify OTP" };
    }

    // If verification is successful, set the cookie here
    cookies().set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }

  redirect("/admin");
}

export async function signOut() {
  cookies().delete("admin_session");
  redirect("/auth/login");
}