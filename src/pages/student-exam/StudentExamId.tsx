import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IQuestion } from "../dashboard/exam/Exam";
import { useOutletContext } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { IStudentExam } from './StudentExam'
import { useAuth } from '@/AuthProvider'


const StudentExamId = () => {
  const { user } = useAuth();
  const [questions, exam_id, fetchStudentExam]: [IQuestion[], string, () => Promise<void>] = useOutletContext()

  const [active, setActive] = useState(0)

  const [newResponse, setnewResponse] = useState({
    question_id: "",
    selected_option: "",
  })

  const handleResponse = async () => {
    console.log(newResponse);

    if (newResponse.question_id && newResponse.selected_option) {
      try {
        await axios.put(`https://ex-board.vercel.app/student-exam/${exam_id}/response/${newResponse.question_id}`, newResponse, {
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
              await fetchStudentExam()
            } else {
              toast({
                variant: "destructive",
                title: `Error! Answer Question ${active} again.`,
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
    }

    setnewResponse({
      question_id: "",
      selected_option: "",
    })
  }


  return (
    <>
      <div className='space-y-5 max-h-full overflow-auto'>
        <div>
          <h1 className='text-xl underline'>Question {active + 1}</h1>
          <p className='my-1 text-xl'>{questions[active]?.text}</p>
        </div>
        <div>
          <RadioGroup onValueChange={(value) => setnewResponse({ question_id: questions[active]?._id, selected_option: value })} value={newResponse.selected_option}>
            {questions[active]?.options.map((option, index) => {
              if (option !== "") {
                return (
                  <div key={index} className="flex items-center my-1 space-x-2" >
                    <RadioGroupItem value={option} id={`option${index + 1}`} />
                    <Label className='text-xl' htmlFor={`option${index + 1}`} >{option}</Label>
                  </div>
                )
              }
            })}
          </RadioGroup>
        </div>
      </div>
      <div>
        <div className='flex justify-between px-8'>
          <Button disabled={active <= 0} onClick={() => {
            handleResponse()
            setActive(active - 1)
          }}><ChevronLeft /> Previous</Button>
          <Button disabled={active >= questions.length - 1} onClick={() => {
            handleResponse()
            setActive(active + 1)
          }}>Next <ChevronRight /></Button>
        </div>
        <div className='flex justify-center items-center my-4 gap-1 '>
          {questions.map((_, index) => {
            return (
              <Button key={index} onClick={() => {
                handleResponse()
                setActive(index)
              }} size={'sm'} variant={active === index ? 'default' : 'ghost'}>{index + 1}</Button>
            )
          })}
        </div>
      </div >
    </>
  )
}


export default StudentExamId