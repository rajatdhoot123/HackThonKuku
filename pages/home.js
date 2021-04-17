import React from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Home = ({ devices }) => {
  const router = useRouter();

  return (
    <div className="p-5">
      <button
        onClick={() => {
          router.push(
            `/?phone=${encodeURIComponent(`+91${router.query.phone}`)}`
          );
        }}
        className="border-yellow-400 border p-3 rounded-xl flex items-center w-full"
      >
        <div className="bg-yellow-300 p-3 rounded-full mr-2">
          <img src="/settings.svg" />
        </div>
        <p>Setup productivity apps</p>
      </button>
      <div>
        <p className="my-5 font-bold text-2xl">Daily most used app</p>
        {[...devices[0].apps]
          .sort((a, b) => b.usage - a.usage)
          .slice(0, 5)
          .map((app) => (
            <div key={app.id} className="flex items-center my-5">
              <div className="bg-gray-300 rounded-lg h-12 w-12"></div>
              <p className="ml-2">{app.title}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ query: { phone = "" } }) => {
  try {
    // const { data: user } = await axios.get(
    //   `https://api.ratrey.co/v1.0/parssal/me/`
    // );
    const { data } = await axios.get(
      `https://api.ratrey.co/api/v1.0/parssal/app-list/?phone=${encodeURIComponent(
        "+91" + phone
      )}`
    );

    return { props: data };
  } catch (e) {
    console.log(e);
    return {
      props: {
        error: "e.response.data",
      },
    };
  }
};

export default Home;
