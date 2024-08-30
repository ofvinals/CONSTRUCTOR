/* eslint-disable react/prop-types */
import { useState } from 'react';
import { SaveButton,  FormInput } from '../../../../utils/Form';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Loader from '../../../../utils/Loader';
import { useEmployeeActions } from '../../../../hooks/useEmployeeActions';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';

const ConfigForm = ({ onClose }) => {
	const [positions, setPositions] = useState([]);
	const [travelCosts, setTravelCosts] = useState([]);
	const [presentism, setPresentism] = useState({ value: 1, hourlyRate: 0 });
	const [editMode, setEditMode] = useState(null);
	const [editLabel, setEditLabel] = useState('');
	const [expandedAccordionIndex, setExpandedAccordionIndex] = useState(null);
	const [expandedPositionIndex, setExpandedPositionIndex] = useState(null);
	const [expandedTravelCostIndex, setExpandedTravelCostIndex] = useState(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const { employeeStatus, updateConfig, employeeStatusUpdate } =
		useEmployeeActions();

	const onSubmit = handleSubmit(async (values) => {
		const updatedPositions = positions.map((pos) =>
			pos.value === values.value
				? {
						...pos,
						label: values.label,
						hourlyRate: parseInt(values.hourlyRate, 10),
				  }
				: pos
		);
		const updatedTravelCosts = travelCosts.map((via) =>
			via.value === values.value
				? {
						...via,
						label: values.label,
						hourlyRate: parseInt(values.hourlyRate, 10),
				  }
				: via
		);
		const updatedPresentismo = {
			value: presentism.value,
			hourlyRate: parseInt(values.presentism, 10),
		};
		const configData = {
			positions: updatedPositions,
			travelCosts: updatedTravelCosts,
			presentism: updatedPresentismo,
		};
		console.log(configData);
		try {
			await updateConfig({ values: configData });
			onClose();
		} catch (error) {
			console.error('Error al editar la configuración:', error);
		}
	});

	const addNewPosition = () => {
		const newPosition = {
			value: positions.length + 1,
			label: '',
			hourlyRate: '',
		};
		setPositions([...positions, newPosition]);
		setExpandedPositionIndex(positions.length);
		setExpandedAccordionIndex(0);
	};

	const addNewTravelCost = () => {
		const newTravelCost = {
			value: travelCosts.length + 1,
			label: '',
			hourlyRate: '',
		};
		setTravelCosts([...travelCosts, newTravelCost]);
		setExpandedTravelCostIndex(travelCosts.length);
		setExpandedAccordionIndex(0);
	};

	const handleLabelChange = (index, event) => {
		const newLabel = event.target.value;
		setEditLabel(newLabel);
		if (editMode === 'positions') {
			const updatedPositions = positions.map((pos, i) =>
				i === index ? { ...pos, label: newLabel } : pos
			);
			setPositions(updatedPositions);
		} else if (editMode === 'travelCosts') {
			const updatedTravelCosts = travelCosts.map((travelCost, i) =>
				i === index ? { ...travelCost, label: newLabel } : travelCost
			);
			setTravelCosts(updatedTravelCosts);
		}
	};

	const toggleEditMode = (type, index) => {
		setEditMode(type);
		setEditLabel(
			type === 'positions'
				? positions[index].label
				: travelCosts[index].label
		);
	};

	if (employeeStatus === 'Cargando' || employeeStatusUpdate === 'Cargando') {
		return <Loader />;
	}

	return (
		<Form
			onSubmit={onSubmit}
			className='flex flex-col justify-center items-center my-2'>
			{/* POSICION DE TRABAJO */}
			<Accordion
				activeIndex={expandedAccordionIndex}
				onTabChange={(e) => setExpandedAccordionIndex(e.index)}
				className='w-full'>
				<AccordionTab
					header={
						<div className='flex items-center justify-between'>
							<span>Posiciones de Trabajo</span>
							<Button
								type='button'
								icon='pi pi-plus'
								onClick={(e) => {
									e.stopPropagation();
									addNewPosition();
								}}
								className='p-button-rounded p-button-sm'
							/>
						</div>
					}>
					<Accordion
						activeIndex={expandedPositionIndex}
						onTabChange={(e) => setExpandedPositionIndex(e.index)}>
						{positions.map((position, index) => (
							<AccordionTab
								key={position.value}
								header={
									editMode === 'positions' &&
									expandedPositionIndex === index ? (
										<input
											type='text'
											value={editLabel}
											onChange={(event) =>
												handleLabelChange(index, event)
											}
											onBlur={() => setEditMode(null)}
										/>
									) : (
										position.label || 'Nueva Posición'
									)
								}
								onClick={() => toggleEditMode('positions', index)}>
								<FormInput
									label='Valor Hora de Trabajo'
									name={`positions[${index}].hourlyRate`}
									type='number'
									register={register}
									defaultValue={position.hourlyRate}
									customClass={true}
									errors={errors}
								/>
							</AccordionTab>
						))}
					</Accordion>
				</AccordionTab>

				{/* VIATICOS */}
				<AccordionTab
					header={
						<div className='flex items-center justify-between'>
							<span>Viaticos</span>
							<Button
								type='button'
								icon='pi pi-plus'
								onClick={(e) => {
									e.stopPropagation();
									addNewTravelCost();
								}}
								className='p-button-rounded p-button-sm'
							/>
						</div>
					}>
					<Accordion
						activeIndex={expandedTravelCostIndex}
						onTabChange={(e) => setExpandedTravelCostIndex(e.index)}>
						{travelCosts.map((travelCost, index) => (
							<AccordionTab
								key={travelCost.value}
								header={
									<div className='flex items-center justify-between'>
										{editMode === 'travelCosts' &&
										expandedTravelCostIndex === index ? (
											<input
												type='text'
												value={editLabel}
												onChange={(event) =>
													handleLabelChange(index, event)
												}
												onBlur={() => setEditMode(null)}
												onClick={(e) => e.stopPropagation()}
											/>
										) : (
											travelCost.label || 'Nuevo Viático'
										)}
									</div>
								}
								onClick={() => toggleEditMode('travelCosts', index)}>
								<FormInput
									label='Valor Viático'
									name={`travelCosts[${index}].hourlyRate`}
									type='number'
									register={register}
									defaultValue={travelCost.hourlyRate}
									customClass={true}
									errors={errors}
								/>
							</AccordionTab>
						))}
					</Accordion>
				</AccordionTab>

				{/* PRESENTISMO */}
				<AccordionTab header='Presentismo'>
					<FormInput
						label='Valor Presentismo'
						name='presentism'
						type='number'
						register={register}
						defaultValue={presentism.hourlyRate}
						customClass={true}
						errors={errors}
					/>
				</AccordionTab>
			</Accordion>

			<div className='flex justify-center space-x-2 mt-4'>
				<SaveButton label='Guardar Cambios' />
			</div>
		</Form>
	);
};

export default ConfigForm;
