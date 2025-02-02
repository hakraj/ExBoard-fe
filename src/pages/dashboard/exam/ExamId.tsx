import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Timer, Presentation, ChevronDown, ChevronUp } from "lucide-react"

const ExamId = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-wide">Exams</h2>
          <div className="flex max-md:flex-col items-center m-1 md:space-x-2">
            <div className="inline-flex items-center">
              <Presentation className=" size-4 mr-1" />
              <span className="text-sm ">
                Mr. Stanford
              </span>
            </div>
            <div className="inline-flex items-center max-md:self-start">
              <Timer className=" size-4 mr-1" />
              <span className="text-sm">
                2hr 30mins
              </span>
            </div>
          </div>
        </div>
        <Button>
          <Download />
          Attendance
        </Button>
      </div>
      <div className="p-2 md:p-4 md:w-3/4">
        <p className=" font-light text-lg tracking-tight leading-normal">df ffuym kxksksks ksjjjs ikmwjiw kk owmw o o k kkkssmd kwmwm kwks, slaappapa kkekmwapasieurhfnf iue ine u. siwjshsusuwuw e degdgued kj f2n e b2f gf2h3fvf dbiuewcc fn.</p>
        <p className="mt-2 font-medium">50 Questions</p>
      </div>
      <div className="p-2 md:p-4 flex flex-col space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Question 1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex ">
              <div className="flex flex-1">
                Hello?
              </div>
              <div>
                <ChevronDown />
                <ChevronUp />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ExamId