export const Error404 = () => {
	const closeBack = () => {
		window.history.back();
	};
	return (
		<div className='w-full flex flex-col flex-wrap h-[50vh] items-center justify-center'>
			<h1 className='text-center text-4xl font-bold mb-10'>
				404 - Página no encontrada
			</h1>
			<p className='text-xl font-semibold'>
				Lo sentimos, la página que buscas no existe.
			</p>
			<button onClick={closeBack} className='mt-20 btnprimary'>
				<i className=' pi pi-chevron-left w-[40px]'></i>Volver
			</button>
		</div>
	);
};
