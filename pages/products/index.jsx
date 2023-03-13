import React, { useEffect, useState } from "react";
import ContainerDashbaord from "~/components/layouts/ContainerDashboard";
import Pagination from "~/components/elements/basic/Pagination";
import TableProjectItems from "~/components/shared/tables/TableProjectItems";
import { Select } from "antd";
import Link from "next/link";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import categories from "~/public/data/categories.json";

const { Option } = Select;
const ProductPage = ({ socket, vendor }) => {
  const [services, setServices] = useState();
  const [originalServices, setOriginalServices] = useState()
  const [statusFilter, setStatusFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  if(!services && socket && vendor){
    console.log("getting services")
    socket.emit("GET_VENDOR_SERVICES", {id: vendor.id})
    socket.on("RECEIVE_VENDOR_SERVICES", data => {
      setServices(data)
      setOriginalServices(data)
    })
  }
  
  const runFilter = (e) => {
    e.preventDefault()
    const filterByCategory = categoryFilter ? originalServices?.filter( s => s?.category === categoryFilter) : originalServices;
    const filterByStatus = statusFilter ? filterByCategory?.filter( s => s?.active === statusFilter) : filterByCategory;
    setServices(filterByStatus);
  }

  const clear =(e) => {
    e.preventDefault()
    setServices(originalServices)
  }
  console.log("vndr", vendor)

  return (
    <ContainerDashbaord title="Services" socket={socket}>
      <HeaderDashboard
        title="Service"
        description={vendor?.storeName+" Services"}
      />
      <section className="ps-items-listing">
        <div className="ps-section__actions">
          <Link href="/products/create-product">
            <p className="ps-btn success">
              <i className="icon icon-plus mr-2" />
              New Service
            </p>
          </Link>
        </div>
        <div className="ps-section__header">
          <div className="ps-section__filter">
            <form className="ps-form--filter" action="index.html" method="get">
              <div className="ps-form__left">
                <div className="form-group">
                  <Select
                    placeholder="Select Category"
                    className="ps-ant-dropdown"
                    listItemHeight={20}
                    onChange={val => setCategoryFilter(val)}
                  >
                    {categories.map((c) => (
                      <Option value={c.slug}>{c.title}</Option>
                    ))}
                  </Select>
                </div>
                <div className="form-group">
                  <Select
                    placeholder="Status"
                    className="ps-ant-dropdown"
                    listItemHeight={20}
                    onChange={val => setStatusFilter(val)}
                  >
                    <Option value={true}>Active</Option>
                    <Option value={false}>In-Active</Option>
                  </Select>
                </div>
              </div>
              
              <div className="ps-form__right">
                <button className="ps-btn ps-btn--gray" onClick={runFilter}>
                  <i className="icon icon-funnel mr-2"></i>
                  Filter
                </button>
              </div>
              <div className="ps-form__right">
                <button className="ps-btn" onClick={clear}>                  
                  Clear
                </button>
              </div>
            </form>
          </div>
          <div className="ps-section__search">
            <form
              className="ps-form--search-simple"
              action="index.html"
              method="get"
            >
              <input
                className="form-control"
                type="text"
                placeholder="Search product"
              />
              <button>
                <i className="icon icon-magnifier"></i>
              </button>
            </form>
          </div>
        </div>
        <div className="ps-section__content">
          <TableProjectItems services={services} socket={socket}/>
        </div>
        <div className="ps-section__footer">
          <p>Show 10 in 30 items.</p>
          <Pagination />
        </div>
      </section>
    </ContainerDashbaord>
  );
};
export default connect((state) => state.app)(ProductPage);
