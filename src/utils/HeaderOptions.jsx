//
export const menuOptions = {
	'/employees': [
		{ label: 'Lista de Empleados', path: '/employees' },
		{ label: 'Control de Asistencia', path: '/employees/attendance' },
		{ label: 'Liquidacion de Sueldos', path: '/employees/salary' },
		{
			label: '',
			path: '/employees/config',
			icon: <i className='pi pi-cog'></i>,
		},
	],
};
