import React, { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { PieChart } from "react-minimal-pie-chart";
import { useAppType } from "../store";
import { secondsToHms } from "../utils/helper";

const Home = ({ devices }) => {
  const router = useRouter();

  const { updateAppType, productive, nonProductive, nonMark } = useAppType();

  const productiveTime = productive.reduce((acc, current) => {
    return acc + current.usage;
  }, 0);
  const nonProductiveTime = nonProductive.reduce((acc, current) => {
    return acc + current.usage;
  }, 0);
  const otherTime = nonMark.reduce((acc, current) => {
    return acc + current.usage;
  }, 0);

  useEffect(() => {
    updateAppType(devices[0].apps, router.query.phone);
  }, [devices, router.query.phone]);

  return (
    <div className="p-5">
      <button
        onClick={() => {
          router.push(
            `/?phone=${encodeURIComponent(`${router.query.phone}`)}`
          );
        }}
        className="border-yellow-400 border p-3 rounded-xl flex items-center w-full"
      >
        <div className="bg-yellow-300 p-3 rounded-full mr-2">
          <img src="/settings.svg" />
        </div>
        <p>Setup productivity apps</p>
      </button>
      <div className="flex items-center my-5">
        <div className="h-28">
          <PieChart
            data={[
              { title: "One", value: productiveTime, color: "#6930C3" },
              { title: "Two", value: nonProductiveTime, color: "#C11487" },
              { title: "Three", value: otherTime, color: "#FF7630" },
            ]}
            lineWidth={30}
            rounded
          />
        </div>
        <div>
          <div className="flex my-2">
            <div
              className="h-6 w-6 rounded-lg mr-2 flex-shrink-0"
              style={{ backgroundColor: "#6930C3" }}
            ></div>
            <div>
              <p>Productive</p>
              <p>{secondsToHms(productiveTime) || 0}</p>
            </div>
          </div>
          <div className="flex my-2 ">
            <div
              className="h-6 w-6 rounded-lg mr-2 flex-shrink-0"
              style={{ backgroundColor: "#C11487" }}
            ></div>
            <div>
              <p>Non Productive</p>
              <p>{secondsToHms(nonProductiveTime) || 0}</p>
            </div>
          </div>
          <div className="flex my-2">
            <div
              className="h-6 w-6 rounded-lg mr-2 flex-shrink-0"
              style={{ backgroundColor: "#FF7630" }}
            ></div>
            <div>
              <p>Other</p>
              <p>{secondsToHms(otherTime) || 0}</p>
            </div>
          </div>
        </div>
      </div>

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
