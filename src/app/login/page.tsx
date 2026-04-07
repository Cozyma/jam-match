"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/supabase/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      const { error } = await signInWithEmail(email, password)
      if (error) {
        setError(error.message)
      } else {
        router.push("/")
      }
    } catch {
      setError("ログインに失敗しました")
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp() {
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      const { data, error } = await signUpWithEmail(email, password)
      if (error) {
        setError(error.message)
      } else if (data.user?.identities?.length === 0) {
        setError("このメールアドレスは既に登録されています")
      } else {
        setMessage(
          "確認メールを送信しました。Mailpit (http://localhost:54324) で確認してください"
        )
      }
    } catch {
      setError("新規登録に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center gap-4 text-center">
          <img src="/icon-192.png" alt="Bluegrass GONG" className="h-16 w-16 rounded-2xl" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bluegrass GONG</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              ブルーグラスジャムセッションを見つけよう
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              placeholder="6文字以上"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSignIn()
              }}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {message && (
            <p className="text-sm text-green-600">{message}</p>
          )}

          <Button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            ログイン
          </Button>
          <Button
            onClick={handleSignUp}
            disabled={loading}
            variant="outline"
            className="w-full"
            size="lg"
          >
            新規登録
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">または</span>
            </div>
          </div>

          <Button
            onClick={() => signInWithGoogle()}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Googleでログイン
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
