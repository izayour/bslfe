import NavBar from '../../Bars/Nav/NavBar';
import SideBar from '../../Bars/Side/SideBar';
import './test.css';
import { ReactComponent as ListIcon } from "../../../Icons/listIcon.svg";
import { ReactComponent as ProductMake } from "../../../Icons/productMakeIcon.svg";
import { ReactComponent as ProductType } from "../../../Icons/productTypeIcon.svg";
import { ReactComponent as HouseIcon } from "../../../Icons/houseIcon.svg";
import { ReactComponent as Logo } from "../../../Icons/logo.svg";
import { NavLink } from "react-router-dom";

const Sales = () => {
    return (
        <>
            <NavBar />
            <SideBar />
            <div className="container bg-white subContainer" style={{ position: "absolute", top: "50px", left: "245px", maxWidth: "82%" }}>
                <div className="row">
                    <div className ="mt-2">
                        <label style={{ color: "rgba(0, 0, 0, 0.45)", marginLeft: "5px", marginBottom: "8px", marginRight: "4px" }}>
                            Warehouse Lots /
                        </label>
                        <label>  Add New Pallet</label>
                    </div>
                </div>

                <div className="row">
                    hi
                </div>
                <div className="row">
                    hi
                </div>
            </div>
            {/* <div style={{ position: "absolute", top: "50px", left: "233px" }}>
                <div className="col-11 bg-white ">
                    hi
                </div>
            </div> */}
            {/* <header className="header" id="header">
                <NavBar />
            </header>

            <div className="col-lg-2 l-navbar" id="nav-bar">
                <nav className="nav">
                    <div>
                        <NavLink to="/sales" className="nav__logo">
                            <ListIcon />
                            <span class="nav__logo-name">Bedimcode</span>
                        </NavLink>
                    </div>

                    <div className="nav__list">
                        <NavLink to="/" className="nav__link active">
                            <ProductMake className='bx bx-grid-alt nav__icon' />
                            Dashboard
                        </NavLink>

                        <a href="#" class="nav__link">
                            <ProductMake className='bx bx-grid-alt nav__icon' />
                            <span class="nav__name">Users</span>
                        </a>

                        <a href="#" class="nav__link">
                            <ProductMake className='bx bx-grid-alt nav__icon' />
                            <span class="nav__name">Messages</span>
                        </a>

                        <a href="#" class="nav__link">
                            <ProductMake className='bx bx-grid-alt nav__icon' />
                            <span class="nav__name">Favorites</span>
                        </a>

                        <a href="#" class="nav__link">
                            <ProductMake className='bx bx-grid-alt nav__icon' />
                            <span class="nav__name">Data</span>
                        </a>

                        <a href="#" class="nav__link">
                            <ProductMake className='bx bx-grid-alt nav__icon' />
                            <span class="nav__name">Analytics</span>
                        </a>

                    </div>

                    <a href="#" class="nav__link">
                        <Logo class='bx bx-log-out nav__icon' />
                        <span class="nav__name">Log Out</span>
                    </a>
                </nav>
            </div> */}
        </>);
}

export default Sales;