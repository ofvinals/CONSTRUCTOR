/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Accordion, Card, Form } from 'react-bootstrap';
import { SaveButton, FormInput } from '../../../../utils/Form';
import Loader from '../../../../utils/Loader';
import { useEmployeeActions } from '../../../../hooks/useEmployeeActions';
import { Button } from 'primereact/button';

const ConfigForm = ({ onClose }) => {
	const [positions, setPositions] = useState([]);
	const [travelCosts, setTravelCosts] = useState([]);
	const [presentism, setPresentism] = useState({ value: 1, hourlyRate: 0 });
	const [editMode, setEditMode] = useState(null);
	const [editLabel, setEditLabel] = useState('');
	const [editIndex, setEditIndex] = useState(null);
	const [expandedPositionIndex, setExpandedPositionIndex] = useState(null);
	const [expandedTravelCostIndex, setExpandedTravelCostIndex] = useState(null);
	const [expandedAccordionKey, setExpandedAccordionKey] = useState('0');

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			positions: positions.reduce(
				(acc, pos, index) => ({
					...acc,
					[`${index}`]: {
						hourlyRate: pos.hourlyRate,
					},
				}),
				{}
			),
			travelCosts: travelCosts.reduce(
				(acc, via, index) => ({
					...acc,
					[`${index}`]: {
						hourlyRate: via.hourlyRate,
					},
				}),
				{}
			),
			presentism: presentism.hourlyRate,
		},
	});

	const { employeeStatus, updateConfig, employeeStatusUpdate, getConfig } =
		useEmployeeActions();

	useEffect(() => {
		getConfig();
	}, []);

	const onSubmit = async (values) => {
		console.log('Valores del formulario:', values);

		// Asegúrate de que `values` está correctamente formateado
		const updatedPositions = positions.map((pos, index) => ({
			...pos,
			hourlyRate:
				parseInt(values[`positions[${index}].hourlyRate`], 10) ||
				pos.hourlyRate,
		}));

		const updatedTravelCosts = travelCosts.map((via, index) => ({
			...via,
			hourlyRate:
				parseInt(values[`travelCosts[${index}].hourlyRate`], 10) ||
				via.hourlyRate,
		}));

		const updatedPresentismo = {
			value: presentism.value,
			hourlyRate: parseInt(values.presentism, 10) || presentism.hourlyRate,
		};

		const configData = {
			positions: updatedPositions,
			travelCosts: updatedTravelCosts,
			presentism: updatedPresentismo,
		};

		console.log('Datos de configuración:', configData);

		try {
			await updateConfig({ values: configData });
			onClose();
		} catch (error) {
			console.error('Error al editar la configuración:', error);
		}
	};

	const addNewPosition = () => {
		const newPosition = {
			value: positions.length + 1,
			label: '',
			hourlyRate: '',
		};
		setPositions([...positions, newPosition]);
		setExpandedAccordionKey('0');
		setExpandedPositionIndex(positions.length.toString());
	};

	const addNewTravelCost = () => {
		const newTravelCost = {
			value: travelCosts.length + 1,
			label: '',
			hourlyRate: '',
		};
		setTravelCosts([...travelCosts, newTravelCost]);
		setExpandedAccordionKey('1');
		setExpandedTravelCostIndex(travelCosts.length.toString());
	};

	const handleLabelChange = useCallback(
		(event) => {
			const newLabel = event.target.value;
			setEditLabel(newLabel);
			if (editMode === 'positions') {
				const updatedPositions = positions.map((pos, i) =>
					i === editIndex ? { ...pos, label: newLabel } : pos
				);
				setPositions(updatedPositions);
			} else if (editMode === 'travelCosts') {
				const updatedTravelCosts = travelCosts.map((travelCost, i) =>
					i === editIndex ? { ...travelCost, label: newLabel } : travelCost
				);
				setTravelCosts(updatedTravelCosts);
			}
		},
		[editMode, editIndex, positions, travelCosts]
	);

	const handleFocus = useCallback(
		(type, index) => {
			setEditMode(type);
			setEditIndex(index);
			setEditLabel(
				type === 'positions'
					? positions[index].label
					: travelCosts[index].label
			);
		},
		[positions, travelCosts]
	);

	const handleBlur = () => {
		setEditMode(null);
		setEditIndex(null);
	};

	const handleDelete = (type, index) => {
		if (type === 'positions') {
			setPositions(positions.filter((_, i) => i !== index));
		} else if (type === 'travelCosts') {
			setTravelCosts(travelCosts.filter((_, i) => i !== index));
		}
	};

	if (employeeStatus === 'Cargando' || employeeStatusUpdate === 'Cargando') {
		return <Loader />;
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)} className='my-2'>
			<Accordion
				activeKey={expandedAccordionKey}
				onSelect={(key) => setExpandedAccordionKey(key)}>
				{/* POSICION DE TRABAJO */}
				<Accordion.Item eventKey='0'>
					<Accordion.Header>
						<p className='text-xl text-black font-bold'>
							Posiciones de Trabajo
						</p>
						<Button
							type='button'
							icon='pi pi-plus'
							variant='outline-primary'
							className='btnicon ml-2'
							onClick={(e) => {
								e.stopPropagation();
								addNewPosition();
							}}
						/>
					</Accordion.Header>
					<Accordion.Body>
						<Accordion
							activeKey={expandedPositionIndex}
							onSelect={(key) => setExpandedPositionIndex(key)}>
							{positions.map((position, index) => (
								<Card key={position.value} className='mb-2'>
									<Accordion.Header eventKey={`${index}`}>
										{editMode === 'positions' &&
										editIndex === index ? (
											<Form.Control
												type='text'
												value={editLabel}
												onChange={handleLabelChange}
												onBlur={handleBlur}
												onClick={(e) => e.stopPropagation()}
											/>
										) : (
											<div className='d-flex justify-content-between align-items-center'>
												<span className='text-xl font-semibold'>
													{position.label || 'Nueva Posición'}
												</span>
												<Button
													type='button'
													icon='pi pi-pencil'
													className='text-green-500 hover:opacity-60'
													onClick={(e) => {
														handleFocus('positions', index);
														e.stopPropagation();
													}}
												/>
												<Button
													type='button'
													icon='pi pi-trash'
													className='text-red-500 hover:opacity-60'
													onClick={(e) => {
														handleDelete('positions', index);
														e.stopPropagation();
													}}
												/>
											</div>
										)}
									</Accordion.Header>
									<Accordion.Body>
										<FormInput
											label='Valor Hora de Trabajo'
											name={`positions[${index}].hourlyRate`}
											type='number'
											register={register}
											defaultValue={position.hourlyRate}
											customClass={true}
											errors={errors}
										/>
									</Accordion.Body>
								</Card>
							))}
						</Accordion>
					</Accordion.Body>
				</Accordion.Item>

				{/* VIATICOS */}
				<Accordion.Item eventKey='1'>
					<Accordion.Header>
						<p className='text-xl text-black font-bold'>Viáticos</p>
						<Button
							type='button'
							icon='pi pi-plus'
							className='btnicon ml-2'
							onClick={(e) => {
								e.stopPropagation();
								addNewTravelCost();
							}}
						/>
					</Accordion.Header>
					<Accordion.Body>
						<Accordion
							activeKey={expandedTravelCostIndex}
							onSelect={(key) => setExpandedTravelCostIndex(key)}>
							{travelCosts.map((travelCost, index) => (
								<Card key={travelCost.value} className='mb-2'>
									<Accordion.Header eventKey={`${index}`}>
										{editMode === 'travelCosts' &&
										editIndex === index ? (
											<Form.Control
												type='text'
												value={editLabel}
												onChange={handleLabelChange}
												onBlur={handleBlur}
												onClick={(e) => e.stopPropagation()}
											/>
										) : (
											<div className='d-flex justify-content-between align-items-center'>
												<span>
													{travelCost.label || 'Nuevo Viático'}
												</span>
												<Button
													type='button'
													icon='pi pi-pencil'
													className='text-green-500 hover:opacity-60'
													onClick={(e) => {
														handleFocus('travelCosts', index);
														e.stopPropagation();
													}}
												/>
												<Button
													type='button'
													icon='pi pi-trash'
													className='text-red-500 hover:opacity-60'
													onClick={(e) => {
														handleDelete('travelCosts', index);
														e.stopPropagation();
													}}
												/>
											</div>
										)}
									</Accordion.Header>
									<Accordion.Body>
										<FormInput
											label='Valor Viático'
											name={`travelCosts[${index}].hourlyRate`}
											type='number'
											register={register}
											defaultValue={travelCost.hourlyRate}
											customClass={true}
											errors={errors}
										/>
									</Accordion.Body>
								</Card>
							))}
						</Accordion>
					</Accordion.Body>
				</Accordion.Item>

				{/* PRESENTISMO */}
				<Accordion.Item eventKey='2'>
					<Accordion.Header>
						<p className='text-xl text-black font-bold'>Presentismo</p>
					</Accordion.Header>
					<Accordion.Body>
						<FormInput
							label='Valor Presentismo'
							name='presentism'
							type='number'
							register={register}
							defaultValue={presentism.hourlyRate}
							customClass={true}
							errors={errors}
						/>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>

			<div className='mt-4 flex flex-wrap items-center justify-center'>
				<SaveButton label='Guardar Cambios' />
			</div>
		</Form>
	);
};

export default ConfigForm;
