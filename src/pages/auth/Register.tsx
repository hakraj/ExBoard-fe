import { useForm } from "react-hook-form";
import { registerSchema } from "../../lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";
import Eye from "@/assets/svg/eye.svg?react";
import EyeSlash from "@/assets/svg/eye-slash.svg?react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";


const Register = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      reg_no: "",
      email: "",
      password: "",
      confirm_password: "",
    }
  })

  const { toast } = useToast()
  const navigate = useNavigate()

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormData>({
  //   resolver: zodResolver(registerSchema),
  // });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  const registerHandler = (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true)
    console.log("Form Data:", data);
    // Add your registration API call here

    try {
      axios.post('https://ex-board.vercel.app/auth/register', {
        name: data.name,
        reg_no: data.reg_no,
        email: data.email,
        password: data.confirm_password,
      })
        .then((response) => {
          console.log(response);
          //create a toast message feedback 

          if (response.data?.success) {
            toast({
              title: "Register successfully",
              description: response?.data?.message,
            })
            navigate('/login');
          } else {
            toast({
              variant: "destructive",
              title: "Register Failed!",
              description: response?.data?.message
            })
          }


        }).catch((err: AxiosError<{ message: string }>) => {
          console.error(err)
          toast({
            variant: "destructive",
            title: "Register Failed!",
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
          <div className="flex items-center justify-center space-x-1">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <BookOpen className="size-4" />
            </div>
            <div className="text-left text-sm leading-tight">
              <span className="truncate font-semibold">ExBoard</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(registerHandler)} className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Registration No Field */}
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
                      Student: 25/STD000; Admin: 25/EDU000
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder="e.g name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                <Button type="submit">Register</Button>
              }

              <p className=" text-sm text-center mt-4 mb-2">Already have an account? <span className=" text-indigo-600 hover:text-indigo-700 underline"><a href="/login">Login</a></span></p>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )

  // return (
  //   <>
  //     <div className=" flex  min-h-screen items-center justify-center ">
  //       <div>
  //         <form
  //           onSubmit={}
  //           className="w-full md:min-w-96 max-w-md p-6 bg-white shadow-md rounded-md"
  //         >
  //           <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
  //             Register your account
  //           </h2>

  //           {/* Name Field */}
  //           <div className="mb-4">
  //             <label className="block text-sm font-medium text-gray-700">Name</label>
  //             <input
  //               type="text"
  //               {...register("name")}
  //               className={`mt-1 block w-full px-4 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"
  //                 }`}
  //             />
  //             {errors.name && (
  //               <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
  //             )}
  //           </div>

  //           {/* Email Field */}
  //           <div className="mb-4">
  //             <label className="block text-sm font-medium text-gray-700">Email</label>
  //             <input
  //               type="email"
  //               {...register("email")}
  //               className={`mt-1 block w-full px-4 py-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"
  //                 }`}
  //             />
  //             {errors.email && (
  //               <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
  //             )}
  //           </div>

  //           {/* Registration Number Field */}
  //           <div className="mb-4">
  //             <label className="block text-sm font-medium text-gray-700">
  //               Registration Number
  //             </label>
  //             <input
  //               type="text"
  //               {...register("reg_no")}
  //               className={`mt-1 block w-full px-4 py-2 border rounded-md ${errors.reg_no ? "border-red-500" : "border-gray-300"
  //                 }`}
  //             />
  //             {errors.reg_no && (
  //               <p className="text-sm text-red-500 mt-1">{errors.reg_no.message}</p>
  //             )}
  //           </div>

  //           {/* Password Field */}
  //           <div className="mb-4">
  //             <label className="block text-sm font-medium text-gray-700">
  //               Password
  //             </label>
  //             <input
  //               type="password"
  //               {...register("password")}
  //               className={`mt-1 block w-full px-4 py-2 border rounded-md ${errors.password ? "border-red-500" : "border-gray-300"
  //                 }`}
  //             />
  //             {errors.password && (
  //               <p className="text-sm text-red-500 mt-1">
  //                 {errors.password.message}
  //               </p>
  //             )}
  //           </div>

  //           {/* Confirm Password Field */}
  //           <div className="mb-4">
  //             <label className="block text-sm font-medium text-gray-700">
  //               Confirm Password
  //             </label>
  //             <input
  //               type="password"
  //               {...register("confirm_password")}
  //               className={`mt-1 block w-full px-4 py-2 border rounded-md ${errors.confirm_password ? "border-red-500" : "border-gray-300"
  //                 }`}
  //             />
  //             {errors.confirm_password && (
  //               <p className="text-sm text-red-500 mt-1">
  //                 {errors.confirm_password.message}
  //               </p>
  //             )}
  //           </div>

  //           <p className=" text-sm mt-4 mb-2">Already have an account? <span className=" text-indigo-600 hover:text-indigo-700 underline"><a href="/login">Login</a></span></p>
  //           {/* Submit Button */}
  //           <button
  //             type="submit"
  //             className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
  //           >
  //             {isLoading ?
  //               <div className="w-5 h-5 rounded-full animate-spin border-2 border-solid border-white border-t-transparent shadow-md mx-auto my-1"></div>
  //               : 'Register'}
  //           </button>
  //         </form>
  //       </div>
  //     </div>
  //   </>
  // )
}

export default Register;