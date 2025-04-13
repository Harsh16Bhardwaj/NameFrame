import React from "react";

function DownloadPage() {
  return (
    <>
      <div className="bg-gray-200 fixed w-full h-screen -mt-16 z-30">
        <div className="h-40 bg-neutral-600 flex justify-center items-center">
          <h1>Our message to direct users</h1>
        </div>
        <div className="flex">
          <div className="h-screen w-1/3 bg-teal-800 flex items-center justify-center">
          Event Details who has sent what was event etc etc
          </div>
          <div className="h-screen w-2/3 bg-amber-200"></div>
        </div>
      </div>
    </>
  );
}

export default DownloadPage;
