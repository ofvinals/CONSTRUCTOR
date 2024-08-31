/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Accordion, Card, Form } from 'react-bootstrap';
import { SaveButton, FormInput } from '../../../../utils/Form';
import Loader from '../../../../utils/Loader';
import { useEmployeeActions } from '../../../../hooks/useEmployeeActions';
import { Button } from 'react-bootstrap';

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
		setValue,
	} = useForm();

	const { employeeStatus, updateConfig, employeeStatusUpdate, configState } =
		useEmployeeActions();

	useEffect(() => {
		const config = configState[0];
		if (config) {
			setPositions(config.positions || []);
			setTravelCosts(config.travelCosts || []);
			setPresentism(config.presentism || { value: 1, hourlyRate: 0 });
			// Establecer valores manualmente en react-hook-form
			config.positions?.forEach((position, index) => {
				setValue(
					`positions[${index}].hourlyRate`,
					position.hourlyRate || 0
				);
			});
			config.travelCosts?.forEach((travelCost, index) => {
				setValue(
					`travelCosts[${index}].hourlyRate`,
					travelCost.hourlyRate || 0
				);
			});
			setValue('presentism', config.presentism.hourlyRate || 0);
		}
	}, [configState, setValue]);

	const onSubmit = async (values) => {
		const id = configState[0].uid;
		// Actualiza posiciones, viáticos y presentismo con los valores del formulario
		const updatedPositions = positions.map((pos, index) => ({
			...pos,
			hourlyRate:
				Number(values.positions[index].hourlyRate) || pos.hourlyRate,
		}));
		const updatedTravelCosts = travelCosts.map((via, index) => ({
			...via,
			hourlyRate:
				Number(values.travelCosts[index].hourlyRate) || via.hourlyRate,
		}));
		const updatedPresentism = {
			...presentism,
			hourlyRate: Number(values.presentism) || presentism.hourlyRate,
		};
		const configData = {
			positions: updatedPositions,
			travelCosts: updatedTravelCosts,
			presentism: updatedPresentism,
		};
		try {
			await updateConfig({ id, values: configData });
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
							className='bg-transparent border-none text-black '
							onClick={(e) => {
								e.stopPropagation();
								addNewPosition();
							}}>
							<i className='pi pi-plus ml-2 p-2 rounded-md hover:bg-[#ffd52b] font-semibold text-xl'></i>
						</Button>
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
											<div className='flex justify-between items-center'>
												<span className='text-xl font-semibold'>
													{position.label || 'Nueva Posición'}
												</span>
												<Button
													type='button'
													className='bg-transparent border-none text-black '
													onClick={(e) => {
														handleFocus('positions', index);
														e.stopPropagation();
													}}>
													<i className='pi pi-pencil text-green-500 hover:opacity-60'></i>
												</Button>
												<Button
													type='button'
													className='bg-transparent border-none text-black '
													onClick={(e) => {
														handleDelete('positions', index);
														e.stopPropagation();
													}}>
													<i className='pi pi-trash text-red-500 hover:opacity-60'></i>
												</Button>
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
							className='bg-transparent border-none text-black '
							onClick={(e) => {
								e.stopPropagation();
								addNewTravelCost();
							}}>
							<i className='pi pi-plus p-2 rounded-md hover:bg-[#ffd52b] font-semibold text-xl'></i>
						</Button>
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
											<div className='flex justify-between items-center'>
												<span className='text-xl font-semibold'>
													{travelCost.label || 'Nuevo Viático'}
												</span>
												<Button
													type='button'
													className='bg-transparent border-none text-black '
													onClick={(e) => {
														handleFocus('travelCosts', index);
														e.stopPropagation();
													}}>
													<i className='pi pi-pencil text-green-500 hover:opacity-60'></i>
												</Button>
												<Button
													type='button'
													className='bg-transparent border-none text-black '
													onClick={(e) => {
														handleDelete('travelCosts', index);
														e.stopPropagation();
													}}>
													<i className='pi pi-trash text-red-500 hover:opacity-60'></i>
												</Button>
											</div>
										)}
									</Accordion.Header>
									<Accordion.Body>
										<FormInput
											label='Valor Hora de Viáticos'
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
							label='Valor Hora de Presentismo'
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
			<SaveButton label='Guardar Configuración' />
		</Form>
	);
};

export default ConfigForm;
