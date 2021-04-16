import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { secondsToHms } from "../utils/helper";
import { useUser } from "../context/usercontext";
import firebase from "../firebase";

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

export default function Home({ error, ...props }) {
  const { user = {}, setLogin, loginState, onGmailLogin, logOut } = useUser();

  const [data, setData] = useState(props);
  const [activeFilter, setActiveFilter] = useState({
    type: "",
    direction: true,
  });

  const handleFilter = (type, dir) => {
    setData((prev) => ({
      ...prev,
      apps: [
        ...data.apps.sort((a, b) =>
          dir ? a[type] - b[type] : b[type] - a[type]
        ),
      ],
    }));
  };

  useEffect(() => {
    if (activeFilter.type) {
      handleFilter(activeFilter.type, activeFilter.direction);
    }
  }, [activeFilter]);

  if (user === null) {
    return <div>Loading...</div>;
  }
  console.log(props, user, error);

  if (user.error || error.status_code === 401) {
    return <NotLogin user={user} onGmailLogin={onGmailLogin} logOut={logOut} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <table className="table-fixed">
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
            <th className="w-1/4 text-left">App Type</th>
          </tr>
        </thead>
        <tbody>
          {data.apps.map(({ title, usage }) => (
            <tr key={title}>
              <td>{title}</td>
              <td>{secondsToHms(usage)}</td>
              <td>858</td>
            </tr>
          ))}
        </tbody>
      </table> */}

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

export const getServerSideProps = async (context) => {
  try {
    const { data: user } = await axios.get(
      `https://api.ratrey.co/v1.0/parssal/me/`
    );
    const { data } = await axios.get(
      "https://api.ratrey.co/v1.0/parssal/app-list/"
    );

    return { props: { ...data, user } };
  } catch (e) {
    return {
      props: {
        error: e.response.data,
      },
    };
  }
};
