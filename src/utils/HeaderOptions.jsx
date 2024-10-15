const budgetId = localStorage.getItem('budgetId');

export const menuOptions = {
	'/employees': [
		{ label: 'Lista de Empleados', path: '/employees' },
		{ label: 'Control de Asistencia', path: '/employees/attendance' },
		{ label: 'Liquidacion de Sueldos', path: '/employees/salary' },
		{ label: 'Adelantos/Prestamos', path: '/employees/loan' },
		{
			label: '',
			path: '/employees/config',
			icon: <i className='pi pi-cog'></i>,
		},
	],
	'/employees/attendance': [
		{ label: 'Lista de Empleados', path: '/employees' },
		{ label: 'Control de Asistencia', path: '/employees/attendance' },
		{ label: 'Liquidacion de Sueldos', path: '/employees/salary' },
		{ label: 'Adelantos/Prestamos', path: '/employees/loan' },
		{
			label: '',
			path: '/employees/config',
			icon: <i className='pi pi-cog'></i>,
		},
	],
	'/employees/salary': [
		{ label: 'Lista de Empleados', path: '/employees' },
		{ label: 'Control de Asistencia', path: '/employees/attendance' },
		{ label: 'Liquidacion de Sueldos', path: '/employees/salary' },
		{ label: 'Adelantos/Prestamos', path: '/employees/loan' },
		{
			label: '',
			path: '/employees/config',
			icon: <i className='pi pi-cog'></i>,
		},
	],
	'/employees/loan': [
		{ label: 'Lista de Empleados', path: '/employees' },
		{ label: 'Control de Asistencia', path: '/employees/attendance' },
		{ label: 'Liquidacion de Sueldos', path: '/employees/salary' },
		{ label: 'Adelantos/Prestamos', path: '/employees/loan' },
		{
			label: '',
			path: '/employees/config',
			icon: <i className='pi pi-cog'></i>,
		},
	],
	'/pricesbank': [
		{ label: 'Mi Banco de Precios', path: '/pricesbank' },
		{ label: 'Link Revistas', path: '/pricesbank/magazine' },
	],
	'/pricesbank/magazine': [
		{ label: 'Mi Banco de Precios', path: '/pricesbank' },
		{ label: 'Link Revistas', path: '/pricesbank/magazine' },
	],
	'/proyects': [],
	'/proyects/budget': [
		{ label: 'Presupuesto', path: `/proyects/budget/${budgetId}` },
		{ label: 'Documentacion del Proyecto', path: '/proyects/docs' },
		{ label: 'Actas', path: '/proyects/notes' },
		{ label: 'Certificaciones', path: '/proyects/certs' },
		{ label: 'Historico de Certificaciones', path: '/proyects/historycerts' },
		{ label: 'Sub Contratistas', path: '/proyects/subcontracts' },
	],
	'/proyects/docs': [
		{ label: 'Presupuesto', path: '/proyects/budget' },
		{ label: 'Documentacion del Proyecto', path: '/proyects/docs' },
		{ label: 'Actas', path: '/proyects/notes' },
		{ label: 'Certificaciones', path: '/proyects/certs' },
		{ label: 'Historico de Certificaciones', path: '/proyects/historycerts' },
		{ label: 'Sub Contratistas', path: '/proyects/subcontracts' },
	],
	'/proyects/notes': [
		{ label: 'Presupuesto', path: '/proyects/budget' },
		{ label: 'Documentacion del Proyecto', path: '/proyects/docs' },
		{ label: 'Actas', path: '/proyects/notes' },
		{ label: 'Certificaciones', path: '/proyects/certs' },
		{ label: 'Historico de Certificaciones', path: '/proyects/historycerts' },
		{ label: 'Sub Contratistas', path: '/proyects/subcontracts' },
	],
	'/proyects/certs': [
		{ label: 'Presupuesto', path: '/proyects/budget' },
		{ label: 'Documentacion del Proyecto', path: '/proyects/docs' },
		{ label: 'Actas', path: '/proyects/notes' },
		{ label: 'Certificaciones', path: '/proyects/certs' },
		{ label: 'Historico de Certificaciones', path: '/proyects/historycerts' },
		{ label: 'Sub Contratistas', path: '/proyects/subcontracts' },
	],
	'/proyects/historycerts': [
		{ label: 'Presupuesto', path: '/proyects/budget' },
		{ label: 'Documentacion del Proyecto', path: '/proyects/docs' },
		{ label: 'Actas', path: '/proyects/notes' },
		{ label: 'Certificaciones', path: '/proyects/certs' },
		{ label: 'Historico de Certificaciones', path: '/proyects/historycerts' },
		{ label: 'Sub Contratistas', path: '/proyects/subcontracts' },
	],
	'/proyects/subcontracts': [
		{ label: 'Presupuesto', path: '/proyects/budget' },
		{ label: 'Documentacion del Proyecto', path: '/proyects/docs' },
		{ label: 'Actas', path: '/proyects/notes' },
		{ label: 'Certificaciones', path: '/proyects/certs' },
		{ label: 'Historico de Certificaciones', path: '/proyects/historycerts' },
		{ label: 'Sub Contratistas', path: '/proyects/subcontracts' },
	],
	'/tools': [
		{ label: 'Stock', path: '/tools/stock' },
		{ label: 'Ubicacion de Herramientas', path: '/tools/locations' },
	],
	'/tools/stock': [
		{ label: 'Stock', path: '/tools/stock' },
		{ label: 'Ubicacion de Herramientas', path: '/tools/locations' },
	],
	'/tools/locations': [
		{ label: 'Stock', path: '/tools/stock' },
		{ label: 'Ubicacion de Herramientas', path: '/tools/locations' },
	],
	'/business': [
		{ label: 'Info de Empresa', path: '/business/info' },
		{ label: 'Finanzas', path: '/business/finance' },
		{ label: 'Proyectos Archivados', path: '/business/archived' },
	],
	'/business/info': [
		{ label: 'Info de Empresa', path: '/business/info' },
		{ label: 'Finanzas', path: '/business/finance' },
		{ label: 'Proyectos Archivados', path: '/business/archived' },
	],
	'/business/finance': [
		{ label: 'Info de Empresa', path: '/business/info' },
		{ label: 'Finanzas', path: '/business/finance' },
		{ label: 'Proyectos Archivados', path: '/business/archived' },
	],
	'/business/archived': [
		{ label: 'Info de Empresa', path: '/business/info' },
		{ label: 'Finanzas', path: '/business/finance' },
		{ label: 'Proyectos Archivados', path: '/business/archived' },
	],
};
