import { useAppDispatch, useAppSelector } from './store';
import {
	getLoan as getLoanThunk,
	getLoans as getLoansThunk,
	createLoan as createLoanThunk,
	updateLoan as updateLoanThunk,
	deleteLoan as deleteLoanThunk,
	payLoan as payLoanThunk,
} from '../store/loans/thunks';
import { clearLoan } from '../store/loans/slice';

export const useLoanActions = () => {
	const loans = useAppSelector((state) => state.loans.loans);
	const allLoansStatus = useAppSelector((state) => state.loans.status);
	const loan = useAppSelector((state) => state.loans.loan);
	const loanStatusUpdate = useAppSelector((state) => state.loans.statusUpdate);
	const loanStatus = useAppSelector((state) => state.loans.statusLoan);
	const dateAvailable = useAppSelector((state) => state.loans.dateAvailable);
	const statusDateCheck = useAppSelector(
		(state) => state.loans.statusDateCheck
	);
	const dispatch = useAppDispatch();

	const getLoan = async ({ id }) => {
		await dispatch(getLoanThunk({ id }));
	};

	const getLoans = async () => {
		await dispatch(getLoansThunk());
	};

	const createLoan = async ({ values }) => {
		await dispatch(createLoanThunk({ values }));
	};

	const updateLoan = async ({ id, values }) => {
		await dispatch(updateLoanThunk({ id, values }));
	};

	const deleteLoan = async ({ id }) => {
		await dispatch(deleteLoanThunk({ id }));
	};
	const payLoan = async ({ id }) => {
		await dispatch(payLoanThunk({ id }));
	};

	const clearStateLoan = () => {
		dispatch(clearLoan());
	};

	return {
		loans,
		allLoansStatus,
		loanStatusUpdate,
		loan,
		getLoan,
		getLoans,
		createLoan,
		updateLoan,
		deleteLoan,
		payLoan,
		clearStateLoan,
		loanStatus,
		dateAvailable,
		statusDateCheck,
	};
};
