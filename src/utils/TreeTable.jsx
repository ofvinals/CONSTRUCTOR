/* eslint-disable react/prop-types */
import {
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const theme = createTheme({
	palette: {
		mode: 'light',
	},
});

export const TreeTable = ({ columns, data, actions }) => {
	const table = useMaterialReactTable({
		columns,
		data: data || [],
		localization: MRT_Localization_ES,
		enableExpandAll: false,
		enableExpanding: true,
		filterFromLeafRows: true,
		getSubRows: (row) => row.employees, // Definir subRows como empleados
		initialState: { expanded: {} }, // Puedes ajustar el estado inicial si es necesario
		paginateExpandedRows: false,
		renderRowActions: ({ row }) => {
			const rowActions = actions(row);
			return (
				<Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
					{rowActions.map((action, index) => (
						<span
							key={index}
							onClick={() => action.onClick && action.onClick(row)}>
							{action.icon}
						</span>
					))}
				</Box>
			);
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<MaterialReactTable
				table={table}
				sx={{
					'& .MuiTableCell-root': {
						borderBottom: '1px solid #ddd',
					},
					'& .MuiTableHead-root': {
						backgroundColor: '#e0e0e0',
					},
					'& .MuiTableCell-head': {
						backgroundColor: '#185574',
						fontWeight: 'bold',
					},
					'& .MuiTableBody-root': {
						fontSize: '0.875rem',
					},
				}}
			/>
		</ThemeProvider>
	);
};

export default TreeTable;
