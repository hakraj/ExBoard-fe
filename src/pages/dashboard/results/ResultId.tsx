import { useAuth } from '@/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { IResponse, IStudentExam } from '@/pages/student-exam/StudentExam';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { ChevronDown, ChevronUp, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { IQuestion } from '../exam/Exam';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Question = ({ response, question, index }: { index: number, response?: IResponse, question: IQuestion }) => {
  const [dropdown, setDropdown] = useState<boolean>(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {index + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="flex flex-col gap-2 flex-1">
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
                          <div key={index} className={`flex items-center space-x-2 p-1 rounded ${option === response?.selected_option && option === question.answer && 'bg-green-400'} ${option === response?.selected_option && option !== question.answer && 'bg-red-300'}`} >
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
    </Card>

  )
}


const ResultId = () => {
  const { user } = useAuth();
  const { exam_id } = useParams()
  const { toast } = useToast()

  const [result, setResult] = useState<IStudentExam>()

  const fetchResult = async () => {
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
            setResult(fetchedExam)
          } else {
            toast({
              variant: "destructive",
              title: "Failed to fetch result!",
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
    fetchResult()


    return () => {
      // setFetching(false)
    }
  })
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className="text-2xl font-semibold tracking-wide">{result?.student_id?.name}</h2>
          <div className="flex max-md:flex-col items-center m-1 md:space-x-2">
            <div className="inline-flex items-center">
              <User className=" size-4 mr-1" />
              <span className="text-sm ">
                {result?.student_id?.reg_no}
              </span>
            </div>
            <div className="inline-flex items-center max-md:self-start">
              <Mail className=" size-4 mr-1" />
              <span className="text-sm ">
                {result?.student_id?.email}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold tracking-wide">{result?.exam_id && ((result.score / result?.exam_id?.questions.length) * 100)}%</h3>
        </div>
      </div>

      <div className="p-2 md:p-4 md:w-3/4">
        <p className=" text-lg tracking-tight leading-normal font-medium">{result?.exam_id?.title}</p>
        <p className=" font-light mt-2">{result?.exam_id?.questions.length} Questions</p>
      </div>

      <div className="p-2 md:p-4 mb-5 flex flex-col space-y-2 ">
        {result?.exam_id?.questions.map((question, index) => {
          return <Question key={question._id}
            index={index} question={question}
            response={result?.responses.find((r) => r.question_id === question._id)} />
        })
        }
      </div>
    </div>
  )
}

export default ResultId