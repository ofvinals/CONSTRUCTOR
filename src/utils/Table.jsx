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

export const Table = ({ columns, data, actions }) => {
	const table = useMaterialReactTable({
		columns,
		data: data || [],
		enableColumnFilterModes: true,
		enableColumnOrdering: true,
		enableGlobalFilterModes: true,
		enableColumnPinning: true,
		enableRowActions: true,
		enableGrouping: true,
		paginationDisplayMode: 'pages',
		positionToolbarAlertBanner: 'bottom',
		localization: MRT_Localization_ES,
		muiSearchTextFieldProps: {
			size: 'medium',
			variant: 'outlined',
		},
		muiPaginationProps: {
			color: 'primary',
			rowsPerPageOptions: [5, 10, 20, 30],
			shape: 'rounded',
			variant: 'outlined',
		},
		renderRowActions: ({ row }) => (
			<Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
				{actions.map((action, index) => (
					<span
						key={index}
						onClick={() => action.onClick && action.onClick(row)}>
						{action.icon}
					</span>
				))}
			</Box>
		),
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
