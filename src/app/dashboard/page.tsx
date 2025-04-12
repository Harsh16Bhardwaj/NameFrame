import React from "react";
import Link from "next/link";
import Footer from "@/components/footer"
import Image from "next/image";
import example1 from "@/../public/ex1.jpg";
import example2 from "@/../public/ex2.jpg";
import example3 from "@/../public/ex3.jpg";
import example4 from "@/../public/ex4.jpg";
import add from "@/../public/add.png";

function Dashboard() {
  return (
    <>
      <div className="p-4 pb-8  bg-gray-200">
        {/* Banner */}
        <div className="border-black border-b-2 border-r-2 bg-gradient-to-r from-[#c31432] to-[#240b36] bg-[length:200%_200%] animate-bgPulse rounded-xl text-center font-semibold p-3 shadow-2xl drop-shadow-lg overflow-hidden">
          <h2 className="text-lg text-white underline-offset-2 -mb-1 animate-glowText">
            Enjoy the initial launch of NameFrame 🎁🎁
          </h2>
          <h3 className="text-gray-300 font-light pb-3 animate-floatText">
            Try out different modes, free offers and cool features on the
            initial release of the app. Grab your benefit before it's too late
            !!
          </h3>
          <button className="bg-gradient-to-r from-[#dca200] to-[#F37335] duration-200 hover:ease-in-out hover:duration-200 ease-in-out hover:from-red-500 hover:to-red-500 hover:-translate-y-1 rounded-lg text-md text-white px-4 py-1 border-white cursor-pointer font-semibold animate-pulseSlow">
            See Now
          </button>
        </div>

        {/* Creation */}
        <div className="mt-6 px-5 ">
          <h2 className="m-1 text-lg font-bold">Create an Event :</h2>

          <div className="border-black border-2 rounded-2xl flex gap-x-4 p-3 py-4 bg-white border-r-6 border-b-6 ">
            {/* Add new Event */}
            <Link href="/create">
              <div
                className="w-56 h-40 bg-red-200 rounded-2xl flex flex-col justify-center items-center cursor-pointer 
                      hover:bg-red-300 hover:scale-105 hover:rotate-1 transition-all duration-300 ease-in-out"
              >
                <Image
                  src={add}
                  width={30}
                  height={30}
                  alt="add icon"
                  className="hover:rotate-45 transition-transform duration-300 ease-in-out"
                />
                <h2 className="font-semibold mt-2">Add a new Event</h2>
              </div>
            </Link>

            {/* Separator */}
            <div className="w-0.5 h-40 bg-gray-600"></div>

            {/* Templates */}
            <div className="flex gap-x-2">
              {/* Template 1 */}
              <Link href="" target="_blank">
                <Image
                  alt="example-certificate"
                  src={example1}
                  className="w-56 border-2 border-black rounded-2xl 
                    hover:scale-105 hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out"
                />
              </Link>

              {/* Template 2 */}
              <Link
                href="https://www.canva.com/design/DAGkWmb6UAk/JynLF__USGjcxEUqybwxFQ/edit"
                target="_blank"
              >
                <Image
                  alt="example-certificate"
                  src={example2}
                  className="w-56 border-2 border-black rounded-2xl 
                    hover:scale-105 hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out"
                />
              </Link>

              {/* Template 3 */}
              <Link
                href="https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit"
                target="_blank"
              >
                <Image
                  alt="example-certificate"
                  src={example3}
                  className="w-56 border-2 border-black rounded-2xl 
                    hover:scale-105 hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out"
                />
              </Link>

              {/* Template 4 */}
              <Link
                href="https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit"
                target="_blank"
              >
                <Image
                  alt="example-certificate"
                  src={example4}
                  className="w-56 border-2 border-black rounded-2xl 
                    hover:scale-105 hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out"
                />
              </Link>

              {/* Browse All Templates */}
              <Link
                href="https://www.canva.com/certificates/templates/"
                target="_blank"
                className="relative"
              >
                <div
                  className="w-56 h-40 rounded-2xl absolute bg-amber-200 text-center p-3 font-semibold flex flex-col justify-center items-center 
                        hover:bg-yellow-300 hover:scale-105 transition-all duration-300 ease-in-out z-10"
                >
                  <h2>Browse</h2>
                  <h2>All</h2>
                  <h2>Templates</h2>
                  <svg
                    className="mt-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 50 50"
                  >
                    <path d="M 25 2 C 12.317 2 2 12.317 2 25 C 2 37.683 12.317 48 25 48 C 37.683 48 48 37.683 48 25 C 48 12.317 37.683 2 25 2 z M 25 4 C 36.579 4 46 13.421 46 25 C 46 36.579 36.579 46 25 46 C 13.421 46 4 36.579 4 25 C 4 13.421 13.421 4 25 4 z M 27.570312 10.042969 C 19.819312 10.042969 12.931641 17.229875 12.931641 27.171875 C 12.931641 34.867875 17.326422 39.953125 24.107422 39.953125 C 31.304422 39.953125 35.466797 32.79275 35.466797 30.46875 C 35.466797 29.95475 35.203688 29.71875 34.929688 29.71875 C 34.739688 29.71875 34.572437 29.878516 34.398438 30.228516 C 32.435437 34.208516 29.045094 37.025391 25.121094 37.025391 C 20.584094 37.025391 17.775391 32.929484 17.775391 27.271484 C 17.775391 17.688484 23.114688 12.148438 27.804688 12.148438 C 29.996688 12.148438 31.335938 13.524797 31.335938 15.716797 C 31.335938 18.317797 29.857422 19.695281 29.857422 20.613281 C 29.857422 21.025281 30.113094 21.273438 30.621094 21.273438 C 32.662094 21.273438 35.056641 18.928234 35.056641 15.615234 C 35.056641 12.403234 32.260312 10.042969 27.570312 10.042969 z" />
                  </svg>
                </div>
                <div>
                  <Image
                    src={example1}
                    alt="example-canva"
                    className="w-56 rounded-2xl absolute opacity-30"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>


        {/* History */}
        <div className="mt-6  ">
          <div className="flex  items-center gap-x-1 mt-4">
            <h2 className="m-1 ml-6 text-lg font-bold ">Recent Events: </h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 50 50"
            >
              <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24.984375 6.9863281 A 1.0001 1.0001 0 0 0 24 8 L 24 22.173828 A 3 3 0 0 0 22 25 A 3 3 0 0 0 22.294922 26.291016 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 23.708984 27.705078 A 3 3 0 0 0 25 28 A 3 3 0 0 0 28 25 A 3 3 0 0 0 26 22.175781 L 26 8 A 1.0001 1.0001 0 0 0 24.984375 6.9863281 z"></path>
            </svg>
          </div>

          <div className="border-black border-2 rounded-2xl grid grid-cols-5 grid-row-5 mx-6  gap-x-5 gap-y-4 p-3 py-8 px-4  bg-white border-r-6 border-b-6 ">
            <Link
              href="https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit"
              target="_blank"
            >
              <Image
                alt="example-certificate"
                src={example4}
                className="w-66 border-2 border-black rounded-2xl 
                    hover:scale-105 hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out"
              />
            </Link>
            <Link
              href="https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit"
              target="_blank"
            >
              <Image
                alt="example-certificate"
                src={example2}
                className="w-66 border-2 border-black rounded-2xl 
                    hover:scale-105 hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out"
              />
            </Link>
            <Link
              href="https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit"
              target="_blank"
            >
              <Image
                alt="example-certificate"
                src={example3}
                className="w-66 border-2 border-black rounded-2xl 
                    hover:scale-105 hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out"
              />
            </Link>
            <Link
              href="https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit"
              target="_blank"
            >
              <Image
                alt="example-certificate"
                src={example1}
                className="w-66 border-2 border-black rounded-2xl 
                    hover:scale-105 hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out"
              />
            </Link>
            <Link
              href="https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit"
              target="_blank"
            >
              <Image
                alt="example-certificate"
                src={example4}
                className="w-66 border-2 border-black rounded-2xl 
                    hover:scale-105 hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out"
              />
            </Link>
            <Link
              href="https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit"
              target="_blank"
            >
              <Image
                alt="example-certificate"
                src={example3}
                className="w-66 border-2 border-black rounded-2xl 
                    hover:scale-105 hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out"
              />
            </Link>
            <Link
              href="https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit"
              target="_blank"
            >
              <Image
                alt="example-certificate"
                src={example4}
                className="w-66 border-2 border-black rounded-2xl 
                    hover:scale-105 hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out"
              />
            </Link>
            <Link
              href="https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit"
              target="_blank"
            >
              <Image
                alt="example-certificate"
                src={example1}
                className="w-66 border-2 border-black rounded-2xl 
                    hover:scale-105 hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out"
              />
            </Link>
            
          </div>
        </div>

      </div>
    </>
  );
}

export default Dashboard;
