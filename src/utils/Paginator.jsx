/* eslint-disable react/prop-types */
import { Paginator } from 'primereact/paginator';
import '../styles/Custom.css'
const PaginatorComponent = ({
	first,
	rows,
	totalRecords,
	onPageChange,
	rowsPerPageOptions = [10, 20, 30],
}) => {
	return (
		<Paginator
			first={first}
			rows={rows}
			totalRecords={totalRecords}
			rowsPerPageOptions={rowsPerPageOptions}
			onPageChange={onPageChange}
			className='pt-4 bg-background text-black'
		/>
	);
};

export default PaginatorComponent;
