import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"


const ExamCompleted = () => {
  const navigate = useNavigate()
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="text-center">
        <CardHeader>
          <div className="flex items-center justify-center space-x-1 my-1">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <BookOpen className="size-4" />
            </div>
            <div className="text-left text-sm leading-tight">
              <span className="truncate font-semibold">ExBoard</span>
            </div>
          </div>
          <CardTitle className="text-3xl">Exam Completed</CardTitle>
          <CardDescription>Your examination have been submitted successfully.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate('/dashboard/home')} className="w-full" size={"lg"}>Return to dashboard</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ExamCompleted