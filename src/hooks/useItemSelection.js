// hooks/useItemSelection.js
import { useState, useEffect } from 'react';

export const useItemSelection = (items, initialSelectedItems = []) => {
	const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
	const [selectAll, setSelectAll] = useState(false);

	useEffect(() => {
		const allSelected =
			items.length > 0 &&
			items.every((item) => selectedItems.includes(item.uid));
		setSelectAll(allSelected);
	}, [items, selectedItems]);

	const handleSelectAllChange = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);
		setSelectedItems(newSelectAll ? items.map((item) => item.uid) : []);
	};

	const handleCheckboxChange = (itemId, isChecked) => {
		setSelectedItems((prevSelectedItems) => {
			if (isChecked) {
				return [...prevSelectedItems, itemId];
			} else {
				return prevSelectedItems.filter((id) => id !== itemId);
			}
		});
	};

	return {
		selectAll,
		selectedItems,
		handleSelectAllChange,
		handleCheckboxChange,
	};
};
