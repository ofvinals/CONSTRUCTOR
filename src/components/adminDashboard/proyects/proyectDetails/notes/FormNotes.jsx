/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import {
	FormInput,
	SaveButton,
	CancelButton,
} from '../../../../../utils/Form.jsx';
import { useForm, useFieldArray } from 'react-hook-form';
import { useProyectNotesActions } from '../../../../../hooks/useProyectNotesActions.js';
import Loader from '../../../../../utils/Loader.jsx';

export const FormNotes = ({
	noteId,
	onClose,
	mode,
	loggedUser,
	budget,
	proyectId,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			date: new Date().toISOString().split('T')[0],
			noteAsistant: [{ name: '' }],
			noteThemes: [{ asunto: '', estado: 'pendiente', responsable: '' }],
		},
	});

	const {
		note,
		noteStatus,
		createNote,
		getNote,
		updateNote,
		noteStatusUpdate,
	} = useProyectNotesActions();

	// Manejo de asistentes (noteAsistant) con useFieldArray
	const {
		fields: assistants,
		append: addAssistant,
		remove: removeAssistant,
	} = useFieldArray({
		control,
		name: 'noteAsistant',
	});

	// Manejo de temas (noteThemes) con useFieldArray
	const {
		fields: themes,
		append: addTheme,
		remove: removeTheme,
	} = useFieldArray({
		control,
		name: 'noteThemes',
	});

	useEffect(() => {
		if (mode === 'edit' || mode === 'view') {
			getNote({ proyectId, noteId });
		}
	}, [noteId]);

	useEffect(() => {
		if (budget && budget.proyectName) {
			setValue('proyectName', budget.proyectName);
			setValue('noteAuthor', loggedUser.displayName);
		}
		if (note && (mode === 'edit' || mode === 'view')) {
			setValue('date', note.date);
			setValue('noteNum', note.noteNum);
			setValue('noteTitle', note.noteTitle);
			setValue('noteAsistant', note.noteAsistant || [{ name: '' }]);
			setValue(
				'noteThemes',
				note.noteThemes || [
					{ asunto: '', estado: 'pendiente', responsable: '' },
				]
			);
		}
	}, [note]);

	const onSubmit = handleSubmit(async (values) => {
		console.log(values);
		try {
			if (mode === 'edit') {
				console.log(proyectId, noteId, values);
				await updateNote({ proyectId, noteId, values });
				onClose();
			} else if (mode === 'create') {
				console.log(proyectId, values);
				await createNote({ proyectId, values });
				onClose();
			}
		} catch (error) {
			console.error('Error al editar el acta:', error);
		}
	});

	if (noteStatus === 'Cargando' || noteStatusUpdate === 'Cargando') {
		return <Loader />;
	}

	return (
		<div>
			<Form
				onSubmit={onSubmit}
				className='flex flex-wrap justify-around items-center'>
				<FormInput
					label='Fecha'
					name='date'
					type='date'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'La fecha es obligatoria.',
						},
					}}
					readOnly={mode === 'view'}
				/>

				<FormInput
					label='Nombre del Proyecto'
					name='proyectName'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					readOnly={true}
				/>

				<FormInput
					label='Autor'
					name='noteAuthor'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					readOnly={true}
				/>

				<FormInput
					label='Tematica / Titulo'
					name='noteTitle'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El titulo del acta es obligatorio',
						},
					}}
					readOnly={mode === 'view'}
				/>

				{/* Asistentes (noteAsistant) */}
				<div className='w-full border-t-2 border-b-2 border-gray-400'>
					<label className=' flex items-center justify-center text-center font-semibold'>
						Asistentes
					</label>
					{assistants.map((assistant, index) => (
						<div
							key={assistant.id}
							className='flex flex-row flex-wrap items-center'>
							<FormInput
								name={`noteAsistant.${index}.name`}
								type='text'
								register={register}
								errors={errors}
								mode={mode}
								readOnly={mode === 'view'}
								options={{
									required: {
										value: true,
										message: 'Los asistentes son obligatorios',
									},
								}}
							/>
							{mode !== 'view' && (
								<button
									type='button'
									onClick={() => removeAssistant(index)}
									className='ml-2'>
									<i className='pi pi-trash text-xl font-semibold text-red-500 p-2 rounded-md hover:bg-red-200'></i>
								</button>
							)}
						</div>
					))}
					<div className='flex flex-row items-center justify-center'>
						{mode !== 'view' && (
							<button
								type='button'
								onClick={() => addAssistant({ name: '' })}
								className='mt-2 hover:bg-yellow-100 rounded-md p-2 '>
								<i className='pi pi-user-plus text-xl font-semibold text-green-500 mr-2'></i>
								Agregar asistentes
							</button>
						)}
					</div>
				</div>

				{/* Temas (noteThemes) */}
				<div className='w-full border-b-2 border-gray-400 my-2'>
					<label className=' flex items-center justify-center text-center font-semibold text-lg'>
						Asuntos tratados
					</label>
					{themes.map((theme, index) => (
						<div key={theme.id} className=' items-center'>
							<div className='w-full'>
								<label htmlFor={`noteThemes.${index}.asunto`}>
									Asunto
								</label>
								<textarea
									id={`noteThemes.${index}.asunto`}
									{...register(`noteThemes.${index}.asunto`, {
										required: 'Este campo es obligatorio',
									})}
									className={`form-control ${
										errors?.noteThemes?.[index]?.asunto
											? 'is-invalid'
											: ''
									}`}
									readOnly={mode === 'view'}
									style={{ width: '100%' }}
									rows={4}
								/>
								{errors?.noteThemes?.[index]?.asunto && (
									<div className='invalid-feedback'>
										{errors.noteThemes[index].asunto.message}
									</div>
								)}
							</div>
							<div className='flex flex-row items-center justify-around'>
								<FormInput
									name={`noteThemes.${index}.responsable`}
									label='Responsable'
									type='text'
									register={register}
									errors={errors}
									mode={mode}
									readOnly={mode === 'view'}
									options={{
										required: {
											value: true,
											message: 'El responsable es obligatorio',
										},
									}}
								/>
								<div className='w-fit'>
									<label
										className='ml-2'
										htmlFor={`noteThemes.${index}.estado`}>
										Estado
									</label>
									<Form.Select
										{...register(`noteThemes.${index}.estado`)}
										id={`noteThemes.${index}.estado`}
										className='ml-2 w-fit'
										disabled={mode === 'view'}>
										<option value='pendiente'>Pendiente</option>
										<option value='encurso'>En curso</option>
										<option value='terminado'>Terminado</option>
									</Form.Select>
								</div>
								{mode !== 'view' && (
									<button
										type='button'
										onClick={() => removeTheme(index)}
										className='ml-2'>
										<i className='pi pi-trash text-xl mt-4 font-semibold text-red-500 p-2 rounded-md hover:bg-red-200'></i>
									</button>
								)}
							</div>
						</div>
					))}
					<div className='flex flex-row items-center justify-center'>
						{mode !== 'view' && (
							<button
								type='button'
								onClick={() =>
									addTheme({
										asunto: '',
										estado: 'pendiente',
										responsable: '',
									})
								}
								className='my-2 hover:bg-yellow-100 rounded-md p-2 '>
								<i className='pi pi-plus text-xl font-semibold text-green-500 mr-2'></i>
								Agregar Tema
							</button>
						)}
					</div>
				</div>
				<Form.Group className='flex flex-wrap items-center w-full justify-around'>
					{mode !== 'view' && (
						<SaveButton
							onSubmit={onSubmit}
							label={
								mode === 'create' ? 'Registrar Acta' : 'Guardar Cambios'
							}
						/>
					)}
					<CancelButton
						onClose={onClose}
						label={mode === 'view' ? 'Volver' : 'Cancelar'}
					/>
				</Form.Group>
			</Form>
		</div>
	);
};
