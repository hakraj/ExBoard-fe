import { useAuth } from "@/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import ExamChart from "./analytics/ExamChart";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold tracking-wide">Analytics</h1>
        <h2 className="text-xl font-semibold tracking-wide mr-4">Welcome, {user.name}</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-[5%]">
        <div>
          <div className="flex justify-between m-1">
            <h2 className="text-xl font-semibold tracking-wide">Users</h2>
            <Button variant={'outline'}>Manage users</Button>
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
            <Button variant={'outline'}>Manage exams</Button>
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
      <ExamChart />

    </div>
  )
}

export default Dashboard