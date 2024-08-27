import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Header } from '../src/components/header/Header';
import { Footer } from '../src/components/home/Footer';
import { About } from '../src/pages/About';
import { Home } from '../src/pages/Home';
import { AdminDashboard } from '../src/pages/admin/AdminDashboard';
import { PrivateRoute } from './PrivateRoute';
import { Register } from '../src/components/home/Register';
import { Tools } from '../src/pages/admin/Tools';
import { Employees } from '../src/pages/admin/Employees';
import { PricesBank } from '../src/pages/admin/PricesBank';
import { Business } from '../src/pages/admin/business';
import { Budgets } from '../src/pages/admin/Budgets';
import { Clients } from '../src/pages/admin/Clients';
import { Proyects } from '../src/pages/admin/Proyects';
import { EditProfile } from '../src/components/adminDashboard/navbar/EditProfile';
import { Config } from '../src/components/adminDashboard/employees/config/Config';
import { Attendance } from '../src/components/adminDashboard/employees/attendance/Attendance';
import { Salary } from '../src/components/adminDashboard/employees/salary/Salary';

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path='/' element={<Home />}></Route>
				<Route path='/home' element={<Home />}></Route>
				<Route path='/about' element={<About />}></Route>
				<Route path='/register' element={<Register />}></Route>

				<Route path='/admin' element={<AdminDashboard />}></Route>
				<Route path='/proyects' element={<Proyects />}></Route>
				<Route path='/clients' element={<Clients />}></Route>
				<Route path='/budgets' element={<Budgets />}></Route>
				<Route path='/business' element={<Business />}></Route>
				<Route path='/pricesbank' element={<PricesBank />}></Route>
				<Route path='/employees' element={<Employees />}></Route>
				<Route path='/tools' element={<Tools />}></Route>
				<Route path='/profile' element={<EditProfile />}></Route>
				<Route path='/employees/config' element={<Config />}></Route>
				<Route
					path='/employees/attendance'
					element={<Attendance />}></Route>
				<Route path='/employees/salary' element={<Salary />}></Route>

				<Route element={<PrivateRoute />}></Route>
			</Routes>
			<Footer />
		</BrowserRouter>
	);
};
