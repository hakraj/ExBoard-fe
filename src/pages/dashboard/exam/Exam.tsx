import { useAuth } from "@/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { examSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosResponse, AxiosError } from "axios";
import { ClipboardEdit, Edit, Loader2, Plus, Timer, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";


// types
export interface IExam {
  _id: string
  title: string,
  description?: string,
  time_limit: number,
  is_published: boolean,
  created_by: {
    _id: string,
    name: string
  },
  questions: IQuestion[]
}

export interface IQuestion {
  _id: string,
  text: string,
  options: string[],
  answer: string,
}

// helpers
export const changeMinToHour = (totalMin: number) => {
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;

  return { hours, mins }
}



const CreatExam = ({ fetchExams }: { fetchExams: () => Promise<void> }) => {
  // define create form
  const form = useForm<z.infer<typeof examSchema>>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      description: "",
      time_limit: 5,
    }
  })

  const { user } = useAuth();

  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);


  const createExamHandler = async (data: z.infer<typeof examSchema>) => {
    setIsLoading(true)

    // API logic
    try {
      await axios.post('https://ex-board.vercel.app/exam/', data, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: IExam,
        }>) => {
          console.log(response);
          //create a toast message feedback 
          if (response.data?.success) {
            toast({
              title: "Exam created successfully",
              description: response?.data?.message
            })

            form.reset({
              title: "",
              description: "",
              time_limit: 5,
            })

            setOpen(false)
            fetchExams()
          } else {
            toast({
              variant: "destructive",
              title: "Failed to create new exam!",
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
        <Button>
          <Plus />
          Create Exam
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Create a new Exam</DialogTitle>
          <DialogDescription>Fill in the details of the new examination.</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(createExamHandler)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your exam title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your exam description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex">
                        Exam Time
                        <Timer className="size-4 ml-1" />
                      </div>
                      (in minutes)
                    </FormLabel>
                    <FormControl>
                      <Input type={'number'}  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                {isLoading ?
                  <Button disabled className=" cursor-progress">
                    <Loader2 className="animate-spin" />
                    Please wait
                  </Button> :
                  <Button type="submit">
                    <Plus />
                    Create Exam
                  </Button>}
              </DialogFooter>

            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const UpdateExam = ({ exam, fetchExams }: { exam: IExam, fetchExams: () => Promise<void> }) => {
  // define update form
  const form = useForm<z.infer<typeof examSchema>>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: exam.title || "",
      description: exam.description || "",
      time_limit: exam.time_limit || 5,
    }
  })

  const { user } = useAuth();

  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const updateExamHandler = async (data: z.infer<typeof examSchema>) => {
    setIsLoading(true)

    // API logic
    try {
      await axios.put(`https://ex-board.vercel.app/exam/update/${exam._id}`, data, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: IExam,
        }>) => {
          console.log(response);
          //create a toast message feedback 
          if (response.data?.success) {
            toast({
              title: "Exam updated successfully",
              description: response?.data?.message
            })

            form.reset({
              title: exam.title || "",
              description: exam.description || "",
              time_limit: exam.time_limit || 5,
            })

            setOpen(false)
            fetchExams()
            // navigate('/dashboard')
          } else {
            toast({
              variant: "destructive",
              title: "Failed to update exam!",
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
        <Button size={'sm'} variant={'secondary'} >
          <Edit className="size-5" />
          Update
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Update Exam</DialogTitle>
          <DialogDescription>Enter the new details of the examination.</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(updateExamHandler)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your exam title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your exam description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex">
                        Exam Time
                        <Timer className="size-4 ml-1" />
                      </div>
                      (in minutes)
                    </FormLabel>
                    <FormControl>
                      <Input type={'number'} {...field} />
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
                    Update Exam
                  </Button>}
              </DialogFooter>

            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const DeleteExam = ({ exam, fetchExams }: { exam: IExam, fetchExams: () => Promise<void> }) => {
  const { user } = useAuth();

  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);


  const deleteExamHandler = async () => {
    setIsLoading(true)

    //API logic
    try {
      await axios.delete(`https://ex-board.vercel.app/exam/delete/${exam._id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          // data: Exam,
        }>) => {
          console.log(response);
          //create a toast message feedback 
          if (response.data?.success) {
            toast({
              title: "Exam deleted successfully",
              description: response?.data?.message
            })

            setOpen(false)
            fetchExams()
            // navigate('/dashboard')
          } else {
            toast({
              variant: "destructive",
              title: "Failed to delete exam!",
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
        <Trash2 className="size-5 text-red-400 " />
      </DialogTrigger>
      <DialogContent className="border-red-400">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This will permanently delete <strong>{exam.title}</strong> Exam. This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={'outline'}>Cancel</Button>
          </DialogClose>
          {isLoading ?
            <Button disabled className="cursor-progress" variant={'destructive'}>
              <Loader2 className="animate-spin" />
              Deleting
            </Button> :
            <Button type="button" onClick={() => deleteExamHandler()} variant={'destructive'}>Delete</Button>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


const Exam = () => {
  const { user } = useAuth();

  const [exams, setExams] = useState<IExam[]>([])

  const navigate = useNavigate()
  const { toast } = useToast()

  // const [fetching, setFetching] = useState<boolean>(true);

  const fetchExams = async () => {
    try {
      await axios.get('https://ex-board.vercel.app/exam/all/exams', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: IExam[]
        }>) => {
          //create a toast message feedback 
          if (response.data?.success) {
            const fetchedExams = response.data?.data
            setExams(fetchedExams)
          } else {
            toast({
              variant: "destructive",
              title: "Failed to fetch exams!",
              description: response?.data?.message
            })
          }
        }).catch((err: AxiosError<{ message: string }>) => {
          console.error(err)
          return toast({
            variant: "destructive",
            title: "Request Error!",
            description: err.response?.data?.message
          })
        })

    } catch (error) {
      console.error('Caught an error: ', error)
    }

  }

  useEffect(() => {
    fetchExams()


    return () => {
      // setFetching(false)
    }
  }, [])


  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-wide">Exams</h2>
        {user.role == "admin" && <CreatExam fetchExams={fetchExams} />}
      </div>
      <div className="flex max-md:flex-col items-center md:justify-between p-2 md:p-4 mt-4">
        <div className="max-md:self-start">
          <p className="font-light text-lg tracking-tight leading-normal">A list of all available exams</p>
        </div>
        <div className="inline-flex max-md:self-end items-center space-x-2 max-md:mt-4 m-1">
          <Select>
            <SelectTrigger>
              <SelectValue defaultValue="latest" placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="publish">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>
      <div className="p-2 md:p-4">
        {user.role == "admin" ?
          <Table>
            <TableCaption>A list of available exams</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Time limit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam, index) => {
                const { hours, mins } = changeMinToHour(exam.time_limit)
                return (
                  <TableRow key={index}>
                    <Link to={`/dashboard/exam/${exam._id}`}>
                      <TableCell className="font-semibold">{exam.title}</TableCell>
                    </Link>
                    <TableCell>{exam.questions.length}</TableCell>
                    <TableCell>{exam.created_by.name}</TableCell>
                    <TableCell>{hours > 0 ? `${hours}hours ${mins}mins` : `${mins} mins`}</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center space-x-1">
                        <UpdateExam exam={exam} fetchExams={fetchExams} />
                        <DeleteExam exam={exam} fetchExams={fetchExams} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          :
          <div className="grid sm:grid-cols-2 lg:grid-cols-3  xl:data-[state=open]:grid-cols-3 gap-4">
            {exams.map((exam, index) => {
              const { hours, mins } = changeMinToHour(exam.time_limit)

              if (exam.is_published) {
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{exam.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{exam.description ? exam.description.substring(0, 128) : " "}</p>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <div className="inline-flex items-center max-md:self-start">
                        <Timer className=" size-4 mr-1" />
                        <span className="text-sm">
                          {hours > 0 ? `${hours}hours ${mins}mins` : `${mins} mins`}
                        </span>
                      </div>
                      <Button onClick={() => navigate(`/student-exam/start/${exam._id}`)} size={'sm'}>
                        <ClipboardEdit />
                        Take Exam
                      </Button>
                    </CardFooter>
                  </Card>
                )
              }
            })}
          </div>
        }
      </div>
    </div >
  )
}


export default Exam;