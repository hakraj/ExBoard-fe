import { useAuth } from "@/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowUpDown, ClipboardEdit, Edit, Plus, Table, Timer, Trash2 } from "lucide-react";


const Exam = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-wide">Exams</h2>
        <Button>
          <Plus />
          Create Exam
        </Button>
      </div>
      <div className="flex max-md:flex-col items-center md:justify-between p-2 md:p-4 mt-4">
        <div className="max-md:self-start">
          <p className="font-light text-lg tracking-tight leading-normal">df ffuym kxksksks ksjjjs ikmwjiw kk owmw o o k kkkssmd kwmwm kwks.</p>
        </div>
        <div className="inline-flex max-md:self-end items-center space-x-2 max-md:mt-4 m-1">
          <span className="font-medium">sort by:</span>
          {/* use shadcn select instead */}
          <select>
            <optgroup>
              <option defaultValue="latest">latest</option>
              <option value="published">published</option>
              <option value="alphabetical">a-z</option>
            </optgroup>
          </select>
          <ArrowUpDown className="size-4" />
        </div>

      </div>
      <div className="p-2 md:p-4">
        {user.role == "admin" ?
          <Table>
            <TableCaption>A list of available exams</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Time limit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-meduim">First</TableCell>
                <TableCell>50</TableCell>
                <TableCell>Mr.Raji</TableCell>
                <TableCell>2hr 3min</TableCell>
                <TableCell>
                  <div>
                    <Edit />
                    <Trash2 />
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-meduim">Second</TableCell>
                <TableCell>50</TableCell>
                <TableCell>Mr.Raji</TableCell>
                <TableCell>2hr 3min</TableCell>
                <TableCell>
                  <div>
                    <Edit />
                    <Trash2 />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          :
          <div className="grid sm:grid-cols-2 lg:grid-cols-3  xl:data-[state=open]:grid-cols-3  gap-4">
            {Array.from([1, 2, 3, 4, 5]).map((_, index) => {
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>First</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>df ffuym kxksksks ksjjjs ikmwjiw kk owmw o o k kkkssmd kwmwm kwks, slaappapa kkekmwapasieurhfnf iue ine u.</p>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <div className="inline-flex items-center max-md:self-start">
                      <Timer className=" size-4 mr-1" />
                      <span className="text-sm">
                        2hr 30mins
                      </span>
                    </div>
                    <Button size={'sm'}>
                      <ClipboardEdit />
                      Take Exam
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        }
      </div>
    </div>
  )
}


export default Exam;