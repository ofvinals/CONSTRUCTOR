/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import {
	FormInput,
	SaveButton,
	CancelButton,
} from '../../../../utils/Form.jsx';
import { useForm } from 'react-hook-form';
import { useBusinessActions } from '../../../../hooks/useBusinessActions.js';
import Loader from '../../../../utils/Loader.jsx';

export const FormBankInfo = ({ id, onClose, mode }) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const {
		business,
		businessStatus,
		createBankAccount,
		updateBankAccount,
		businessStatusUpdate,
	} = useBusinessActions();

	useEffect(() => {
		if (business) {
			setValue('bank', business.bank);
			setValue('account', business.account);
			setValue('cbu', business.cbu);
			setValue('alias', business.alias);
		}
	}, [business]);

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (mode === 'edit') {
				await updateBankAccount({ id, values });
				onClose();
			} else if (mode === 'create') {
				await createBankAccount({ values });
				onClose();
			}
		} catch (error) {
			console.error('Error al editar la info de la empresa:', error);
		}
	});

	if (businessStatus === 'Cargando' || businessStatusUpdate === 'Cargando') {
		return <Loader />;
	}

	return (
		<div>
			<Form
				onSubmit={onSubmit}
				className='flex flex-wrap justify-around items-center'>
				<FormInput
					label='Banco'
					name='bank'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El banco es obligatoria.',
						},
					}}
				/>
				<FormInput
					label='Cuenta Nº '
					name='account'
					type='number'
					register={register}
					errors={errors}
					mode={mode}
				/>
				<FormInput
					label='CBU'
					name='cbu'
					type='number'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El CBU es obligatorio.',
						},
					}}
				/>
				<FormInput
					label='Alias'
					name='alias'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El alias es obligatorio.',
						},
					}}
				/>

				<Form.Group className='flex flex-wrap items-center w-full justify-around'>
					{mode !== 'view' && (
						<SaveButton
							onSubmit={onSubmit}
							label={
								mode === 'create'
									? 'Registrar Datos'
									: 'Guardar Cambios'
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
