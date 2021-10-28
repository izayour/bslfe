import './App.css';
import ViewAllUsers from './Components/Forms/UserManagement/a.1/ViewAllUsers';
import CreateNewEmployee from './Components/Forms/UserManagement/a.2/CreateNewEmployee';
import SingleEmployee from './Components/Forms/UserManagement/a.4/SingleEmployee';
import EditEmployee from './Components/Forms/UserManagement/a.6/EditEmployee';
import Warehouses from './Components/Forms/Warehouses/Warehouses';
import PalletList from './Components/Forms/Warehouses/b.1/PalletList';
import AllWarehouseLots from './Components/Forms/Warehouses/c.1/AllWarehouseLots';
import DispatchedToProcess from './Components/Forms/DispatchedToProcess/DispatchedToProcess';
import Sales from './Components/Forms/Sales/Sales';
import TimeTracker from './Components/Forms/TimeTracker/TimeTracker';
import Login from './Components/Login/Login';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Protected from './Components/Common/Protected';
import AddNewPallet from './Components/Forms/Warehouses/b.2/AddNewPallet';
import ViewPalletInfo from './Components/Forms/Warehouses/b.10/ViewPalletInfo';
import SingleWarehouseLot from './Components/Forms/Warehouses/c.5/SingleWarehouseLot';
import DispatchToProcess from './Components/Forms/Warehouses/c.A/DispatchToProcess';

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import UnderProcess from './Pages/UnderProcess';
import PageUnderConstruction from './Components/Common/PageUnderConstruction';
/* import "ag-grid-enterprise"; */

function App() {

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/Login" > <Login /> </Route>
          <Route exact path="/page_under_construction"> <Protected Cmp={PageUnderConstruction} /> </Route>
          <Route exact path="/UnderProcess"> <Protected Cmp={UnderProcess} /> </Route>
          
          <Route exact path="/usermanager"> <Protected Cmp={ViewAllUsers} />  </Route>
          <Route exact path="/usermanager/CreateEmployee"> <Protected Cmp={CreateNewEmployee} />  </Route>
          <Route exaxt path={"/usermanager/Edit/:id"}> <Protected Cmp={EditEmployee} /></Route>
          <Route exaxt path={"/usermanager/:id"}> <Protected Cmp={SingleEmployee} /></Route>
          
          <Route exact path="/warehouses"> <Protected Cmp={Warehouses} /></Route>
          <Route exaxt path={"/warehouses/PalletList/:id"}> <Protected Cmp={ViewPalletInfo} /></Route>
          <Route exaxt path={"/warehouses/PalletList"}> <Protected Cmp={PalletList} /></Route>
          <Route exaxt path={"/warehouses/addNewPallet"}> <Protected Cmp={AddNewPallet} /></Route>

          <Route exaxt path={"/warehouses/WarehouseLots/DispatchToProcess/:id"}> <Protected Cmp={DispatchToProcess} /></Route>
          <Route exaxt path={"/warehouses/WarehouseLots/:id"}> <Protected Cmp={SingleWarehouseLot} /></Route>
          <Route exaxt path={"/warehouses/WarehouseLots"}> <Protected Cmp={AllWarehouseLots} /></Route>

          <Route exact path="/DispatchedToProcess"> <Protected Cmp={DispatchedToProcess} /> </Route>
          <Route exact path="/Sales"> <Sales /> </Route>
          <Route exact path="/TimeTracking"> <Protected Cmp={TimeTracker} /> </Route>

          <Redirect exact from="/" to="/Login" />
        </Switch>
      </Router>
    </>
  );
}

export default App;
