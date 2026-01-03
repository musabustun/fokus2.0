'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState, Suspense } from "react"
import { resendVerificationEmail } from "../actions"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState('')

  const handleResend = async () => {
    setIsResending(true)
    setMessage('')
    
    const result = await resendVerificationEmail(email)
    
    if (result?.error) {
      setMessage(result.error)
    } else {
      setMessage('Verification email sent! Check your inbox.')
    }
    
    setIsResending(false)
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Check Your Email
        </CardTitle>
        <CardDescription className="text-base">
          We&apos;ve sent a verification link to
          <br />
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account and start tracking your YKS progress.
          </p>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or click below to resend.
          </p>
        </div>

        {message && (
          <div className={`text-sm p-3 rounded-md ${message.includes('error') || message.includes('Error') ? 'bg-destructive/15 text-destructive' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
            {message}
          </div>
        )}

        <div className="space-y-3">
          <Button 
            onClick={handleResend} 
            variant="outline" 
            className="w-full"
            disabled={isResending}
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Verification Email
              </>
            )}
          </Button>
          
          <Link href="/login" className="block">
            <Button variant="ghost" className="w-full text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingFallback() {
  return (
    <Card className="w-full max-w-md shadow-xl border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Loading...
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Suspense fallback={<LoadingFallback />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}

