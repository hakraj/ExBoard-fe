import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";



const Welcome = () => {
  return (
    <>
      <div className=" flex flex-col min-h-screen items-center justify-center bg-image">
        <div className="text-center p-8 max-w-3xl">
          <h1 className="text-5xl text-gray-100 font-bold mb-6">Welcome to ExBoard</h1>
          <p className="text-xl text-gray-500 mb-12">Empowering minds through cognitive thinking</p>
        </div>

        <div>
          <Link to='/login' >
            {/* <button className="w-full p-3 text-lg rounded-xl bg-gradient-to-br from-sky-300 to-violet-500 text-gray-300 hover:to-sky-400 hover:text-gray-500 shadow-sm hover:shadow ">
              Login to continue
            </button> */}
            <Button size={'lg'}>Login to continue</Button>
          </Link>
        </div>

      </div>
    </>
  )
}

export default Welcome;