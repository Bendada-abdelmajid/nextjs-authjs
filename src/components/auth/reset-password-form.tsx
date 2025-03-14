import React, { Dispatch, SetStateAction, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { CircleCheckBig, Loader, TriangleAlert } from 'lucide-react'
import { LoginSteps } from '@/lib/types'
import { resetPassword } from '@/actions/resset-password'
import { signIn } from 'next-auth/react'

type Props = {
  setActive: Dispatch<SetStateAction<LoginSteps>>;
  email: string;
}

const ResetPasswordForm = ({ setActive, email }: Props) => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {

      const res = await resetPassword({
        password: newPassword,
        confirmPassword, email
      })
      if (res.error) {
        setError(res.error)
        return

      }
      if (res.success) {
        setSuccess(res.success)
        const loginResult = await signIn("credentials", {
          email: email,
          password: newPassword,
          redirectTo: "/",
        });
      }

    } catch {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }

  }
  return (
    <Card className="w-full max-w-sm ">
      <CardHeader className="text-center">
        <CardTitle className="text-xl capitalize font-semibold ">Set new password</CardTitle>
        {success && <div className='bg-green-100 rounded-lg p-3 items-center mt-4 flex gap-4 '>
          <CircleCheckBig className='text-green-500' />
          <div className='text-left'>
            <h4 className='text-xs font-medium'>success</h4>
            <p className='text-xm opacity-70'>{success}</p>
          </div>
        </div>}
        {error && <div className='bg-destructive/5 rounded-lg p-3 items-center mt-4 flex gap-4 '>
          <TriangleAlert className='text-destructive/60' />
          <div className='text-left'>
            <h4 className='text-xs font-medium'>Error</h4>
            <p className='text-xm opacity-70'>{error}</p>
          </div>
        </div>}
      </CardHeader>
      <CardContent>
        <form className='space-y-6 mt-4' onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button className='w-full' disabled={isLoading}>{isLoading ? <Loader className='animate-spin' /> : "Reset Password "}</Button>
        </form>
        {/* <Button variant={"link"} onClick={()=>setActive("login")} className='mx-auto mt-3 flex' disabled={isLoading} >Back</Button> */}
      </CardContent>
    </Card>
  )
}

export default ResetPasswordForm