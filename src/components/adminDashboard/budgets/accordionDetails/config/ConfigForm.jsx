/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormLabel, InputGroup } from 'react-bootstrap';
import { SaveButton } from '../../../../../utils/Form';
import { useBudgetActions } from '../../../../../hooks/useBudgetActions';
import { useEffect } from 'react';

const ConfigForm = ({ budgetId, onClose }) => {
	const { updateConfig, configValues, getConfigValues } = useBudgetActions();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		if (budgetId) {
			getConfigValues({ budgetId }).then(() => {
				if (configValues) {
					setValue('benefits', configValues.benefits || '');
					setValue('anteproyectFee', configValues.anteproyectFee || '');
					setValue('proyectFee', configValues.proyectFee || '');
					setValue('dtFee', configValues.dtFee || '');
					setValue('adminFee', configValues.adminFee || '');
					setValue('otherFee', configValues.otherFee || '');
				}
			});
		}
	}, []);

	const onSubmit = async (values) => {
		try {
			await updateConfig({ budgetId, values });
			onClose();
		} catch (error) {
			console.error('Error al editar la configuración:', error);
		}
	};

	return (
		<Form
			onSubmit={handleSubmit(onSubmit)}
			className='my-2 flex flex-col items-center justify-center'>
			<div className='w-full flex flex-row flex-wrap items-center justify-around gap-3'>
				<Form.Group className='flex flex-col items-center justify-around px-2'>
					<FormLabel className='w-[150px] text-center  text-black h-[48px] pt-3'>
						Margen de Beneficio
					</FormLabel>
					<InputGroup className='items-center w-[100px]  text-black border-1 border-black rounded-md bg-white'>
						<InputGroup.Text className='bg-white '>
							<FormControl
								name='benefits'
								type='number'
								{...register('benefits')}
								errors={errors}
								className='shadow-none border-none '
							/>
							%
						</InputGroup.Text>
					</InputGroup>
				</Form.Group>
				<Form.Group className='flex flex-col items-center justify-around px-2'>
					<FormLabel className='w-[150px] text-center text-black '>
						Honorarios Anteproyecto
					</FormLabel>
					<InputGroup className='items-center w-[100px]  text-black border-1 border-black rounded-md bg-white'>
						<InputGroup.Text className='bg-white '>
							<FormControl
								name='anteproyectFee'
								type='number'
								{...register('anteproyectFee')}
								errors={errors}
								className='shadow-none border-none '
							/>
							%
						</InputGroup.Text>
					</InputGroup>
				</Form.Group>
				<Form.Group className='flex flex-col items-center justify-around'>
					<FormLabel className='w-[150px] text-center  text-black h-[48px] pt-3'>
						Honorarios Proyecto
					</FormLabel>
					<InputGroup className='items-center w-[100px]  text-black border-1 border-black rounded-md bg-white'>
						<InputGroup.Text className='bg-white '>
							<FormControl
								name='proyectFee'
								type='number'
								{...register('proyectFee')}
								errors={errors}
								className='shadow-none border-none '
							/>
							%
						</InputGroup.Text>
					</InputGroup>
				</Form.Group>
				<Form.Group className='flex flex-col items-center justify-center px-2'>
					<FormLabel className='w-[150px] text-center  text-black '>
						Honorarios Direccion Tecnica
					</FormLabel>
					<InputGroup className='items-center w-[100px]  text-black border-1 border-black rounded-md bg-white'>
						<InputGroup.Text className='bg-white '>
							<FormControl
								name='dtFee'
								type='number'
								{...register('dtFee')}
								errors={errors}
								className='shadow-none border-none '
							/>
							%
						</InputGroup.Text>
					</InputGroup>
				</Form.Group>
				<Form.Group className='flex flex-col items-center justify-center px-2'>
					<FormLabel className='w-[150px] text-center  text-black '>
						Honorarios Administracion
					</FormLabel>
					<InputGroup className='items-center w-[100px]  text-black border-1 border-black rounded-md bg-white'>
						<InputGroup.Text className='bg-white '>
							<FormControl
								name='adminFee'
								type='number'
								{...register('adminFee')}
								errors={errors}
								className='shadow-none border-none '
							/>
							%
						</InputGroup.Text>
					</InputGroup>
				</Form.Group>
				<Form.Group className='flex flex-col items-center justify-around px-2'>
					<FormLabel className='w-[150px] text-center  text-black h-[48px] pt-3'>
						Otros Honorarios
					</FormLabel>
					<InputGroup className='items-center w-[100px]  text-black border-1 border-black rounded-md bg-white'>
						<InputGroup.Text className='bg-white '>
							<FormControl
								name='otherFee'
								type='number'
								{...register('otherFee')}
								errors={errors}
								className='shadow-none border-none '
							/>
							%
						</InputGroup.Text>
					</InputGroup>
				</Form.Group>
			</div>
			<div className='mt-3'>
				<SaveButton label='Guardar' />
			</div>
		</Form>
	);
};

export default ConfigForm;
