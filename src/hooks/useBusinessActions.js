import { useAppDispatch, useAppSelector } from './store';
import {
	getBusiness as getBusinessThunk,
	createBusiness as createBusinessThunk,
	deleteBusiness as deleteBusinessThunk,
	updateBusiness as updateBusinessThunk,
} from '../store/business/thunks';
import { clearBusiness } from '../store/business/slice';

export const useBusinessActions = () => {
	const business = useAppSelector((state) => state.business.business);
	const allBusinesssStatus = useAppSelector((state) => state.business.status);
	const businessStatusUpdate = useAppSelector(
		(state) => state.business.statusUpdate
	);
	const businessStatusDelete = useAppSelector(
		(state) => state.business.statusDelete
	);
	const businessStatus = useAppSelector(
		(state) => state.business.statusBusiness
	);
	const dispatch = useAppDispatch();

	const getBusiness = async ({ id }) => {
		await dispatch(getBusinessThunk({ id }));
	};

	const createBusiness = async ({ values, fileImage }) => {
		await dispatch(createBusinessThunk({ values, fileImage }));
	};

	const updateBusiness = async ({ id, values, fileImage }) => {
		await dispatch(updateBusinessThunk({ id, values, fileImage }));
	};

	const deleteBusiness = async ({ id }) => {
		await dispatch(deleteBusinessThunk({ id }));
	};

	const clearStateBusiness = () => {
		dispatch(clearBusiness());
	};

	return {
		allBusinesssStatus,
		businessStatusUpdate,
		business,
		getBusiness,
		createBusiness,
		deleteBusiness,
		updateBusiness,
		clearStateBusiness,
		businessStatusDelete,
		businessStatus,
	};
};
