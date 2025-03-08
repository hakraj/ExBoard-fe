import { useForm } from "react-hook-form";
import { loginSchema } from "../../lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen, Loader2 } from "lucide-react";
import Eye from "@/assets/svg/eye.svg?react";
import EyeSlash from "@/assets/svg/eye-slash.svg?react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/AuthProvider";



const Login = () => {
  // define login form
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      reg_no: "",
      password: "",
    }
  })

  const { login, setAuthenticated } = useAuth();
  const navigate = useNavigate()
  const { toast } = useToast()

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormData>({
  //   resolver: zodResolver(loginSchema),
  // });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  // define login form handler
  const loginHandler = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true)

    // Login API call here
    try {
      await axios.post('https://ex-board.vercel.app/auth/login', data)
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          user: {
            name: string,
            reg_no: string,
            email: string,
            role: string,
            token: string,
          }
        }>) => {
          console.log(response);
          //create a toast message feedback 
          if (response.data?.success) {
            toast({
              title: "Login successfully",
              description: response?.data?.message
            })

            login({
              name: response?.data?.user.name,
              reg_no: response?.data?.user.reg_no,
              role: response?.data?.user.role,
              token: response?.data?.user.token
            })

            setAuthenticated(true)

            navigate('/dashboard/home')
          } else {
            toast({
              variant: "destructive",
              title: "Login Failed!",
              description: response?.data?.message
            })
          }
        }).catch((err: AxiosError<{ message: string }>) => {
          console.error(err)
          toast({
            variant: "destructive",
            title: "Login Failed!",
            description: err.response?.data?.message
          })
        })

    } catch (error) {
      console.error('Caught an error: ', error)
    }

    setIsLoading(false)
  };


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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your details below to login your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(loginHandler)} className="space-y-8">
              <FormField
                control={form.control}
                name="reg_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration No</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g 25/STD001" {...field} />
                    </FormControl>
                    <FormDescription>
                      Test Registration no: 25/STD001
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormDescription>
                      Test Password: qwerty
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isLoading ?
                <Button disabled className=" cursor-progress">
                  <Loader2 className="animate-spin" />
                  Please wait
                </Button> :
                <Button type="submit">Login</Button>
              }

              <p className=" text-sm text-center mt-4 mb-2">Don't have an account? <span className=" text-indigo-600 hover:text-indigo-700 underline"><a href="/register">Register</a></span></p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login;