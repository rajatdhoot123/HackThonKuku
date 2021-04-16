import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { secondsToHms } from "../utils/helper";
import { useUser } from "../context/usercontext";
import firebase from "../firebase";

const DropDown = ({ options, selectedProfile }) => {
  const [selected, setSelected] = useState(options[0].id);

  useEffect(() => {
    selectedProfile(+selected);
  }, [selected]);
  return (
    <div className="relative inline-flex">
      <svg
        className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 412 232"
      >
        <path
          d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
          fill="#648299"
          fillRule="nonzero"
        />
      </svg>
      <select
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
        }}
        className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
      >
        {options.map(({ fullname, id }) => (
          <option key={id} value={id}>
            {fullname}
          </option>
        ))}
      </select>
    </div>
  );
};

const AppTable = ({ apps, user }) => {
  const [data, setData] = useState(apps);
  const [activeFilter, setActiveFilter] = useState({
    type: "",
    direction: true,
  });
  useEffect(() => {
    setData(apps);
  }, [apps]);

  useEffect(() => {
    if (activeFilter.type) {
      handleFilter(activeFilter.type, activeFilter.direction);
    }
  }, [activeFilter]);

  const handleFilter = (type, dir) => {
    setData(() => [
      ...data.sort((a, b) => (dir ? a[type] - b[type] : b[type] - a[type])),
    ]);
  };
  return (
    <div className="border-red-500 border m-2 p-2 rounded-lg bg-red-100">
      <div className="text-center text-lg font-semibold flex justify-center">
        <div>Profile &nbsp;</div>
        <div>{user.fullname}</div>
      </div>
      <table className="table-fixed">
        <thead>
          <tr>
            <th
              onClick={() => {
                setActiveFilter({
                  type: "title",
                  direction: !activeFilter.direction,
                });
              }}
              className="w-1/2 text-left"
            >
              App Name
            </th>
            <th
              onClick={() => {
                setActiveFilter({
                  type: "usage",
                  direction: !activeFilter.direction,
                });
              }}
              className="w-1/4 text-left"
            >
              Usage (min)
            </th>
            <th className="w-1/4 text-center">App Type</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ title, usage }) => (
            <tr key={title}>
              <td>{title}</td>
              <td>{secondsToHms(usage)}</td>
              <td className="text-center">858</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const NotLogin = ({ onGmailLogin, user, logOut }) => {
  return (
    <div className="h-screen w-full flex  items-center justify-center">
      {!user.uid ? (
        <button
          className="bg-red-400 text-white px-5 py-3 rounded-lg font-bold"
          onClick={onGmailLogin}
        >
          Login
        </button>
      ) : (
        <button
          className="bg-red-400 text-white px-5 py-3 rounded-lg font-bold"
          onClick={logOut}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default function Home({ error, devices, ...props }) {
  // const { user = {}, setLogin, loginState, onGmailLogin, logOut } = useUser();

  // if (user === null) {
  //   return <div>Loading...</div>;
  // }
  // console.log(props, user, error);

  // if (user.error || error.status_code === 401) {
  //   return <NotLogin user={user} onGmailLogin={onGmailLogin} logOut={logOut} />;
  // }

  const [activeProfile, setActiveProfile] = useState(null);
  const router = useRouter();
  const [number, setNumber] = useState();

  useEffect(() => {
    if (router.query.phone) {
      setNumber(router.query.phone);
    }
  }, [router.query]);

  if (!router.query.phone) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-1/4">
          <p className="text-center my-2">Enter Number</p>
          <input
            maxLength="10"
            type="text"
            className="w-full border-red-400 border-2 rounded-lg
          border-opacity-30"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <button
            onClick={() => {
              router.push(`/?phone=${encodeURIComponent(`+91${number}`)}`);
            }}
            className="text-center my-2 w-full"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center justify-center">
        <h1 className="mx-2 font-semibold">Select Profile</h1>
        <DropDown
          selectedProfile={(profile) => setActiveProfile(profile)}
          options={devices.map((device) => device.user)}
        />
      </div>
      <div className="grid w-full grid-cols-1 ">
        {devices
          .filter((device) => +device.user.id === +activeProfile)
          .map((device) => (
            <AppTable key={device.id} {...device} />
          ))}
      </div>
      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  );
}

export const getServerSideProps = async ({ query: { phone = "" } }) => {
  try {
    // const { data: user } = await axios.get(
    //   `https://api.ratrey.co/v1.0/parssal/me/`
    // );
    const { data } = await axios.get(
      `https://api.ratrey.co/v1.0/parssal/app-list/?phone=${encodeURIComponent(
        phone
      )}`
    );

    return { props: data };
  } catch (e) {
    return {
      props: {
        error: e.response.data,
      },
    };
  }
};
