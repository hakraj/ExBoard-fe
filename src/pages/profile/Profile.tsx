import { useState } from 'react'
import { IUser } from '../dashboard/users/Users';
import { useAuth } from '@/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { BookOpen, Edit, Loader2, Plus } from 'lucide-react';
import { DialogHeader, DialogFooter, DialogContent, Dialog, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateSchema } from '@/lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UpdateProfile = () => {
  const { user, login } = useAuth();
  const { toast } = useToast()

  // define update form
  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    }
  })

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const updateProfileHandler = async (data: z.infer<typeof updateSchema>) => {
    setIsLoading(true)

    // API logic
    try {
      await axios.put(`https://ex-board.vercel.app/auth/update/${user._id}`, data, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: IUser,
        }>) => {
          //create a toast message feedback 
          if (response.data?.success) {
            toast({
              title: "User updated successfully",
              description: response?.data?.message
            })

            form.reset({
              name: user.name || "",
              email: user.email || "",
            })

            login({
              _id: response?.data?.data._id,
              name: response?.data?.data.name,
              email: response?.data?.data.email,
              reg_no: response?.data?.data.reg_no,
              role: response?.data?.data.role,
              token: user.token,
            })

            setOpen(false)
            // navigate('/dashboard')
          } else {
            toast({
              variant: "destructive",
              title: "Failed to update profile!",
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
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'default'} >
          <Edit className="size-4" />
          Update Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-center space-x-1">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <BookOpen className="size-4" />
            </div>
            <div className="text-left text-sm leading-tight">
              <span className="truncate font-semibold">ExBoard</span>
            </div>
          </div>
          <DialogTitle className="text-2xl">Update Profile</DialogTitle>
          <DialogDescription>Enter your details below to update your account.</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(updateProfileHandler)} className="space-y-8">
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

              <DialogFooter>
                {isLoading ?
                  <Button disabled className="cursor-progress">
                    <Loader2 className="animate-spin" />
                    Please wait
                  </Button> :
                  <Button type="submit">
                    <Plus />
                    Update Profile
                  </Button>}
              </DialogFooter>

            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}



const Profile = () => {
  const { user } = useAuth();

  return (
    <div className='space-y-5'>
      <div>
        <h2 className="text-2xl font-semibold tracking-wide">Profile</h2>
      </div>
      <div className='bg-accent rounded-xl p-4'>
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
            <AvatarFallback className="rounded-lg">EB</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.reg_no}</span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-6 my-6'>
          <div>
            <p className='text-sm font-medium'>Name</p>
            <p>{user.name}</p>
          </div>
          <div>
            <p className='text-sm font-medium'>Email</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className='text-sm font-medium'>Role</p>
            <p>{user.role}</p>
          </div>
        </div>

        <UpdateProfile />
      </div>
    </div>
  )
}

export default Profile