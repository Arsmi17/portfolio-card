"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { verifyOTP } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full py-6 text-lg font-medium rounded-lg h-[60px]">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying...
        </>
      ) : (
        <>
          <Shield className="mr-2 h-4 w-4" />
          Verify Code
        </>
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [verifyState, verifyAction] = useActionState(verifyOTP, null)

  // Handle successful verification
  useEffect(() => {
    if (verifyState?.success) {
      router.push("/admin")
    }
  }, [verifyState, router])

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Verify Your Identity
        </h1>
        <p className="text-lg text-muted-foreground">
          Enter the 6-digit code to continue
        </p>
      </div>

      <form action={verifyAction} className="space-y-6">
        {verifyState?.error && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded">
            {verifyState.error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="token" className="block text-sm font-medium">
              Verification Code
            </label>
            <Input
              id="token"
              name="token"
              type="text"
              placeholder="123456"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              className="bg-background border-border text-center text-2xl tracking-widest"
            />
          </div>
        </div>

        <SubmitButton />
      </form>

      <div className="text-center text-sm text-muted-foreground">
        <p>Secure admin access for Harsh Mistry's portfolio</p>
      </div>
    </div>
  )
}