import { useNavigate } from 'react-router-dom';

export const createItemsNavbar = (setVisible, setActiveItem, activeItem) => {
	const navigate = useNavigate();

	return [
		{
			label: (
				<>
					<span
						className={`pi pi-dollar ${
							activeItem === 'Presupuestos'
								? 'bg-[#ffd52b] p-2 rounded-lg'
								: ''
						}`}
					/>
					<span
						className={`ml-2 ${
							activeItem === 'Presupuestos' ? 'font-bold' : ''
						}`}>
						Presupuestos
					</span>
				</>
			),
			className: 'p-3 pb-4 hover:font-bold text-black',
			command: () => {
				setActiveItem('Presupuestos');
				navigate('/budgets');
				setVisible(false);
			},
		},
		{
			label: (
				<>
					<span
						className={`pi pi-objects-column ${
							activeItem === 'Proyectos'
								? 'bg-[#ffd52b] p-2 rounded-lg'
								: ''
						}`}
					/>
					<span
						className={`ml-2 ${
							activeItem === 'Proyectos' ? 'font-bold' : ''
						}`}>
						Proyectos
					</span>
				</>
			),
			className: 'p-3 pb-4 hover:font-bold text-black',
			command: () => {
				setActiveItem('Proyectos');
				navigate('/proyects');
				setVisible(false);
			},
		},
		{
			label: (
				<>
					<span
						className={`pi pi-users ${
							activeItem === 'Recursos Humanos'
								? 'bg-[#ffd52b] p-2 rounded-lg'
								: ''
						}`}
					/>
					<span
						className={`ml-2 ${
							activeItem === 'Recursos Humanos' ? 'font-bold' : ''
						}`}>
						Recursos Humanos
					</span>
				</>
			),
			className: 'p-3 pb-4 hover:font-bold text-black',
			command: () => {
				setActiveItem('Recursos Humanos');
				navigate('/employees');
				setVisible(false);
			},
		},
		{
			label: (
				<>
					<span
						className={`pi pi-database ${
							activeItem === 'Banco de Precios'
								? 'bg-[#ffd52b] p-2 rounded-lg'
								: ''
						}`}
					/>
					<span
						className={`ml-2 ${
							activeItem === 'Banco de Precios' ? 'font-bold' : ''
						}`}>
						Banco de Precios
					</span>
				</>
			),
			className: 'p-3 pb-4 hover:font-bold text-black',
			command: () => {
				setActiveItem('Banco de Precios');
				navigate('/pricesbank');
				setVisible(false);
			},
		},
		{
			label: (
				<>
					<span
						className={`pi pi-address-book ${
							activeItem === 'Clientes'
								? 'bg-[#ffd52b] p-2 rounded-lg'
								: ''
						}`}
					/>
					<span
						className={`ml-2 ${
							activeItem === 'Clientes' ? 'font-bold' : ''
						}`}>
						Clientes
					</span>
				</>
			),
			className: 'p-3 pb-4 hover:font-bold text-black',
			command: () => {
				setActiveItem('Clientes');
				navigate('/clients');
				setVisible(false);
			},
		},
		{
			label: (
				<>
					<span
						className={`pi pi-chart-bar ${
							activeItem === 'Gestion de Empresa'
								? 'bg-[#ffd52b] p-2 rounded-lg'
								: ''
						}`}
					/>
					<span
						className={`ml-2 ${
							activeItem === 'Gestion de Empresa' ? 'font-bold' : ''
						}`}>
						Gestion de Empresa
					</span>
				</>
			),
			className: 'p-3 pb-4 hover:font-bold text-black',
			command: () => {
				setActiveItem('Gestion de Empresa');
				navigate('/business');
				setVisible(false);
			},
		},
		{
			label: (
				<>
					<span
						className={`pi pi-hammer ${
							activeItem === 'Herramientas'
								? 'bg-[#ffd52b] p-2 rounded-lg'
								: ''
						}`}
					/>
					<span
						className={`ml-2 ${
							activeItem === 'Herramientas' ? 'font-bold' : ''
						}`}>
						Herramientas
					</span>
				</>
			),
			className: 'p-3 pb-4 hover:font-bold text-black',
			command: () => {
				setActiveItem('Herramientas');
				navigate('/tools');
				setVisible(false);
			},
		},
	];
};
