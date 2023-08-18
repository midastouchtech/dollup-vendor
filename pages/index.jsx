import React, { useEffect, useState } from "react";
import CardRecentOrders from "~/components/shared/cards/CardRecentOrders";
import CardSaleReport from "~/components/shared/cards/CardSaleReport";
import CardEarning from "~/components/shared/cards/CardEarning";
import CardStatics from "~/components/shared/cards/CardStatics";
import ContainerDashboard from "~/components/layouts/ContainerDashboard";
import { toggleDrawerMenu, saveVendor } from "~/store/app/action";
import CardTopCountries from "~/components/shared/cards/CardTopCountries";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";

const Index = ({ socket, vendor }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  return (
    <ContainerDashboard title="Dashboard" socket={socket}>
      <HeaderDashboard title="Dashboard" description="Dollup Bookings" />
      <section className="ps-dashboard" id="homepage">
        <div className="ps-section__left">
          <div className="row">
            <div className="col-xl-8 col-12">
              <CardSaleReport socket={socket} vendor={vendor} />
            </div>
            <div className="col-xl-4 col-12">
              <CardEarning socket={socket} vendor={vendor} />
            </div>
          </div>
          <CardRecentOrders socket={socket} vendor={vendor} />
        </div>
        <div className="ps-section__right">
          <CardStatics socket={socket} vendor={vendor} />
        </div>
      </section>
    </ContainerDashboard>
  );
};

export default connect((state) => state.app)(Index);
