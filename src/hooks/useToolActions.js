import { useAppDispatch, useAppSelector } from './store';
import {
	getTool as getToolThunk,
	getTools as getToolsThunk,
	createTool as createToolThunk,
	deleteTool as deleteToolThunk,
	updateTool as updateToolThunk,
} from '../store/tools/thunks';
import { clearTool } from '../store/tools/slice';

export const useToolActions = () => {
	const tools = useAppSelector((state) => state.tools.tools);
	const allToolsStatus = useAppSelector((state) => state.tools.status);
	const tool = useAppSelector((state) => state.tools.tool);
	const toolStatusUpdate = useAppSelector((state) => state.tools.statusUpdate);
	const toolStatusDelete = useAppSelector((state) => state.tools.statusDelete);
	const toolStatus = useAppSelector((state) => state.tools.statusTool);
	const configState = useAppSelector((state) => state.tools.config);
	const configLoading = useAppSelector((state) => state.tools.loading);

	const dispatch = useAppDispatch();

	const getTool = async ({ id }) => {
		await dispatch(getToolThunk({ id }));
	};

	const getTools = async () => {
		await dispatch(getToolsThunk());
	};

	const createTool = async ({ values, fileImage }) => {
		await dispatch(createToolThunk({ values, fileImage }));
	};

	const updateTool = async ({ id, values, fileImage }) => {
		await dispatch(updateToolThunk({ id, values, fileImage }));
	};

	const deleteTool = async ({ id }) => {
		await dispatch(deleteToolThunk({ id }));
	};

	const clearStateTool = () => {
		dispatch(clearTool());
	};

	return {
		tools,
		allToolsStatus,
		toolStatusUpdate,
		tool,
		getTool,
		getTools,
		createTool,
		deleteTool,
		updateTool,
		clearStateTool,
		toolStatusDelete,
		toolStatus,
		configState,
		configLoading,
	};
};
