import { useState } from 'react';
import PaginatorComponent from '../../../../../utils/Paginator';
import { FileCard } from './FileCard';
import ConfirmDialog from '../../../../../utils/ConfirmDialog';
import { useProyectActions } from '../../../../../hooks/useProyectActions';
import Loader from '../../../../../utils/Loader';

const FileUploader = () => {
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(10);
	const [fileToDelete, setFileToDelete] = useState(null);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const { deleteDocs, docsStatus, docs } = useProyectActions();

	const handleDownload = async (file) => {
		try {
			const response = await fetch(file.url, { mode: 'no-cors' });
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = file.name;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error al descargar el archivo:', error);
		}
	};

	const handleDelete = (file) => {
		setFileToDelete(file);
		setShowConfirmDialog(true);
	};

	const confirmDelete = async () => {
		if (fileToDelete) {
			setShowConfirmDialog(false);
			await deleteDocs({ file: fileToDelete.name });
			setFileToDelete(null);
		}
	};

	const onPageChange = (event) => {
		setFirst(event.first);
		setRows(event.rows);
	};
	console.log(docs);
	const paginatedDocs =
		docs && docs.length > 0 ? docs.slice(first, first + rows) : null;

	if (docsStatus === 'Cargando') {
		return <Loader />;
	}

	return (
		<div className='pt-4 flex flex-col items-center bg-background'>
			<div className='flex flex-row flex-wrap items-center justify-around'>
				{paginatedDocs && paginatedDocs.length > 0 ? (
					paginatedDocs.map((file, index) => (
						<FileCard
							key={index}
							file={file}
							onDownload={handleDownload}
							onDelete={handleDelete}
						/>
					))
				) : (
					<div className='text-xl font-semibold'>
						El proyecto no tiene documentacion
					</div>
				)}
			</div>
			<PaginatorComponent
				first={first}
				rows={rows}
				totalRecords={docs?.length}
				onPageChange={onPageChange}
			/>
			<ConfirmDialog
				header='Confirmar Eliminacion'
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				onConfirm={confirmDelete}
				message='¿Estás seguro que quieres eliminar el archivo?'
			/>
		</div>
	);
};

export default FileUploader;
