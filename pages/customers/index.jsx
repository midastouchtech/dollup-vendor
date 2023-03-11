import React, { useEffect, useState } from 'react';
import ContainerDefault from '~/components/layouts/ContainerDefault';
import Pagination from '~/components/elements/basic/Pagination';
import TableCustomerItems from '~/components/shared/tables/TableCustomerItems';
import FormSearchSimple from '~/components/shared/forms/FormSearchSimple';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import { connect, useDispatch } from 'react-redux';
import { toggleDrawerMenu } from '~/store/app/action';
import Link from 'next/link';

const CustomersPage = ({ socket, vendor }) => {
    const [customers, setCustomers] = useState();
    const [originalCustomers, setOriginalCustomers] = useState()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(toggleDrawerMenu(false));
    }, []);
     console.log(customers, socket, vendor)
    if(!customers && socket && vendor){
        console.log("getting customers")
        socket.emit("GET_VENDOR", {id: vendor.id})
        socket.on("RECEIVE_VENDOR", data => {
          setCustomers(data.customers)
          setOriginalCustomers(data.customers)
        })
      }
    return (
        <ContainerDefault title="Customers">
            <HeaderDashboard
                title="Customers"
                description="Martfury Customer Listing"
            />
            <section className="ps-items-listing">
                <div className="ps-section__header simple">
                    <div className="ps-section__filter">
                        <FormSearchSimple />
                    </div>
                    <div className="ps-section__actions">
                        <Link className="ps-btn success" href="/customers/create-customer">
                            <a className="ps-btn success">
                            <i className="icon icon-plus mr-2"></i>Add Customer
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="ps-section__content">
                    <TableCustomerItems socket={socket} customers={customers}/>
                </div>
                <div className="ps-section__footer">
                    <p>Show 10 in 30 items.</p>
                    <Pagination />
                </div>
            </section>
        </ContainerDefault>
    );
};
export default connect((state) => state.app)(CustomersPage);
