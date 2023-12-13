import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	collection,
	addDoc,
	doc,
	updateDoc,
	deleteDoc,
	getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

const getTodos = async () => {
	const todoReference = collection(db, "todos");
	const data = await getDocs(todoReference);
	return data.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));
};

// Async action for adding a todo
export const addTodo = createAsyncThunk("todos/addTodo", async (text) => {
	const docRef = await addDoc(collection(db, "todos"), { text, done: false });
	return { id: docRef.id, text, done: false };
});

// Async action for deleting a todo
export const deleteTodo = createAsyncThunk(
	"todos/deleteTodo",
	async (todoId) => {
		await deleteDoc(doc(db, "todos", todoId));
		return todoId;
	}
);

// Async action for updating todo state
export const updateTodo = createAsyncThunk(
	"todos/updateTodo",
	async ({ id, state, text }) => {
		await updateDoc(doc(db, "todos", id), { done: state, text });
		return { id, state, text };
	}
);

export const todosSlice = createSlice({
	name: "todos",
	initialState: {
		value: await getTodos(),
	},
	reducers: {
		addTodoFromFirestore: (state, action) => {
			const todoExists = state.value.some(
				(todo) => todo.id === action.payload.id
			);
			if (!todoExists) {
				state.value.push(action.payload);
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addTodo.fulfilled, (state, action) => {
				state.value.push(action.payload);
			})
			.addCase(deleteTodo.fulfilled, (state, action) => {
				state.value = state.value.filter(
					(todo) => todo.id !== action.payload
				);
			})
			.addCase(updateTodo.fulfilled, (state, action) => {
				state.value = state.value.map((todo) =>
					todo.id === action.payload.id
						? {
								...todo,
								text: action.payload.text,
								done: action.payload.state,
						  }
						: todo
				);
			});
	},
});

export const { addTodoFromFirestore } = todosSlice.actions;
export default todosSlice.reducer;
