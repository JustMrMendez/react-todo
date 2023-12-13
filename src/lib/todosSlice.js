import { createSlice } from "@reduxjs/toolkit";

export const todosSlice = createSlice({
	name: "todos",
	initialState: {
		value: [],
	},
	reducers: {
		addTodo(state, action) {
			if (!action.payload) return;
			state.value.push(action.payload);
		},

		deleteTodo(state, action) {
			state.value = state.value.filter(
				(todo) => todo.id !== action.payload
			);
		},

		updateTodoState: {
			reducer(state, action) {
				state.value = state.value.map((todo) => {
					if (todo.id === action.payload.id) {
						return { ...todo, done: action.payload.state };
					}
					return todo;
				});
			},
			prepare(id, state) {
				return { payload: { id, state } };
			},
		},

		updateTodoText: {
			reducer(state, action) {
				state.value = state.value.map((todo) => {
					if (todo.id === action.payload.id) {
						return { ...todo, text: action.payload.text };
					}
					return todo;
				});
			},
			prepare(id, text) {
				return { payload: { id, text } };
			},
		},
	},
});

// Action creators are generated for each case reducer function
export const { addTodo, deleteTodo, updateTodoState, updateTodoText } =
	todosSlice.actions;

export default todosSlice.reducer;
