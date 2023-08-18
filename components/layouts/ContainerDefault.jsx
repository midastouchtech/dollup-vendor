import React from "react";
import Head from "next/head";
import FooterCopyright from "~/components/shared/footers/FooterCopyright";
import MenuSidebar from "~/components/shared/menus/MenuSidebar";
import WidgetEarningSidebar from "~/components/shared/widgets/WidgetEarningSidebar";
import WidgetUserWelcome from "~/components/shared/widgets/WidgetUserWelcome";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContainerDefault = ({ children, title }) => {
  let titleView;
  if (title !== undefined) {
    titleView = process.env.title + " | " + title;
  } else {
    titleView = process.env.title + " | " + process.env.titleDescription;
  }

  return (
    <div className="martfury-admin">
      <Head>
        <title>{titleView}</title>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/holder/2.9.8/holder.min.js"
          integrity="sha512-O6R6IBONpEcZVYJAmSC+20vdsM07uFuGjFf0n/Zthm8sOFW+lAq/OK1WOL8vk93GBDxtMIy6ocbj6lduyeLuqQ=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        ></script>
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <main className="ps-main">
        <div className="ps-main__sidebar">
          <div className="ps-sidebar">
            <div className="ps-sidebar__top">
              <WidgetUserWelcome />
            </div>
            <div className="ps-sidebar__content">
              <div className="ps-sidebar__center">
                <MenuSidebar />
              </div>
            </div>
            <div className="ps-sidebar__footer">
              <FooterCopyright />
            </div>
          </div>
        </div>
        <div className="ps-main__wrapper">{children}</div>
      </main>
    </div>
  );
};

export default ContainerDefault;
