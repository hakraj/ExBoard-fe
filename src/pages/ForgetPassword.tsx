import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { forgetPasswordSchema } from "@/lib/zodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosResponse, AxiosError } from "axios"
import { BookOpen, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"


const ForgetPassword = () => {
  // define form
  const form = useForm<z.infer<typeof forgetPasswordSchema>>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      reg_no: "",
      email: "",
    }
  })

  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetHandler = (data: z.infer<typeof forgetPasswordSchema>) => {
    setIsLoading(true)

    try {
      axios.post('http://localhost:3000/auth/forgot-password', data)
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
        }>) => {
          console.log(response);

          //create a toast message feedback 
          if (response.data?.success) {
            toast({
              title: "Login successfully",
              description: response?.data?.message
            })

            // form.formState.isSubmitSuccessful
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
            title: "Something went wrong. Try again!",
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
      {
        // form.formState.isSubmitSuccessful ?
        false ?
          < Card >
            <CardHeader>
              <div className="flex items-center justify-center space-x-1">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BookOpen className="size-4" />
                </div>
                <div className="text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ExBoard</span>
                </div>
              </div>
              <CardTitle className="text-2xl">Check your mail</CardTitle>

            </CardHeader>
            <CardContent>
              <p>A verification link has been sent to {form.getValues('email')}. Access the link to proceed to reset your password</p>
            </CardContent>
          </Card>
          :
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
              <CardDescription>Enter your details below to reset your password</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(resetHandler)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="reg_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration No</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g 25/STD001" {...field} />
                        </FormControl>
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
      }
    </div >
  )
}

export default ForgetPassword