import { useAppDispatch, useAppSelector } from './store';
import {
	getNote as getNoteThunk,
	getNotes as getNotesThunk,
	createNote as createNoteThunk,
	deleteNote as deleteNoteThunk,
	updateNote as updateNoteThunk,

} from '../store/proyectNotes/thunks';
import { clearNote } from '../store/proyectNotes/slice';

export const useProyectNotesActions = () => {
	const notes = useAppSelector((state) => state.notes.notes);
	const allNotesStatus = useAppSelector((state) => state.notes.status);
	const note = useAppSelector((state) => state.notes.note);
	const noteStatusUpdate = useAppSelector((state) => state.notes.statusUpdate);
	const noteStatusDelete = useAppSelector((state) => state.notes.statusDelete);
	const noteStatus = useAppSelector((state) => state.notes.statusNote);

	const dispatch = useAppDispatch();

	const getNote = async ({ proyectId, noteId }) => {
		await dispatch(getNoteThunk({ proyectId, noteId }));
	};
	const getNotes = async ({proyectId}) => {
		await dispatch(getNotesThunk({proyectId}));
	};
	const createNote = async ({ proyectId, values }) => {
		await dispatch(createNoteThunk({ proyectId, values }));
	};
	const updateNote = async ({ proyectId, noteId, values }) => {
		await dispatch(updateNoteThunk({ proyectId, noteId, values }));
	};
	const deleteNote = async ({ proyectId, noteId }) => {
		await dispatch(deleteNoteThunk({ proyectId, noteId }));
	};
	const clearStateNote = () => {
		dispatch(clearNote());
	};

	return {
		notes,
		allNotesStatus,
		noteStatusUpdate,
		note,
		getNote,
		getNotes,
		createNote,
		deleteNote,
		updateNote,
		clearStateNote,
		noteStatusDelete,
		noteStatus,

	};
};
