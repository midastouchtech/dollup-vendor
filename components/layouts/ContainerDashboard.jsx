import React from 'react';
import Head from 'next/head';
import { useState } from 'react';
import FooterCopyright from '~/components/shared/footers/FooterCopyright';
import MenuSidebar from '~/components/shared/menus/MenuSidebar';
import WidgetEarningSidebar from '~/components/shared/widgets/WidgetEarningSidebar';
import WidgetUserWelcome from '~/components/shared/widgets/WidgetUserWelcome';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import cookies from "js-cookie";
import { saveVendor } from '~/store/app/action';
import { isEmpty } from 'ramda'

const ContainerDashboard = ({ children, title, socket }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [vendor, setVendor] = useState({})
    
    const { vendorId } = router.query;
    console.log("router query", router.query)
    const cookieVendor = cookies.get("dollup_logged_in_vendor");
    console.log("cookier vendor", cookieVendor)
    //console.log("parsed cookievendr", JSON.parse(cookieVendor))
    let titleView;
    if (title !== undefined) {
        titleView = process.env.title + ' | ' + title;
    } else {
        titleView = process.env.title + ' | ' + process.env.titleDescription;
    }
    if(socket && isEmpty(vendor)){
        console.log("has socket and empty vendr")
        console.log("vendorId", vendorId)
        if(!vendorId && cookieVendor){
            console.log("has no vendor id but has cookie vendor")

            setVendor(JSON.parse(cookieVendor))
            dispatch(saveVendor(JSON.parse(cookieVendor)));
        }
        else{
            console.log("has vendor id, so fetching vendor")
            socket.emit("GET_VENDOR", { id: vendorId })
            socket.on("RECEIVE_VENDOR", (data)=>{            
                setVendor(data)
                dispatch(saveVendor(data));
                cookies.set("dollup_logged_in_vendor", JSON.stringify(data), { expires: 1 });
                socket.off("RECEIVE_VENDOR")
            })
            
        }
    }
    console.log("layout vendor", vendor)

    return (
        <div className="martfury-admin">
            <Head>
                <title>{titleView}</title>
            </Head>
            <main className="ps-main">
                <div className="ps-main__sidebar">
                    <div className="ps-sidebar">
                        <div className="ps-sidebar__top">
                            <WidgetUserWelcome />
                            <WidgetEarningSidebar />
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
                <div className="ps-main__wrapper">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default ContainerDashboard;
