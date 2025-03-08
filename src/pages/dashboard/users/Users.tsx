import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from '@/hooks/use-toast'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useAuth } from '@/AuthProvider'


export interface IUser {
  _id: string,
  name: string,
  reg_no: string,
  email: string
  role: string,
}


const Users = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState<IUser[]>([])

  const [educators, setEducators] = useState<IUser[]>([])

  const [, setFetching] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      await axios.get('https://ex-board.vercel.app/auth/all/student', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: IUser[]
        }>) => {
          //create a toast message feedback 
          if (response.data?.success) {
            const fetchedUsers = response.data?.data
            setStudents(fetchedUsers)
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

      await axios.get('https://ex-board.vercel.app/auth/all/admin', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then((response: AxiosResponse<{
          success: boolean,
          message: string,
          data: IUser[]
        }>) => {
          //create a toast message feedback 
          if (response.data?.success) {
            const fetchedUsers = response.data?.data
            setEducators(fetchedUsers)
          } else {
            toast({
              variant: "destructive",
              title: "Failed to fetch educators!",
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
    fetchUsers()


    return () => {
      setFetching(false)
    }
  }, [])

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold tracking-wide">Users</h2>

        <div className="flex items-center my-4 space-x-4">
          <Card>
            <CardHeader>
              <h3 className='text-xl font-bold'>{educators.length + students.length}</h3>
            </CardHeader>
            <CardFooter>Total users</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <h3 className='text-xl font-bold'>{educators.length}</h3>
            </CardHeader>
            <CardFooter>Educators</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <h3 className='text-xl font-bold'>{students.length}</h3>
            </CardHeader>
            <CardFooter>Students</CardFooter>
          </Card>
        </div>
      </div>

      <div className='p-2 md:p-4 my-5'>
        <h3 className='text-xl font-bold'>Students</h3>

        <Table>
          <TableCaption>A list of registered students</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Registration No</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => {
              return (
                <TableRow key={student._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell width={'240px'} className="font-semibold">{student.name}</TableCell>
                  <TableCell>{student.reg_no}</TableCell>
                  <TableCell>{student.email}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className='p-2 md:p-4 my-5'>
        <h3 className='text-xl font-bold'>Educators</h3>

        <Table>
          <TableCaption>A list of qualified educators</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Registration No</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {educators.map((educator, index) => {
              return (
                <TableRow key={educator._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell width={'240px'} className="font-semibold">{educator.name}</TableCell>
                  <TableCell>{educator.reg_no}</TableCell>
                  <TableCell>{educator.email}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

      </div>

    </div>
  )
}

export default Users