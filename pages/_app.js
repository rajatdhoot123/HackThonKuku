import "tailwindcss/tailwind.css";
import { useEffect } from "react";
import { UserProvider } from "../context/usercontext";
import { useRouter } from "next/router";
import "../firebase";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // useEffect(() => {
  //   console.log(router);
  //   if (router.asPath !== "/") {
  //     router.push("/");
  //   }
  // }, [router.asPath]);
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
