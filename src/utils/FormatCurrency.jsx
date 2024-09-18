export const formatCurrency = (value, locale = 'es-AR', currency = 'ARS') => {
	const numberValue = parseFloat(value);
	if (!isNaN(numberValue)) {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: 0,
		}).format(numberValue);
	}
	return value;
};
