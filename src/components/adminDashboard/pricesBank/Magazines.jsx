import { Link } from 'react-router-dom';

export const Magazines = () => {
	return (
		<div>
			<h1 className='title'>Banco de Precios</h1>
			<div className='flex flex-col items-center justify-center space-y-12'>
				<h2 className='text-2xl font-semibold mt-3'>Link de Revistas</h2>
				<div className='gap-4 flex flex-col flex-wrap items-center border-1 border-slate-500 justify-center rounded-md mb-5 px-4 py-5 mx-2 bg-white'>
					<Link
						to='https://arquitecturayconstrucciondigital.com'
						target='_Blank'
						className=' flex flex-row font-semibold items-center rounded-md hover:bg-[#ffd52b]  bg-yollow-0 border-1 border-slate-400 text-center justify-between px-3 py-3 w-[350px] '>
						<img
							src='/logoArqyConst.png'
							width={100}
							alt=''
							className='mr-5 bg-black rounded-md'
						/>
						Revista Arquitectura y Construccion
						<i className='pi pi-angle-right text-xl ml-5'></i>
					</Link>
					<Link
						to='https://aycrevista.com.ar/'
						className='flex flex-row font-semibold items-center hover:bg-[#ffd52b] rounded-md bg-yollow-0 border-1 border-slate-400 text-center justify-between px-3 py-3 w-[350px] '>
						<img
							src='/aycrevista.png'
							width={100}
							alt=''
							className='mr-5 '
						/>
						Revista A y C
						<i className='pi pi-angle-right text-xl ml-5'></i>
					</Link>
				</div>
			</div>
		</div>
	);
};
