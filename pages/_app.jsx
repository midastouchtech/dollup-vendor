import React, { useEffect, useState } from "react";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import { wrapper } from "~/store/store";
import "~/styles/style.scss";
import io from "socket.io-client";

function App({ Component, pageProps }) {
  const [socket, setSocket] = useState(null);
  const getLayout =
    Component.getLayout || ((page) => <DefaultLayout children={page} />);
  useEffect(() => {
    setTimeout(function () {
      document.getElementById("__next").classList.add("loaded");
    }, 100);
  }, []);

  if (!socket) {
    const socektOptions = {
      path: "/socket.io",
      transports: ["websocket"],
      secure: true,
    };
    const newSocket = io(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}}`,
      socektOptions
    );
    console.log("started socket", newSocket);
    setSocket(newSocket);
    newSocket.onAny((eventName, ...args) => {
      console.log("** Handling: ", eventName);
    });
  }

  return getLayout(<Component {...pageProps} socket={socket}></Component>);
}

export default wrapper.withRedux(App);
