import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '../src/components/header/Header';
import { Footer } from '../src/components/home/Footer';
import { About } from '../src/pages/home/About';
import { Home } from '../src/pages/Home';
import { AdminDashboard } from '../src/pages/admin/AdminDashboard';
import { Register } from '../src/pages/home/Register';
import { Tools } from '../src/pages/admin/Tools';
import { Employees } from '../src/pages/admin/Employees';
import { PricesBank } from '../src/pages/admin/PricesBank';
import { Business } from '../src/pages/admin/Business';
import { Budgets } from '../src/pages/admin/Budgets';
import { Clients } from '../src/pages/admin/Clients';
import { Proyects } from '../src/pages/admin/Proyects';
import { Magazines } from '../src/components/adminDashboard/pricesBank/Magazines';
import { SideNavbar } from '../src/components/adminDashboard/navbar/SideNavbar';
import { EditProfile } from '../src/components/adminDashboard/navbar/EditProfile';
import { Config } from '../src/components/adminDashboard/employees/config/Config';
import { Attendance } from '../src/pages/admin/employees/Attendance';
import { Salary } from '../src/pages/admin/employees/Salary';
import { ClientDashboard } from '../src/pages/client/ClientDashboard';
import PrivateRoute from './PrivateRoute';
import { Unauthorized } from '../src/pages/Unauthorized';
import { Error404 } from '../src/pages/Error404';
import { Loan } from '../src/pages/admin/employees/Loan';
import { BudgetDetail } from '../src/pages/admin/BudgetDetail';

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<div className='flex'>
				<div className=''>
					<SideNavbar />
				</div>
				<div className='flex flex-col flex-grow w-full'>
					<Header />
					<main className='flex-grow overflow-auto'>
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/home' element={<Home />} />
							<Route path='/about' element={<About />} />
							<Route path='/register' element={<Register />} />

							{/* Rutas accesibles para todos los usuarios autenticados */}
							<Route element={<PrivateRoute isAdminRequired={false} />}>
								<Route path='/client' element={<ClientDashboard />} />
								<Route path='/profile' element={<EditProfile />} />
								<Route path='/proyects' element={<Proyects />} />
								<Route path='/proyects/budget' element={<Proyects />} />
								<Route path='/proyects/docs' element={<Proyects />} />
								<Route path='/proyects/certs' element={<Proyects />} />
								<Route
									path='/proyects/historycerts'
									element={<Proyects />}
								/>
								<Route
									path='/proyects/subcontracts'
									element={<Proyects />}
								/>
							</Route>

							{/* Rutas accesibles solo para administradores */}
							<Route element={<PrivateRoute isAdminRequired={true} />}>
								<Route path='/admin' element={<AdminDashboard />} />
								<Route path='/clients' element={<Clients />} />
								<Route path='/budgets' element={<Budgets />} />
								<Route
									path='/budget/:budgetId'
									element={<BudgetDetail />}
								/>
								<Route path='/business' element={<Business />} />
								<Route path='/pricesbank' element={<PricesBank />} />
								<Route
									path='/pricesbank/magazine'
									element={<Magazines />}
								/>
								<Route path='/employees' element={<Employees />} />
								<Route path='/employees/config' element={<Config />} />
								<Route
									path='/employees/attendance'
									element={<Attendance />}
								/>
								<Route path='/employees/salary' element={<Salary />} />
								<Route path='/employees/loan' element={<Loan />} /> s
								<Route path='/tools' element={<Tools />} />
							</Route>

							{/* Ruta para usuarios no autorizados */}
							<Route path='/unauthorized' element={<Unauthorized />} />

							{/* Ruta para 404 - Página no encontrada */}
							<Route path='*' element={<Error404 />} />
						</Routes>
					</main>
					<Footer />
				</div>
			</div>
		</BrowserRouter>
	);
};
