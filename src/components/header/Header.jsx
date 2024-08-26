import { useState } from 'react';
import { DateTime } from './Date';
import { useAuth } from '../../hooks/useAuth';
import { Button } from 'primereact/button';
import Navbar from '../adminDashboard/Navbar';

export function Header() {
	const { loggedUser } = useAuth();
	const [visible, setVisible] = useState(false);

	const handleMouseEnter = () => {
		if (loggedUser) {
			setVisible(true);
		}
	};

	const handleMouseLeave = () => {
		setVisible(false);
	};

	return (
		<header className='relative bg-background text-white'>
			<section className='flex items-center justify-center sm:justify-between flex-wrap flex-row sm:pb-0 px-4 mx-auto'>
				<div
					className='flex items-center justify-center'
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}>
					<Button className='hover:opacity-80 duration-200 my-3'>
						<img src='/CONSTRUCTOR.png' alt='' width={100} />
					</Button>
					{loggedUser && (
						<div
							onMouseEnter={handleMouseEnter}
							onMouseLeave={handleMouseLeave}>
							<Navbar
								visible={visible}
								onHide={() => setVisible(false)}
							/>
						</div>
					)}
				</div>
				<div className='text-black font-semibold flex flex-col text-center flex-wrap items-center'>
					<DateTime />
				</div>
			</section>
		</header>
	);
}
