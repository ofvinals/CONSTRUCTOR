/* eslint-disable react/prop-types */
import {
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAttendanceActions } from '../hooks/useAttendanceActions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Loader from './Loader';
const theme = createTheme({
	palette: {
		mode: 'light',
	},
});

export const TreeTable = ({
	columns,
	data,
	setValidationErrors,
	onSave,
	initialSortColumn,
}) => {
	const { allAttendancesStatus } = useAttendanceActions();

	const table = useMaterialReactTable({
		columns,
		data,
		initialState: {
			showGlobalFilter: true,
			sorting: initialSortColumn
				? [{ id: initialSortColumn, desc: true }]
				: [],
			columnPinning: { left: ['mrt-row-actions'], right: [] },
			expanded: false,
			pagination: { pageSize: 10, pageIndex: 0 },
		},
		createDisplayMode: 'row',
		editDisplayMode: 'row',
		enableColumnOrdering: true,
		enableColumnFilterModes: true,
		enableColumnPinning: true,
		localization: MRT_Localization_ES,
		enableEditing: true,
		enableExpanding: true,
		getSubRows: (row) => row.employees,
		onCreatingRowCancel: () => setValidationErrors({}),
		onEditingRowCancel: () => setValidationErrors({}),
		onEditingRowSave: ({ row, values }) => {
			onSave({ row, values, table });
		},
		renderRowActions: ({ row, table }) => (
			<Box sx={{ display: 'flex', gap: '1rem' }}>
				{row.depth > 0 && (
					<>
						<Tooltip title='Editar Asistencia'>
							<IconButton onClick={() => table.setEditingRow(row)}>
								<EditIcon className='text-blue-500' />
							</IconButton>
						</Tooltip>
					</>
				)}
			</Box>
		),
	});

	if (allAttendancesStatus === 'Cargando') {
		return <Loader />;
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<MaterialReactTable table={table} />;
		</ThemeProvider>
	);
};
export default TreeTable;
