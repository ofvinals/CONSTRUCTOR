import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '../src/components/header/Header';
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
import { Board } from '../src/components/adminDashboard/tools/board/Board';
import { Finance } from '../src/components/adminDashboard/business/finance/Finance';
import { Archived } from '../src/components/adminDashboard/business/archived/Archived';
import { Info } from '../src/components/adminDashboard/business/info/Info';
import { ProyectDetail} from '../src/pages/admin/ProyectDetail';
import { Docs } from '../src/components/adminDashboard/proyects/proyectDetails/docs/Docs';
import { Notes } from '../src/components/adminDashboard/proyects/proyectDetails/notes/Notes';
import { Certs } from '../src/components/adminDashboard/proyects/proyectDetails/certs/Certs';
import { Subcontracts } from '../src/components/adminDashboard/proyects/proyectDetails/subcontracts/Subcontracts';

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
								<Route
									path='/proyects/budget/:budgetId'
									element={<ProyectDetail />}
								/>
								<Route path='/proyects/docs' element={<Docs />} />
								<Route path='/proyects/notes' element={<Notes />} />
								<Route path='/proyects/certs' element={<Certs />} />
								<Route
									path='/proyects/subcontracts'
									element={<Subcontracts />}
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
								<Route path='/employees/loan' element={<Loan />} />
								<Route path='/tools' element={<Tools />} />
								<Route path='/tools/stock' element={<Tools />} />
								<Route path='/tools/locations' element={<Board />} />
								<Route path='/business' element={<Business />} />
								<Route path='/business/info' element={<Info />} />
								<Route path='/business/finance' element={<Finance />} />
								<Route
									path='/business/archived'
									element={<Archived />}
								/>
							</Route>

							{/* Ruta para usuarios no autorizados */}
							<Route path='/unauthorized' element={<Unauthorized />} />

							{/* Ruta para 404 - Página no encontrada */}
							<Route path='*' element={<Error404 />} />
						</Routes>
					</main>
				</div>
			</div>
		</BrowserRouter>
	);
};
