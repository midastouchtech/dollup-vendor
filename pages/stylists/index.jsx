import React, { useEffect, useState } from 'react';
import ContainerDashboard from '~/components/layouts/ContainerDashboard';
import Pagination from '~/components/elements/basic/Pagination';
import TableStylistItems from '~/components/shared/tables/TableStylistItems';
import FormSearchSimple from '~/components/shared/forms/FormSearchSimple';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import { connect, useDispatch } from 'react-redux';
import { toggleDrawerMenu } from '~/store/app/action';
import Link from 'next/link';

const StylistPage = ({ socket, vendor }) => {
    const [stylists, setStylists] = useState();
    const [originalStylists, setOriginalStylists] = useState()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(toggleDrawerMenu(false));
    }, []);
     console.log(stylists, socket, vendor)
    if(!stylists && socket && vendor){
        console.log("getting stylists")
        socket.emit("GET_VENDOR_STYLISTS", {id: vendor.id})
        socket.on("RECEIVE_VENDOR_STYLISTS", data => {
          setStylists(data)
          setOriginalStylists(data)
        })
      }
    return (
        <ContainerDashboard title="stylists">
            <HeaderDashboard
                title="Stylists"
                description={`${vendor?.storeName} Stylist Listing`} 
            />
            <section className="ps-items-listing">
                <div className="ps-section__header simple">
                    <div className="ps-section__filter">
                        <FormSearchSimple />
                    </div>
                    <div className="ps-section__actions">
                        <Link className="ps-btn success" href="/stylists/create-stylist">
                           
                            <i className="icon icon-plus mr-2"></i>Add Stylist
                            
                        </Link>
                    </div>
                </div>
                <div className="ps-section__content">
                    <TableStylistItems socket={socket} stylists={stylists}/>
                </div>
                <div className="ps-section__footer">
                    <p>Show 10 in 30 items.</p>
                    <Pagination />
                </div>
            </section>
        </ContainerDashboard>
    );
};
export default connect((state) => state.app)(StylistPage);
