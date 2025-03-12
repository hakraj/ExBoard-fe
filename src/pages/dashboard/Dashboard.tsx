import { useAuth } from "@/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import ExamChart from "./analytics/ExamChart";
import ResultMetrics from "./analytics/ResultMetrics";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate()

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
                <h3 className='text-xl font-bold'>10</h3>
              </CardHeader>
              <CardFooter>Total users</CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <h3 className='text-xl font-bold'>2</h3>
              </CardHeader>
              <CardFooter>Educators</CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <h3 className='text-xl font-bold'>8</h3>
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
                <h3 className='text-xl font-bold'>10</h3>
              </CardHeader>
              <CardFooter>Total exams</CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <h3 className='text-xl font-bold'>2</h3>
              </CardHeader>
              <CardFooter>published</CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <h3 className='text-xl font-bold'>8</h3>
              </CardHeader>
              <CardFooter>upcoming</CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <ExamChart />
        <ResultMetrics />
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
              <h3 className='text-xl font-bold'>50%</h3>
            </CardHeader>
            <CardFooter>Score</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <h3 className='text-xl font-bold'>10</h3>
            </CardHeader>
            <CardFooter>Attempts per exam</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <h3 className='text-xl font-bold'>30 mins</h3>
            </CardHeader>
            <CardFooter>Completion time</CardFooter>
          </Card>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-wide m-1">Notification Logs</h2>
        <hr />
        <div className="leading-none text-center text-muted-foreground">
          New Notifications will appear here
        </div>
      </div>
    </div>
  )
}

export default Dashboard