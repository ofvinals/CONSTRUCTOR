import { useState, useCallback } from 'react';
import { Accordion, Card, Button, Form } from 'react-bootstrap';
import { FormInput } from '../../../../../utils/Form';

const TravelCostsAccordion = ({
	travelCosts,
	setTravelCosts,
	expandedTravelCostIndex,
	setExpandedTravelCostIndex,
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
	const addNewTravelCost = () => {
		const newTravelCost = {
			value: travelCosts.length + 1,
			label: '',
			hourlyRate: '',
		};
		setTravelCosts([...travelCosts, newTravelCost]);
		setExpandedTravelCostIndex(travelCosts.length.toString());
	};

	return (
		<Accordion.Item eventKey='1'>
			<Accordion.Header>
				<p className='text-xl text-black font-bold'>Viáticos</p>
				<Button
					type='button'
					className='p-0 border-none bg-transparent'
					onClick={(e) => {
						e.stopPropagation();
						addNewTravelCost();
					}}>
					<i className='pi pi-plus btnicon ml-2'></i>
				</Button>
			</Accordion.Header>
			<Accordion.Body>
				{travelCosts?.map((travelCost, index) => (
					<Card key={travelCost.value} className='mb-2'>
						<Accordion.Item eventKey={`${index}`}>
							<Accordion.Header>
								{editMode === 'travelCosts' && editIndex === index ? (
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
											{travelCost.label || 'Nuevo Viático'}
										</span>
										<Button
											type='button'
											className='p-0 border-none bg-transparent'
											onClick={(e) => {
												handleFocus('travelCosts', index);
												e.stopPropagation();
											}}>
											<i className='pi pi-pencil btnicon ml-2 text-green-500 hover:opacity-60'></i>
										</Button>
										<Button
											type='button'
											className='text-red-500 hover:opacity-60 p-0 border-none bg-transparent'
											onClick={(e) => {
												handleDelete('travelCosts', index);
												e.stopPropagation();
											}}>
											<i className='pi pi-trash btnicon ml-2 text-red-500 hover:opacity-60'></i>
										</Button>
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
						</Accordion.Item>
					</Card>
				))}
			</Accordion.Body>
		</Accordion.Item>
	);
};

export default TravelCostsAccordion;
