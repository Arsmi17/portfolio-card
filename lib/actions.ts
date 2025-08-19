"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function verifyOTP(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const otp = formData.get("token")

  if (!otp) {
    return { error: "Verification code is required" }
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otp.toString(),
      }),
    })

    if (!response.ok) {
      const result = await response.json()
      return { error: result.error || "Failed to verify OTP" }
    }
  } catch (error) {
    // This will catch network errors or issues with the fetch itself.
    console.error("OTP verification error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }

  // Redirect is called outside the try...catch block.
  // This is the correct pattern for using redirect in a Server Action.
  redirect("/admin")
}

export async function signOut() {
  const cookieStore = cookies()
  cookieStore.delete("admin_session")
  redirect("/auth/login")
}
