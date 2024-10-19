/* eslint-disable react/prop-types */
import { Card } from 'primereact/card';
import { PrimeIcons } from 'primereact/api';

export const FileCard = ({ file, onDownload, onDelete }) => {
	const handleOpen = () => {
		window.open(file.url, '_blank');
	};

	const getFileIcon = (file) => {
		const fileExtension = file.name.split('.').pop().toLowerCase();

		switch (fileExtension) {
			case 'pdf':
				return (
					<i
						className={PrimeIcons.FILE_PDF}
						style={{ fontSize: '2em', color: 'red' }}
					/>
				);
			case 'doc':
			case 'docx':
				return (
					<i
						className={PrimeIcons.FILE_WORD}
						style={{ fontSize: '2em', color: 'blue' }}
					/>
				);
			case 'jpg':
			case 'jpeg':
			case 'png':
				return (
					<i
						className={PrimeIcons.FILE_IMAGE}
						style={{ fontSize: '2em', color: 'green' }}
					/>
				);
			default:
				return (
					<i
						className={PrimeIcons.FILE}
						style={{ fontSize: '2em', color: 'gray' }}
					/>
				);
		}
	};

	return (
		<Card className='w-[150px] h-[200px] flex flex-col border-2 border-[#ffd52b] justify-center rounded-xl m-2'>
			<div className='mb-2 text-4xl flex items-center justify-center'>
				<button
					type='button'
					className='mb-2 text-2xl flex items-center justify-center'
					onClick={handleOpen}>
					{getFileIcon(file)}
				</button>
			</div>
			<h3 className='font-semibold text-center text-sm h-[80px] w-[114px] overflow-hidden text-ellipsis line-clamp-2'>
				{file.name}
			</h3>
			<div className='flex flex-wrap items-center justify-around flex-row'>
				<button type='button' onClick={() => onDownload(file)}>
					<i className='pi pi-download text-xl p-2 font-semibold text-blue-500 hover:bg-blue-200 hover:rounded-md '></i>
				</button>
				<button type='button' onClick={() => onDelete(file)}>
					<i className='pi pi-trash text-xl p-2 font-semibold text-red-500 hover:bg-red-200 hover:rounded-md'></i>
				</button>
			</div>
		</Card>
	);
};
