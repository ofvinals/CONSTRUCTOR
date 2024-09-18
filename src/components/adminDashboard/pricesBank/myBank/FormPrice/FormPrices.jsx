/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { usePriceActions } from '../../../../../hooks/usePriceActions';
import { CostSummary } from './CostSummary';
import { MaterialItems } from './MaterialItems';
import { ManPowerItem } from './ManPowerItem';
import Loader from '../../../../../utils/Loader';

export const FormPrices = ({
	id,
	onClose,
	mode,
	subcategoryId,
	categoryId,
}) => {
	const {
		itemPrice,
		statusPrice,
		statusUpdate,
		getItemPrice,
		updateItemPrice,
		createItemPrice,
	} = usePriceActions();
	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			shortDescription: '',
			largeDescription: '',
			unitType: '',
			laborPrice: '',
			items: [
				{
					shortDescription: '',
					largeDescription: '',
					itemType: '',
					itemDescription: '',
					itemUnit: '',
					itemCant: '',
					itemPrice: '',
					itemTotalPrice: '',
				},
			],
		},
	});
	const [totalItems, setTotalItems] = useState(0);
	const [laborPrice, setLaborPrice] = useState(0);
	const watchedItems = watch('items');

	useEffect(() => {
		if (watchedItems) {
			const calculatedTotal = watchedItems.reduce((sum, item) => {
				const itemPrice = parseFloat(item.itemPrice) || 0;
				return sum + itemPrice;
			}, 0);
			setTotalItems(calculatedTotal);
		}
	}, [watchedItems]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'items',
	});

	useEffect(() => {
		if (mode === 'edit' && id) {
			getItemPrice({ categoryId, subcategoryId, itemId: id });
		}
	}, []);

	useEffect(() => {
		if (itemPrice && mode === 'edit') {
			setValue('shortDescription', itemPrice?.shortDescription);
			setValue('largeDescription', itemPrice?.largeDescription);
			setValue('unitType', itemPrice?.unitType);
			setValue('laborPrice', itemPrice?.laborPrice);
			setValue('items', itemPrice.items || []);
			setValue('totalItemsPrice', itemPrice?.totalItemsPrice || '');
			setLaborPrice(itemPrice?.laborPrice || 0);
		}
	}, [itemPrice]);

	const onSubmit = handleSubmit(async (values) => {
		try {
			const finalLaborPrice = parseFloat(values.laborPrice) || 0;
			const finalTotalItemsPrice = parseFloat(totalItems) || 0;
			const finalPrice = finalLaborPrice + finalTotalItemsPrice;
			const finalValues = {
				...values,
				totalItemsPrice: finalTotalItemsPrice,
				finalPrice,
			};
			if (mode === 'edit') {
				await updateItemPrice({
					categoryId,
					subcategoryId,
					itemId: id,
					values:finalValues,
				});
				onClose();
			} else if (mode === 'create') {
				await createItemPrice({
					categoryId,
					subcategoryId,
					values: finalValues,
				});
				onClose();
			}
		} catch (error) {
			console.error(error);
		}
	});

	if (statusPrice === 'Cargando' || statusUpdate === 'Cargando') {
		return <Loader />;
	}

	return (
		<div>
			<Form
				id='ItemForm'
				className='flex flex-col justify-center items-center  rounded-xl  '
				onSubmit={onSubmit}>
				<div className='w-full flex items-end justify-end  rounded-md'>
					<button onClick={onSubmit} className='btnprimary my-3 mr-4'>
						<i className='pi pi-save mr-2 font-bold'></i>
						Guardar Registro
					</button>
				</div>
				<div className='flex flex-row items-center w-full justify-center'>
					<ManPowerItem
						register={register}
						errors={errors}
						setValue={setValue}
						setLaborPrice={setLaborPrice}
					/>
					<MaterialItems
						fields={fields}
						register={register}
						remove={remove}
						append={append}
						control={control}
						setValue={setValue}
						setTotalItems={setTotalItems}
					/>
				</div>
				<CostSummary totalItems={totalItems} laborPrice={laborPrice} />
			</Form>
		</div>
	);
};
