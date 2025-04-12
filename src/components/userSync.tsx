"use client";
import { useEffect } from "react";
import axios from "axios";

const UserSync = () => {
  useEffect(() => {
    // Making the POST request using axios
    axios
      .post("/api/userSync")
      .then((response) => {
        console.log("User sync successful:", response.data);
      })
      .catch((err) => {
        console.error("User sync failed:", err);
      });
  }, []); // Empty dependency array means it runs once after initial render

  return null;
};

export default UserSync;
