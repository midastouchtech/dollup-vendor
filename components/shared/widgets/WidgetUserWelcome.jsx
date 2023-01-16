import React from 'react';
import { connect } from 'react-redux';

const WidgetUserWelcome = ({vendor}) => {
    console.log("wdget vendor", vendor)
    return (
        <div className="ps-block--user-wellcome">
            <div className="ps-block__left">
                <img src="/img/user/blank.png" alt="" style={{"maxWidth":"60px"}}/>
            </div>
            <div className="ps-block__right">
                <p>
                    Hello,<a href="#">{vendor?.storeName}</a>
                </p>
            </div>
            <div className="ps-block__action">
                <a href="#">
                    <i className="icon-exit"></i>
                </a>
            </div>
        </div>
    );
};

export default connect((state) => state.app)(WidgetUserWelcome);
