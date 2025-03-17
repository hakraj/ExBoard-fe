import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import ExamSidebar from "./ExamSidebar"
import { Outlet, useParams } from "react-router-dom"
import { useAuth } from "@/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useState, useEffect } from "react";
import { IExam, IQuestion } from "../dashboard/exam/Exam";
import { IUser } from "../dashboard/users/Users";

export interface IResponse {
  _id: string,
  selected_option: string,
  question_id: string,
}

export interface IStudentExam {
  student_id: IUser | null;
  exam_id: IExam | null;
  responses: IResponse[];
  score: number;
  started_at: Date,
  completed_at: Date | null,
  _id: string;
}


const StudentExam = () => {
  const { user } = useAuth();
  const { exam_id } = useParams()
  const { toast } = useToast()

  const [studentExam, setStudentExam] = useState<IStudentExam>()

  const [questions, setQuestions] = useState<IQuestion[] | undefined>([])

  // const [fetching, setFetching] = useState<boolean>(true);


  const fetchStudentExam = async () => {
    try {
      await axios.get(`https://ex-board.vercel.app/student-exam/${exam_id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: IStudentExam
        }>) => {
          //create a toast message feedback 
          if (response.data?.success) {
            const fetchedExam = response.data?.data;
            setStudentExam(fetchedExam)
            setQuestions(fetchedExam?.exam_id?.questions)


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
    fetchStudentExam()

    return () => {
      // setFetching(false)
    }
  }, [])

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex w-[calc(100vw-17rem)] max-md:w-screen justify-between h-16 shrink-0 items-start gap-2 px-6 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <h2 className="text-2xl font-semibold tracking-wide">{studentExam?.exam_id?.title}</h2>

          <SidebarTrigger className="-ml-1 text-red-500 animate-pulse self-center max-md:hidden" />
        </header>
        <div className="flex w-[calc(100vw-17rem)] max-md:w-screen flex-1 flex-col justify-between gap-4 p-6 md:p-12 pt-4 bg-gray-50">
          <Outlet context={[questions, exam_id, fetchStudentExam]} />
        </div>
      </SidebarInset>
      <ExamSidebar studentExam={studentExam} />
    </SidebarProvider>
  )
}

export default StudentExam