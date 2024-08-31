import { useState, useCallback } from 'react';
import { Accordion, Card, Button, Form } from 'react-bootstrap';
import { FormInput } from '../../../../../utils/Form';

const PositionsAccordion = ({
	positions,
	setPositions,
	expandedPositionIndex,
	setExpandedPositionIndex,
	editMode,
	editIndex,
	editLabel,
	handleFocus,
	handleBlur,
	handleLabelChange,
	handleDelete,
	register,
	errors,
}) => {
	const addNewPosition = () => {
		const newPosition = {
			value: positions.length + 1,
			label: '',
			hourlyRate: '',
		};
		setPositions([...positions, newPosition]);
		setExpandedPositionIndex(positions.length.toString());
	};

	return (
		<Accordion.Item eventKey='0'>
			<Accordion.Header>
				<p className='text-xl text-black font-bold'>
					Posiciones de Trabajo
				</p>
				<Button
					type='button'
					className='p-0 border-none bg-transparent'
					onClick={(e) => {
						e.stopPropagation();
						addNewPosition();
					}}>
					<i className='pi pi-plus btnicon ml-2'></i>
				</Button>
			</Accordion.Header>
			<Accordion.Body>
				{positions.map((position, index) => (
					<Card key={position.value} className='mb-2'>
						<Accordion.Item eventKey={`${index}`}>
							<Accordion.Header>
								{editMode === 'positions' && editIndex === index ? (
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
											className='p-0 border-none bg-transparent'
											onClick={(e) => {
												handleFocus('positions', index);
												e.stopPropagation();
											}}>
											<i className='pi pi-pencil btnicon ml-2 text-green-500 hover:opacity-60'></i>
										</Button>
										<Button
											type='button'
											className='text-red-500 hover:opacity-60 p-0 border-none bg-transparent'
											onClick={(e) => {
												handleDelete('positions', index);
												e.stopPropagation();
											}}>
											<i className='pi pi-trash btnicon ml-2 text-red-500 hover:opacity-60'></i>
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
						</Accordion.Item>
					</Card>
				))}
			</Accordion.Body>
		</Accordion.Item>
	);
};

export default PositionsAccordion;
