import React, { useEffect, useState } from "react";
import ContainerDashbaord from "~/components/layouts/ContainerDashboard";
import Pagination from "~/components/elements/basic/Pagination";
import TableProducts from "~/components/shared/tables/TableProducts";
import { Select } from "antd";
import Link from "next/link";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import categories from "~/public/data/categories.json";

const { Option } = Select;
const ProductPage = ({ socket, vendor }) => {
  const [products, setProducts] = useState();
  const [originalServices, setOriginalServices] = useState()
  const [statusFilter, setStatusFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  if(!products && socket && vendor){
    console.log("getting products")
    socket.emit("GET_VENDOR_PRODUCTS", {id: vendor.id})
    socket.on("RECEIVE_VENDOR_PRODUCTS", data => {
      setProducts(data)
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
  console.log("products", products)

  return (
    <ContainerDashbaord title="Products" socket={socket}>
      <HeaderDashboard
        title="Product"
        description={vendor?.storeName+" Products"}
      />
      <section className="ps-items-listing">
        <div className="ps-section__actions">
          <Link href="/products/create-product">
            <p className="ps-btn success">
              <i className="icon icon-plus mr-2" />
              New Product
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
          <TableProducts products={products} socket={socket}/>
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
