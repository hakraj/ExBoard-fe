import { useAuth } from "@/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Loader2 } from "lucide-react";
import Eye from "@/assets/svg/eye.svg?react";
import EyeSlash from "@/assets/svg/eye-slash.svg?react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import axios, { AxiosResponse, AxiosError } from "axios";
import { IStudentExam } from "./StudentExam";


const verifySchema = z.object({
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
}).required()


const StartExam = () => {
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      password: "",
    }
  })

  const { exam_id } = useParams()
  const { user, setUser } = useAuth();
  const navigate = useNavigate()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  // define form handler
  const verifyHandler = async (data: z.infer<typeof verifySchema>) => {
    setIsLoading(true)

    // Login API call here
    try {
      await axios.post(`https://ex-board.vercel.app/student-exam/start/${exam_id}`, data, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          token: string,
          data: IStudentExam,
        }>) => {
          console.log(response);
          //create a toast message feedback 
          if (response.data?.success) {
            toast({
              title: "Exam Commenced",
              description: response?.data?.message
            })

            setUser({
              ...user,
              exam_access: response?.data?.token
            })

            const std_exam_id = response?.data?.data._id
            navigate(`/student-exam/ongoing/${std_exam_id}`)
          } else {
            toast({
              variant: "destructive",
              title: "Failed to commence exam! Try again.",
              description: response?.data?.message
            })
          }
        }).catch((err: AxiosError<{ message: string }>) => {
          console.error(err)
          toast({
            variant: "destructive",
            title: "Request Error!",
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
          <CardTitle className="text-2xl">Start Exam</CardTitle>
          <CardDescription>Re-enter your password to start your examination.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(verifyHandler)} className="space-y-8">
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

              {isLoading ?
                <Button disabled className=" cursor-progress">
                  <Loader2 className="animate-spin" />
                  Please wait
                </Button> :
                <Button type="submit">Start</Button>
              }

            </form>
          </Form>

        </CardContent>
      </Card>
    </div>
  )
}

export default StartExam