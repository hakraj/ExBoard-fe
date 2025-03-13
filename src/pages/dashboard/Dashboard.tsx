import { useAuth } from "@/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import ExamChart from "./analytics/ExamChart";
import ResultMetrics from "./analytics/ResultMetrics";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useState, useEffect } from "react";
import { IAnalytics } from "@/lib/types";


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate()
  const { toast } = useToast()

  const [analytics, setAnalytics] = useState<IAnalytics>({
    users: {
      student: 0,
      educator: 0,
    },
    exams: {
      published: 0,
      upcoming: 0,
    },
    examChartdata: [{
      week: 0,
      attempts: 0,
    }],
    successrate: {
      pass: 0,
      average: 0,
      fail: 0,
    },
    averages: {
      averageGrade: 0,
      noOfAttemptsPerExam: 0,
      averageCompletionTime: 0,
    },
  })

  const { users, exams, examChartdata, successrate, averages } = analytics;

  const fetchAnalytics = async () => {
    try {
      await axios.get(`https://ex-board.vercel.app/analytics`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: IAnalytics
        }>) => {
          //create a toast message feedback 
          if (response.data?.success) {
            const fetchedData = response.data?.data;
            setAnalytics(fetchedData)
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
    fetchAnalytics()

    return () => {
      // setFetching(false)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold tracking-wide">Analytics</h1>
        <h2 className="text-xl font-semibold tracking-wide mr-4">Welcome, {user.name}</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-[5%] ">
        <div>
          <div className="flex justify-between m-1">
            <h2 className="text-xl font-semibold tracking-wide">Users</h2>
            <Button onClick={() => navigate('/dashboard/users')} variant={'outline'}>Manage users</Button>
          </div>
          <hr />
          <div className="flex items-center my-4 space-x-4">
            <Card>
              <CardHeader>
                <h3 className='text-xl font-bold'>{users.student + users.educator}</h3>
              </CardHeader>
              <CardFooter>Total users</CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <h3 className='text-xl font-bold'>{users.educator}</h3>
              </CardHeader>
              <CardFooter>Educators</CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <h3 className='text-xl font-bold'>{users.student}</h3>
              </CardHeader>
              <CardFooter>Students</CardFooter>
            </Card>
          </div>
        </div>
        <div>
          <div className="flex justify-between m-1">
            <h2 className="text-xl font-semibold tracking-wide">Exams</h2>
            <Button onClick={() => navigate('/dashboard/exams')} variant={'outline'}>Manage exams</Button>
          </div>
          <hr />
          <div className="flex items-center my-4 space-x-4">
            <Card>
              <CardHeader>
                <h3 className='text-xl font-bold'>{exams.published + exams.upcoming}</h3>
              </CardHeader>
              <CardFooter>Total exams</CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <h3 className='text-xl font-bold'>{exams.published}</h3>
              </CardHeader>
              <CardFooter>published</CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <h3 className='text-xl font-bold'>{exams.upcoming}</h3>
              </CardHeader>
              <CardFooter>upcoming</CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <ExamChart data={examChartdata} />
        <ResultMetrics data={successrate} />
      </div>
      <div>
        <div className="flex justify-between m-1">
          <h2 className="text-xl font-semibold tracking-wide">Results - Average</h2>
          <Button onClick={() => navigate('/dashboard/results')} variant={'outline'}>Manage results</Button>
        </div>
        <hr />
        <div className="flex items-center my-4 space-x-4">
          <Card>
            <CardHeader>
              <h3 className='text-xl font-bold'>{averages.averageGrade}%</h3>
            </CardHeader>
            <CardFooter>Score</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <h3 className='text-xl font-bold'>{Math.ceil(averages.noOfAttemptsPerExam)}</h3>
            </CardHeader>
            <CardFooter>Attempts per exam</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <h3 className='text-xl font-bold'>{averages.averageCompletionTime} mins</h3>
            </CardHeader>
            <CardFooter>Completion time</CardFooter>
          </Card>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-wide m-1">Notification Logs</h2>
        <hr />
        <div className="leading-none text-center text-muted-foreground my-2">
          New Notifications will appear here
        </div>
      </div>
    </div>
  )
}

export default Dashboard