import { useState } from 'react';

const useModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [data, setData] = useState(null);

	const openModal = (data) => {
		setIsOpen(true);
		setData(data);
	};

	const closeModal = () => {
		setIsOpen(false);
		setData(null);
	};

	return {
		isOpen,
		openModal,
		closeModal,
		data,
	};
};

export default useModal;
