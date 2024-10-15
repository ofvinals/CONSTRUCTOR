/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import FileUploader from './FileUploader';
import '../../../../../styles/Custom.css';
import { useProyectActions } from '../../../../../hooks/useProyectActions';

export const Docs = () => {
	const { getDocuments, createDocs, docs } = useProyectActions();

	useEffect(() => {
		const dataDocuments = async () => {
			await getDocuments();
		};
		dataDocuments();
	}, []);

	const handleFileChange = async (event) => {
		const selectedFiles = Array.from(event.target.files);
		// Iterar sobre cada archivo y subirlo
		for (const file of selectedFiles) {
			// Llamar a la acción createDocs para subir el archivo
			await createDocs({ file });
		}
	};

	const triggerFileInput = () => {
		document.getElementById('file-input').click();
	};

	return (
		<div>
			<div className='flex flex-row items-center justify-between mr-2'>
				<h1 className='title'>Documentacion del Proyecto</h1>
				<button
					type='button'
					className='btnprimary '
					onClick={triggerFileInput}>
					<i className='pi pi-plus font-bold mr-2'></i>
					Adjuntar archivos
				</button>
				<input
					id='file-input'
					type='file'
					multiple
					onChange={handleFileChange}
					style={{ display: 'none' }}
				/>
			</div>
			<div>
				<FileUploader files={docs} />
			</div>
		</div>
	);
};
