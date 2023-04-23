import React, { useEffect, useState } from "react";
import ContainerDashboard from "~/components/layouts/ContainerDashboard";
import Upload from "~/components/upload";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import categories from "~/public/data/categories.json";
import { Select, Form, notification } from "antd";
import { isEmpty } from "ramda";
import { useRouter } from "next/router";
import AutoComplete from "~/components/autocomplete";
import RequestMainCategory from "~/components/request/main";
import RequestSubCategory from "~/components/request/sub";

const { uuid } = require("uuidv4");

// import {  Upload } from 'antd';

const CreateStylistPage = ({ vendor, socket }) => {
  const [type, setType] = useState();

  return (
    <ContainerDashboard title="Create new category">
      <HeaderDashboard title="" description="" />
      <section className="ps-new-item">
        <div className="row">
          <div className="col-12 text-center">
            <h3>Request a new Category</h3>
            <p>Please select the category you would like to request.</p>
          </div>
          <div className="col-12 text-center">
            <button
              className={`${type === "main" ? "ps-btn--gray" : "ps-btn--black"} ps-btn mr-3`}
              onClick={() => setType("main")}
            >
              Main Category
            </button>
            <button className={`${type === "sub" ? "ps-btn--gray" : "ps-btn--black"} ps-btn mr-3`} onClick={() => setType("sub")}>
              Sub Category
            </button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <div className="row d-flex justify-content-center">
              <div className="col-10">
                {type === "main" && <RequestMainCategory socket={socket} />}
                {type === "sub" && <RequestSubCategory socket={socket} />}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ContainerDashboard>
  );
};
export default connect((state) => state.app)(CreateStylistPage);
