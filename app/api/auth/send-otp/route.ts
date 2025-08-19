import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Check if email matches the profile email
    const { data: profile, error: profileError } = await supabase.from("profiles").select("email").single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (profile.email !== email) {
      return NextResponse.json({ error: "Email does not match registered profile" }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // Store OTP in database
    const { error: otpError } = await supabase.from("otp_verifications").insert({
      email,
      otp_code: otpCode,
      expires_at: expiresAt.toISOString(),
    })

    if (otpError) {
      console.error("OTP storage error:", otpError)
      return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 })
    }

    // Send email using a simple email service (you can replace this with your preferred email service)
    try {
      // For now, we'll simulate email sending
      // In production, you would integrate with services like:
      // - Resend, SendGrid, Nodemailer, etc.

      console.log(`[v0] OTP Code for ${email}: ${otpCode}`) // For development

      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return NextResponse.json({
        success: true,
        message: "OTP sent to your email address",
      })
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
