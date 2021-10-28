import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
//import Login from "../../Login/Login"
import './Tab.css';

const TabBar = () => {
    const [key, setKey] = useState('home');

    return (
        <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
        >
            <Tab eventKey="home" title="Home">
                {/* <Login /> */}
            </Tab>
            <Tab eventKey="profile" title="Profile">
                {/* <Sonnet /> */}
            </Tab>
            <Tab eventKey="contact" title="Contact" disabled>
                {/* <Sonnet /> */}
            </Tab>
        </Tabs>
    );
}

// class TabBar extends React.Component {

//     render() {
//         return (
//             <div>
//                 <ul className="nav nav-tabs">
//                     {this.props.tabs.map(tab => {
//                         const active = (tab === this.props.selected ? 'active' : '');
//                         return (
//                             <li className="nav-item" key = {tab}>
//                                 <a className={"nav-link" + active} onClick={() => this.props.setSelected(tab)}>
//                                     {tab}
//                                 </a>
//                                 </li>
//                         );
//                     })}
//                 </ul>
//                 {this.props.children}
//             </div>
//         );
//     }
// }
export default TabBar;