// utils/showToast.js
import { Toast } from 'primereact/toast';

export const toast = (type, summary, detail) => {
	Toast[type]({
		severity: type,
		summary: summary,
		detail: detail,
		life: 3000,
	});
};
