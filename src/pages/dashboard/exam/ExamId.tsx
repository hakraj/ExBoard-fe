import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { questionSchema } from "@/lib/zodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Download, Timer, Presentation, ChevronDown, ChevronUp, PlusCircle, Edit, Save, Loader2, Plus, } from "lucide-react"
import { useEffect, useState } from "react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/AuthProvider"
import { Exam, Question, changeMinToHour } from "./Exam"
import { useParams } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import axios, { AxiosResponse, AxiosError } from "axios"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"



const Question = ({ exam, fetchExam, question, index }: { index: number, exam?: Exam, question: Question, fetchExam: () => Promise<void> }) => {
  const [dropdown, setDropdown] = useState<Boolean>(true);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {index + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex ">
          <div className="flex flex-col flex-1">
            <div>
              {question.text}
            </div>
            {dropdown &&
              <div>
                <RadioGroup value={question.answer}>
                  {
                    question.options.map((option, index) => {
                      if (option !== "") {
                        return (
                          <div key={index} className="flex items-center space-x-2" >
                            <RadioGroupItem disabled value={option} id={`option${index + 1}`} />
                            <Label htmlFor={`option${index + 1}`} >{option}</Label>
                          </div>
                        )
                      }
                    })
                  }
                </RadioGroup>
              </div>
            }
          </div>
          <div>
            {dropdown ?
              <ChevronUp className=" cursor-pointer" onClick={() => setDropdown(false)} /> :
              <ChevronDown className=" cursor-pointer" onClick={() => setDropdown(true)} />
            }
          </div>
        </div>
      </CardContent>
      {dropdown &&
        <CardFooter className="justify-between items-center">
          <DeleteQuestion index={index} exam={exam} question={question} fetchExam={fetchExam} />
          <UpdateQuestion exam={exam} question={question} fetchExam={fetchExam} />
        </CardFooter>
      }
    </Card>

  )
}

const CreateQuestion = ({ exam, fetchExam }: { exam?: Exam, fetchExam: () => Promise<void> }) => {
  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "# "
    }
  })

  const { user } = useAuth();

  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const createQuestionHandler = async (data: z.infer<typeof questionSchema>) => {
    setIsLoading(true)

    // API logic
    try {
      await axios.post(`http://localhost:3000/exam/${exam?._id}/questions/`, {
        text: data.text,
        options: [data.option1, data.option2, data.option3, data.option4],
        answer: data.answer,
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: Question[],
        }>) => {
          console.log(response);
          //create a toast message feedback 
          if (response.data?.success) {
            toast({
              title: "Question created successfully",
              description: response?.data?.message
            })

            form.reset({
              text: "",
              option1: "",
              option2: "",
              option3: "",
              option4: "",
              answer: "#"
            })

            setOpen(false)
            fetchExam()
          } else {
            toast({
              variant: "destructive",
              title: "Failed to create new question!",
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
        <Button size={'lg'} variant={'secondary'} >
          <PlusCircle />
          Add New Question
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Add a new Exam</DialogTitle>
          <DialogDescription>Fill in the details of the new question.</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(createQuestionHandler)} className="space-y-8">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'answer'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose the correct option</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                        <FormItem>
                          <div className="flex items-center space-x-2" >
                            <FormControl>
                              <RadioGroupItem value={form.getValues('option1')} />
                            </FormControl>
                            <FormControl>
                              <FormField
                                control={form.control}
                                name={'option1'}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Option 1</FormLabel>
                                    <FormControl>
                                      <Input placeholder={`Enter option 1`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                        <FormItem>
                          <div className="flex items-center space-x-2" >
                            <FormControl>
                              <RadioGroupItem value={form.getValues('option2')} />
                            </FormControl>
                            <FormControl>
                              <FormField
                                control={form.control}
                                name={'option2'}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Option 2</FormLabel>
                                    <FormControl>
                                      <Input placeholder={`Enter option 2`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                        <FormItem>
                          <div className="flex items-center space-x-2" >
                            <FormControl>
                              <RadioGroupItem value={form.getValues('option3')} />
                            </FormControl>
                            <FormControl>
                              <FormField
                                control={form.control}
                                name={'option3'}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Option 3</FormLabel>
                                    <FormControl>
                                      <Input placeholder={`Enter option 3`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                        <FormItem>
                          <div className="flex items-center space-x-2" >
                            <FormControl>
                              <RadioGroupItem value={form.getValues('option4')} />
                            </FormControl>
                            <FormControl>
                              <FormField
                                control={form.control}
                                name={'option4'}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Option 4</FormLabel>
                                    <FormControl>
                                      <Input placeholder={`Enter option 4`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      </RadioGroup>
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
                    Add Question
                  </Button>}
              </DialogFooter>

            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const UpdateQuestion = ({ exam, question, fetchExam }: { exam?: Exam, question: Question, fetchExam: () => Promise<void> }) => {
  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: question.text,
      option1: question.options[0],
      option2: question.options[1],
      option3: question.options[2],
      option4: question.options[3],
      answer: question.answer
    }
  })

  const { user } = useAuth();

  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const updateQuestionHandler = async (data: z.infer<typeof questionSchema>) => {
    setIsLoading(true)

    // API logic
    try {
      await axios.put(`http://localhost:3000/exam/${exam?._id}/questions/update/${question._id}`, {
        text: data.text,
        options: [data.option1, data.option2, data.option3, data.option4],
        answer: data.answer,
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: Question[],
        }>) => {
          console.log(response);
          //create a toast message feedback 
          if (response.data?.success) {
            toast({
              title: "Question updated successfully",
              description: response?.data?.message
            })

            setOpen(false)
            fetchExam()
          } else {
            toast({
              variant: "destructive",
              title: "Failed to update question!",
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
        <Button variant={'secondary'}>
          <Edit className="size-5" />
          Update question
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Update Question</DialogTitle>
          <DialogDescription>Fill in the updated details of the question.</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(updateQuestionHandler)} className="space-y-8">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'answer'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose the correct option</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                        <FormItem>
                          <div className="flex items-center space-x-2" >
                            <FormControl>
                              <RadioGroupItem value={form.getValues('option1')} />
                            </FormControl>
                            <FormControl>
                              <FormField
                                control={form.control}
                                name={'option1'}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Option 1</FormLabel>
                                    <FormControl>
                                      <Input placeholder={`Enter option 1`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                        <FormItem>
                          <div className="flex items-center space-x-2" >
                            <FormControl>
                              <RadioGroupItem value={form.getValues('option2')} />
                            </FormControl>
                            <FormControl>
                              <FormField
                                control={form.control}
                                name={'option2'}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Option 2</FormLabel>
                                    <FormControl>
                                      <Input placeholder={`Enter option 2`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                        <FormItem>
                          <div className="flex items-center space-x-2" >
                            <FormControl>
                              <RadioGroupItem value={form.getValues('option3')} />
                            </FormControl>
                            <FormControl>
                              <FormField
                                control={form.control}
                                name={'option3'}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Option 3</FormLabel>
                                    <FormControl>
                                      <Input placeholder={`Enter option 3`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                        <FormItem>
                          <div className="flex items-center space-x-2" >
                            <FormControl>
                              <RadioGroupItem value={form.getValues('option4')} />
                            </FormControl>
                            <FormControl>
                              <FormField
                                control={form.control}
                                name={'option4'}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Option 4</FormLabel>
                                    <FormControl>
                                      <Input placeholder={`Enter option 4`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      </RadioGroup>
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
                    Update Question
                  </Button>}
              </DialogFooter>

            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const DeleteQuestion = ({ index, exam, question, fetchExam }: { index: number, exam?: Exam, question: Question, fetchExam: () => Promise<void> }) => {
  const { user } = useAuth();

  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);


  const deleteQuestionHandler = async () => {
    setIsLoading(true)

    //API logic
    try {
      await axios.delete(`http://localhost:3000/exam/${exam?._id}/questions/delete/${question._id}`, {
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
              title: "Question deleted successfully",
              description: response?.data?.message
            })

            setOpen(false)
            fetchExam()
          } else {
            toast({
              variant: "destructive",
              title: "Failed to delete question!",
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
        <Button size={'sm'} variant={'destructive'}>Delete</Button>
      </DialogTrigger>
      <DialogContent className="border-red-400">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This will permanently delete <strong>Question {index + 1}</strong>. This action cannot be undone.</DialogDescription>
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
            <Button type="button" onClick={() => deleteQuestionHandler()} variant={'destructive'}>Delete</Button>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

const ExamId = () => {
  const { user } = useAuth();
  const { exam_id } = useParams()
  const { toast } = useToast()

  const [exam, setExam] = useState<Exam>()

  const [questions, setQuestions] = useState<Question[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [fetching, setFetching] = useState<boolean>(true);

  const publishExam = async () => {
    setIsLoading(true)

    // API logic
    try {
      await axios.put(`http://localhost:3000/exam/update/${exam?._id}`, { is_published: true }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: Exam,
        }>) => {
          console.log(response);
          //create a toast message feedback 
          if (response.data?.success) {
            toast({
              title: "Exam published successfully",
              description: response?.data?.message
            })


            fetchExam()
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



  const fetchExam = async () => {
    try {
      await axios.get(`http://localhost:3000/exam/${exam_id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: Exam
        }>) => {
          //create a toast message feedback 
          if (response.data?.success) {
            const fetchedExam = response.data?.data;
            console.log(fetchedExam)
            setExam(fetchedExam)
            setQuestions(fetchedExam.questions)
          } else {
            toast({
              variant: "destructive",
              title: "Failed to fetch exam!",
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
    fetchExam()


    return () => {
      setFetching(false)
    }
  }, [])


  const { hours, mins } = changeMinToHour(exam?.time_limit as number)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-wide">{exam?.title}</h2>
          <div className="flex max-md:flex-col items-center m-1 md:space-x-2">
            <div className="inline-flex items-center">
              <Presentation className=" size-4 mr-1" />
              <span className="text-sm ">
                Mr. {exam?.created_by.name}
              </span>
            </div>
            <div className="inline-flex items-center max-md:self-start">
              <Timer className=" size-4 mr-1" />
              <span className="text-sm">
                {hours > 0 ? `${hours}hours ${mins}mins` : `${mins} mins`}
              </span>
            </div>
          </div>
        </div>
        <Button disabled>
          <Download />
          Attendance
        </Button>
      </div>
      <div className="p-2 md:p-4 md:w-3/4">
        <p className=" font-light text-lg tracking-tight leading-normal">{exam?.description}</p>
        <p className="mt-2 font-medium">50 Questions</p>
      </div>
      <div className="p-2 md:p-4 flex flex-col space-y-2">
        {questions.map((question, index) => {
          return <Question key={question._id}
            index={index} question={question}
            exam={exam} fetchExam={fetchExam} />
        })
        }
      </div>
      <div className=" text-center my-4">
        <CreateQuestion exam={exam} fetchExam={fetchExam} />
        <hr className="my-2 mb-4" />
        {isLoading ?
          <Button disabled size={'lg'} className="text-lg cursor-progress">
            <Loader2 className="animate-spin" />
            Please wait
          </Button> :
          <Button className="text-lg" size={'lg'}>
            <Save />
            Publish Exam
          </Button>
        }
      </div>
    </div>
  )
}

export default ExamId