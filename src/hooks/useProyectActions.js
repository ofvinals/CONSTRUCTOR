import { useAppDispatch, useAppSelector } from './store';
import {
	getProyect as getProyectThunk,
	getProyects as getProyectsThunk,
	createProyect as createProyectThunk,
	deleteProyect as deleteProyectThunk,
	updateProyect as updateProyectThunk,
	enableProyect as enableProyectThunk,
	disableProyect as disableProyectThunk,
	getDocuments as getDocumentsThunk,
	createDocs as createDocsThunk,
	deleteDocs as deleteDocsThunk,
} from '../store/proyects/thunks';
import { clearProyect } from '../store/proyects/slice';

export const useProyectActions = () => {
	const proyects = useAppSelector((state) => state.proyects.proyects);
	const docs = useAppSelector((state) => state.proyects.docs);
	const configValues = useAppSelector((state) => state.proyects.configValues);
	const docsStatus = useAppSelector((state) => state.proyects.statusDocs);
	const allProyectsStatus = useAppSelector((state) => state.proyects.status);
	const proyect = useAppSelector((state) => state.proyects.proyect);
	const proyectStatusUpdate = useAppSelector(
		(state) => state.proyects.statusUpdate
	);
	const proyectStatusDelete = useAppSelector(
		(state) => state.proyects.statusDelete
	);
	const proyectStatus = useAppSelector(
		(state) => state.proyects.statusProyect
	);

	const dispatch = useAppDispatch();

	const getProyect = async ({ proyectId }) => {
		await dispatch(getProyectThunk({ proyectId }));
	};
	const getProyects = async () => {
		await dispatch(getProyectsThunk());
	};
	const createProyect = async ({ values }) => {
		await dispatch(createProyectThunk({ values }));
	};
	const updateProyect = async ({ proyectId, values }) => {
		await dispatch(updateProyectThunk({ proyectId, values }));
	};
	const deleteProyect = async ({ proyectId }) => {
		await dispatch(deleteProyectThunk({ proyectId }));
	};
	const disableProyect = async ({ proyectId }) => {
		await dispatch(disableProyectThunk({ proyectId }));
	};
	const enableProyect = async ({ proyectId }) => {
		await dispatch(enableProyectThunk({ proyectId }));
	};
	const getDocuments = async () => {
		await dispatch(getDocumentsThunk());
	};
	const createDocs = async ({ file }) => {
		await dispatch(createDocsThunk({ file }));
	};
	const deleteDocs = async ({ file }) => {
		await dispatch(deleteDocsThunk({ file }));
	};
	const clearStateProyect = () => {
		dispatch(clearProyect());
	};

	return {
		proyects,
		docs,
		allProyectsStatus,
		proyectStatusUpdate,
		proyect,
		configValues,
		docsStatus,
		getProyect,
		getProyects,
		createProyect,
		deleteProyect,
		updateProyect,
		clearStateProyect,
		proyectStatusDelete,
		proyectStatus,
		disableProyect,
		enableProyect,
		getDocuments,
		createDocs,
		deleteDocs,
	};
};
