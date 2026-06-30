// src/lib/fonts.ts
import { Titan_One, Josefin_Sans } from "next/font/google";

export const titanOne = Titan_One({
  subsets: ["latin"],
  weight: "400",
});

export const josefinFont = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});