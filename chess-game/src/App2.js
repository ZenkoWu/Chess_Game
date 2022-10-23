import React, {useEffect} from 'react';
import {Routes, Route, BrowserRouter, Outlet} from 'react-router-dom';
import {SnackbarProvider} from "notistack";
import moment from "moment";
import {useTranslation} from "react-i18next";
import "moment/locale/ru";
import "moment/locale/en-gb";
import {useDispatch} from "react-redux";
import {initAuth} from "./redux/actions/auth";

import PageNotFound from './pages/PageNotFound/PageNotFound'
import Navbar from "./components/Navbar/Navbar";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";

import LogisticsStorage from "./pages/Logistics/LogisticsStorage";
import LogisticsWaybills from "./pages/Logistics/LogisticsWaybills";
import Logistics from "./pages/Logistics/Logistics";
import Guide from "./pages/Guide/Guide";
import Values from "./pages/Guide/Values/Values";
import Transport from "./pages/Guide/Transport/Transport";
import MaterialTypes from "./pages/Guide/Values/MaterialTypes/MaterialTypes";
import Materials from "./pages/Guide/Values/Materials/Materials";
import CarModels from "./pages/Guide/Transport/CarModels/CarModels";
import CarMachines from "./pages/Guide/Transport/CarMachines/CarMachines";
import Staff from "./pages/Guide/Administrative/Staff/Staff";
import Administrative from "./pages/Guide/Administrative/Administrative";
import Measures from "./pages/Guide/Values/Measures/Measures";
import Organizations from "./pages/Guide/Administrative/Organizations/Organizations";
import Users from "./pages/Guide/Administrative/Users/Users";
import Branches from "./pages/Guide/Administrative/Branches/Branches";
import FuelTypes from "./pages/Guide/Transport/FuelTypes/FuelTypes";
import Fields from "./pages/Fields/Fields";
import Warehouses from "./pages/Guide/Warehouses/Warehouses/Warehouses";
import Report from "./pages/Reports/Report/Report";
import Monitoring from "./pages/Monitoring/Monitoring";
import Test from "./pages/Test/Test";
import CarMachinesGroups from "./pages/Guide/Transport/CarMachinesGroups/CarMachinesGroups";
import Reports from "./pages/Reports/Reports";
import Dashboard from "./pages/Reports/Dashboard/Dashboard";
import CarTypes from "./pages/Guide/Transport/CarTypes/CarTypes";
import WarehousesHome from "./pages/Guide/Warehouses/WarehousesHome";
import WarehousesGroups from "./pages/Guide/Warehouses/WarehousesGroups/WarehousesGroups";

export default function App() {
    const dispatch = useDispatch()
    const {i18n} = useTranslation();
    const {t} = useTranslation();

    useEffect(() => {
        let defaultLang = localStorage.getItem('lang') || 'ru'
        i18n.changeLanguage(defaultLang);
        moment.locale(defaultLang) // en or ru
        dispatch(initAuth('vesa'))
    }, []);

    const navbarTree = {
        vesa: (lk, isLogged, isHUser) => [

            ...(isLogged ? [
                {title: t(lk + "monitoring"), key: "monitoring", icon: "fas fa-map-marked-alt", hideBreadCrumbs: true},

                {title: t(lk + "logistics"), key: "logistics", icon: "fas fa-truck", disableStraightRedirect: true, items: [
                        {title: t(lk + "registry"), key: "logistics/registry", icon: "fas fa-truck"},
                        {title: t(lk + "storage"),  key: "logistics/storage",  icon: "fas fa-warehouse"},
                    ]
                },

                {title: t(lk + "reports"), key: "reports", icon: "fas fa-file-alt", disableStraightRedirect: true, items: [
                        {title: t(lk + "report"), key: "reports/report", icon: "fas fa-file-alt"},
                        {title: t(lk + "dashboard"),  key: "reports/dashboard",  icon: "fas fa-chart-bar"},
                    ]
                },

                {title: t(lk + "fields"), key: "fields", icon: "fas fa-draw-polygon", hideBreadCrumbs: true},

                {title: t(lk + "guide"), key: "guide", icon: "fas fa-book", disableStraightRedirect: true, items: [
                        {title: t(lk + "values"), key: "guide/values", icon: "fas fa-coins", items: [
                                {title: t(lk + "materials"),  key: "guide/values/materials",  icon: "fas fa-boxes"},
                                {title: t(lk + "materialTypes"),  key: "guide/values/materialTypes",  icon: "fas fa-boxes"},
                                {title: t(lk + "measure"),  key: "guide/values/measure",  icon: "fas fa-balance-scale-left"},
                            ]
                        },
                        {title: t(lk + "transport"), key: "guide/transport", icon: "fas fa-truck-monster", items: [
                                {title: t(lk + "carMachinesGroups"),  key: "guide/transport/carMachinesGroups",  icon: "fas fa-indent"},
                                {title: t(lk + "carMachines"),  key: "guide/transport/carMachines",  icon: "fas fa-truck-monster"},
                                {title: t(lk + "carModels"),  key: "guide/transport/carModels",  icon: "fas fa-asterisk"},
                                {title: t(lk + "carTypes"),  key: "guide/transport/carTypes",  icon: "fas fa-asterisk"},
                                {title: t(lk + "fuelTypes"),  key: "guide/transport/fuelTypes",  icon: "fas fa-gas-pump"},
                            ]
                        },
                        {title: t(lk + "admin"), key: "guide/admin", icon: "fas fa-coffee", items: [
                                {title: t(lk + "organizations"),  key: "guide/admin/organizations",  icon: "fas fa-building"},
                                {title: t(lk + "branches"),  key: "guide/admin/branches",  icon: "fas fa-code-branch"},
                                {title: t(lk + "users"),  key: "guide/admin/users",  icon: "fas fa-user"},
                                {title: t(lk + "staff"),  key: "guide/admin/staff",  icon: "fas fa-user-cog"},
                            ]
                        },
                        {title: t(lk + "warehouses"),  key: "guide/warehouses",  icon: "fas fa-warehouse", items: [
                                {title: t(lk + "warehouses"),  key: "guide/warehouses/warehouses",  icon: "fas fa-warehouse"},
                                {title: t(lk + "warehousesGroups"),  key: "guide/warehouses/warehousesGroups",  icon: "fas fa-asterisk"},
                            ]
                        },
                    ].map(el => ({...el, disableStraightRedirect: true}))
                },
            ] : [null])
        ].filter(el => el)
    }

    return (
        <BrowserRouter>
            <SnackbarProvider maxSnack={10}>
                <div className="App" style={{minHeight: "100vh", backgroundColor: "#eee"}}>

                    <div style={{backgroundColor: "#eee"}}>
                        <Routes>

                            <Route path="auth" element={<Auth lk="vesa.auth." projKey="vesa" blur="2px" logoBgClass="bg-dark" minWidth="43vw" redirectTo="/reports/dashboard"/>}/>

                            <Route path="*" element={<Navbar projKey="vesa" makeTree={navbarTree.vesa} lk="vesa.navbar."/>}>

                                <Route path="" element={<Home makeBreadCrumbsTree={(isLogged, isHUser) => navbarTree.vesa("vesa.navbar.", isLogged, isHUser)}/>}>

                                    <Route path="test" element={<Test/>}/>

                                    <Route path="fields" element={<Fields/>}/>
                                    <Route path="monitoring" element={<Monitoring/>}/>

                                    <Route path="reports" element={<Reports/>}>
                                        <Route path="report" element={<Report/>}/>
                                        <Route path="dashboard" element={<Dashboard/>}/>
                                        <Route path="*" element={<PageNotFound main="/"/>}/>
                                    </Route>

                                    <Route path="logistics" element={<Logistics/>}>
                                        <Route path="registry" element={<LogisticsWaybills/>}/>
                                        <Route path="storage" element={<LogisticsStorage/>}/>
                                        <Route path="*" element={<PageNotFound main="/"/>}/>
                                    </Route>

                                    <Route path="guide" element={<Guide/>}>
                                        <Route path="values" element={<Values/>}>
                                            <Route path="materials" element={<Materials/>}/>
                                            <Route path="materialTypes" element={<MaterialTypes/>}/>
                                            <Route path="measure" element={<Measures/>}/>
                                            <Route path="*" element={<PageNotFound main="/"/>}/>
                                        </Route>

                                        <Route path="transport" element={<Transport/>}>
                                            <Route path="carMachinesGroups" element={<CarMachinesGroups/>}/>
                                            <Route path="carMachines" element={<CarMachines/>}/>
                                            <Route path="carModels" element={<CarModels/>}/>
                                            <Route path="carTypes" element={<CarTypes/>}/>
                                            <Route path="fuelTypes" element={<FuelTypes/>}/>
                                            <Route path="*" element={<PageNotFound main="/"/>}/>
                                        </Route>

                                        <Route path="admin" element={<Administrative/>}>
                                            <Route path="organizations" element={<Organizations/>}/>
                                            <Route path="users" element={<Users/>}/>
                                            <Route path="branches" element={<Branches/>}/>
                                            <Route path="staff" element={<Staff/>}/>
                                            <Route path="*" element={<PageNotFound main="/"/>}/>
                                        </Route>

                                        <Route path="warehouses" element={<WarehousesHome/>}>
                                            <Route path="warehouses" element={<Warehouses/>}/>
                                            <Route path="warehousesGroups" element={<WarehousesGroups/>}/>
                                        </Route>

                                        <Route path="*" element={<PageNotFound main="/"/>}/>
                                    </Route>

                                    <Route path="*" element={<PageNotFound main="/"/>}/>
                                </Route>

                                <Route path="*" element={<PageNotFound main="/"/>}/>
                            </Route>

                        </Routes>
                    </div>
                </div>
            </SnackbarProvider>
        </BrowserRouter>
    );
}