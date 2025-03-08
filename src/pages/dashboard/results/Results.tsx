import { useAuth } from '@/AuthProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from '@/hooks/use-toast';
import { IStudentExam } from '@/pages/student-exam/StudentExam';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Trash2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react'


const DeleteResult = ({ result, fecthResults }: { result: IStudentExam, fecthResults: () => Promise<void> }) => {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);


  const deleteExamHandler = async () => {
    setIsLoading(true)

    //API logic
    try {
      await axios.delete(`http://localhost:3000/student-exam/${result._id}/delete`, {
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
            fecthResults()
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
          <DialogDescription>This will permanently delete
            {/* <strong>{result.student_id.name}'s{result.exam_id.title}</strong> Exam.  */}
            This action cannot be undone.</DialogDescription>
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


const Results = () => {
  const { user } = useAuth();

  const [results, setResults] = useState<IStudentExam[]>([])
  const [stdResults, setStdResults] = useState<IStudentExam[]>([])
  // const [fetching, setFetching] = useState<boolean>(true);


  const fecthResults = async () => {
    // All records
    try {
      await axios.get('http://localhost:3000/student-exam/all/record', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: IStudentExam[]
        }>) => {
          //create a toast message feedback 
          if (response.data?.success) {
            const fetchedUsers = response.data?.data
            setResults(fetchedUsers)

          } else {
            toast({
              variant: "destructive",
              title: "Failed to fetch students!",
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

    // Individual record
    try {
      await axios.get(`http://localhost:3000/student-exam/id`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: IStudentExam[]
        }>) => {
          //create a toast message feedback 
          if (response.data?.success) {
            const fetchedUsers = response.data?.data
            setStdResults(fetchedUsers)

          } else {
            toast({
              variant: "destructive",
              title: "Failed to fetch students!",
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
    fecthResults()

    return () => {
      // setFetching(false)
    }
  }, [])
  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold tracking-wide">Results</h2>
      </div>

      <div className='p-2 md:p-4 my-5'>
        <h3 className='text-xl font-bold'>Student Exams</h3>
        {user.role == "admin" ?
          <Table>
            <TableCaption>A list of student's exam</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Registration No</TableHead>
                <TableHead>Examination</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length > 0 && results.map((result, index) => {
                if (result.completed_at) {
                  return (
                    <TableRow key={result._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell width={'240px'} className="font-semibold">{result.student_id.name}</TableCell>
                      <TableCell>{result.student_id.reg_no}</TableCell>
                      <TableCell>{result.exam_id.title}</TableCell>
                      <TableCell>{result.score}</TableCell>
                      <TableCell>
                        <DeleteResult result={result} fecthResults={fecthResults} />
                      </TableCell>
                    </TableRow>
                  )
                }
              })}
            </TableBody>
          </Table>
          :
          <Table>
            <TableCaption>A list of student's exam</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Examination</TableHead>
                <TableHead>Registration No</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stdResults.length > 0 && stdResults.map((result, index) => {
                if (result.completed_at) {
                  return (
                    <TableRow key={result._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell width={'240px'} className="font-semibold">{result.exam_id.title}</TableCell>
                      <TableCell>{result.student_id.reg_no}</TableCell>
                      <TableCell>{result.score}</TableCell>
                      <TableCell>{(result.score / result.exam_id.questions.length) * 100}%</TableCell>
                    </TableRow>
                  )
                }
              })}
            </TableBody>
          </Table>
        }
      </div>


    </div>
  )
}

export default Results