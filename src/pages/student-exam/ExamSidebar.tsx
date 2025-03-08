import { useAuth } from '@/AuthProvider'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { IStudentExam } from './StudentExam'
import { useState, useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@radix-ui/react-dialog'
import { Loader2 } from 'lucide-react'


const ConfirmSubmit = ({ isLoading, timeLeft, handleSubmit }: { isLoading: Boolean, timeLeft: number, handleSubmit: () => Promise<void> }) => {

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <span className="truncate font-semibold">Submit Exam</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>Your examination duration remains <strong>{timeLeft}</strong>!</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={'outline'}>Cancel</Button>
          </DialogClose>
          {isLoading ?
            <Button disabled className="cursor-progress" variant={'default'}>
              <Loader2 className="animate-spin" />
              Submitting
            </Button> :
            <Button type="button" onClick={() => handleSubmit()} variant={'destructive'}>Delete</Button>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


const ExamSidebar = ({ studentExam }: { studentExam?: IStudentExam }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [timeLeft, settimeLeft] = useState<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const startedAt = new Date(studentExam?.started_at as Date).getTime();
    const endTime = startedAt + (studentExam?.exam_id.time_limit as number * 60 * 1000);

    const updateTimer = () => {
      const now = Date.now();
      const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000))
      settimeLeft(remainingTime)

      if (remainingTime === 0) {
        clearInterval(timer)
        handleSubmit()
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [timeLeft, studentExam])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await axios.put(`https://ex-board.vercel.app/student-exam/${studentExam?._id}/complete`, {}, {
        headers: {
          'Authorization': `Bearer ${user.exam_access}`
        }
      })
        .then(async (response: AxiosResponse<{
          success: boolean,
          message: string,
          data: IStudentExam,
        }>) => {
          //create a toast message feedback 
          if (response.data?.success) {
            toast({
              title: "Exam submitted",
              description: response?.data?.message
            })

            navigate('/student-exam/complete')
          } else {
            toast({
              variant: "destructive",
              title: `Error! Failed to submit`,
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
    <Sidebar side='right'>
      <SidebarHeader>
        <div>
          <h3 className='text-3xl font-bold tracking-wide mt-4 text-center'>{formatTime(timeLeft)}</h3>
        </div>
        <ConfirmSubmit isLoading={isLoading} timeLeft={timeLeft} handleSubmit={handleSubmit} />
      </SidebarHeader>
      <SidebarContent>
        <div className='flex flex-1 justify-center items-center text-center text-lg p-4 '>
          <div>
            <p>{studentExam?.exam_id.description}</p>
            <p><b>{studentExam?.responses.length}</b> out of <b>{studentExam?.exam_id.questions.length}</b> questions</p>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col items-center justify-center space-y-1 p-4 mb-8 bg-sidebar-primary/25 rounded-xl">
          <Avatar className="size-12 flex items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
            {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
            <AvatarFallback className="rounded-lg">EB</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-sm text-center leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.reg_no}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>

  )
}

export default ExamSidebar