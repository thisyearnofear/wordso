// @import url(https://fonts.googleapis.com/css?family=Montserrat:400,700,900|Open+Sans:300,400,600,700&display=swap&subset=cyrillic,cyrillic-ext);

import { Montserrat, Open_Sans } from "next/font/google";

export const MontserratFont = Montserrat({
  weight: ["400", "700", "900"],
  variable: "--montserrat-font",
  subsets: ["latin"],
});

export const OpenSansFont = Open_Sans({
  weight: ["300", "400", "600", "700"],
  variable: "--open-sans-font",
  subsets: ["latin"],
});
