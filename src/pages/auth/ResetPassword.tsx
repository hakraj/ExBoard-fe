import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { resetPasswordSchema } from "@/lib/zodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosResponse, AxiosError } from "axios"
import { BookOpen, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Eye from "@/assets/svg/eye.svg?react";
import EyeSlash from "@/assets/svg/eye-slash.svg?react";
import { useNavigate, useParams } from "react-router-dom"



const ResetPassword = () => {
  // define form
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    }
  })

  const { token } = useParams()
  const { toast } = useToast()

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewPassword, setViewPassword] = useState<boolean>(false);


  const resetHandler = (data: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true)

    try {
      axios.post('https://ex-board.vercel.app/auth/reset-password', { password: data.password }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
        }>) => {
          console.log(response);

          //create a toast message feedback 
          if (response.data?.success) {
            toast({
              title: "Reset Password successfully",
              description: response?.data?.message
            })

            navigate('/login')
          } else {
            toast({
              variant: "destructive",
              title: "Something went wrong. Try again!",
              description: response?.data?.message
            })
          }
        }).catch((err: AxiosError<{ message: string }>) => {
          console.error(err)
          toast({
            variant: "destructive",
            title: "Request error!",
            description: err.response?.data?.message
          })
        })

    } catch (error) {
      console.error('Caught an error: ', error)
    }

    setIsLoading(false)

  }

  return (
    <div className=" flex  min-h-screen items-center justify-center">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center space-x-1 my-1">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <BookOpen className="size-4" />
            </div>
            <div className="text-left text-sm leading-tight">
              <span className="truncate font-semibold">ExBoard</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(resetHandler)} className="space-y-8">
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={viewPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          {...field} />
                        {viewPassword ?
                          <EyeSlash className="size-5 cursor-pointer absolute right-4 top-2" onClick={() => setViewPassword(false)} />
                          :
                          <Eye className="size-5 cursor-pointer absolute right-4 top-2" onClick={() => setViewPassword(true)} />
                        }
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder="Confirm your password"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLoading ?
                <Button disabled className=" cursor-progress">
                  <Loader2 className="animate-spin" />
                  Please wait
                </Button> :
                <Button type="submit">Submit</Button>
              }

            </form>
          </Form>

        </CardContent>
      </Card>

    </div >
  )
}

export default ResetPassword;