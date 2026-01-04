'use client'

import { useActionState } from 'react'
import { login } from '../actions'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-sm shadow-xl border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">YKS Tracker</CardTitle>
          <CardDescription>
            Paneline giriş yapmak için e-posta adresini gir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
             {state?.error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {state.error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" name="email" type="email" placeholder="m@örnek.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
              {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t pt-4">
          <div className="text-sm text-muted-foreground text-center">
            Hesabın yok mu?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Kayıt ol
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
