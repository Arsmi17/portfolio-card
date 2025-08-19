import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { otp } = await request.json()

    if (!otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Verify OTP from database
    const { data: otpRecord, error: otpError } = await supabase
      .from("otp_codes")
      .select("code")
      .eq("code", otp)
      .limit(1)
      .single()

    if (otpError || !otpRecord) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // Return success message without setting a cookie
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
