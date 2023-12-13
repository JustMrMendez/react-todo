import { useState, useEffect } from "react";
import "./App.css";
import {
	addTodo,
	addTodoFromFirestore,
	deleteTodo,
	updateTodo,
} from "./lib/todosSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./lib/firebase";

function App() {
	const todos = useSelector((state) => state.todos.value);
	const [newTodoText, setNewTodoText] = useState("");
	const dispatch = useDispatch();

	useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				const todoData = { id: change.doc.id, ...change.doc.data() };

				switch (change.type) {
					case "modified":
						dispatch(updateTodo.fulfilled(todoData));
						// If there are other fields that can be modified, handle them similarly
						break;
					case "removed":
						dispatch(deleteTodo.fulfilled(todoData.id));
						break;
					default:
						break;
				}
			});
		});

		return () => unsubscribe();
	}, [dispatch, todos]);

	return (
		<div className="container">
			<h1 style={{ color: "white", fontSize: "4rem" }}>
				{"<"}WON&apos;T DO LIST{" />"}
			</h1>
			<ul className="todo-list">
				<form
					onSubmit={(e) => e.preventDefault()}
					className="todo-form">
					<input
						value={newTodoText}
						onInput={(e) => setNewTodoText(e.target.value)}
						className="new-todo-input"
						placeholder="Add new todo"
					/>
					<button
						onClick={() => {
							dispatch(addTodo(newTodoText));
							setNewTodoText("");
						}}
						className="new-todo-button">
						✘
					</button>
				</form>
				{todos.map((item) => (
					<li
						className={`todo-item ${item.done ? "done" : ""}`}
						key={item.id}
						id={item.id}>
						<input
							type="checkbox"
							value={item.done}
							onChange={(e) =>
								dispatch(
									updateTodo({
										...item,
										done: e.target.checked,
									})
								)
							}
						/>
						<input
							className={`todo-item-input ${
								item.done ? "done" : ""
							}`}
							value={item.text}
							onInput={(e) =>
								dispatch(
									updateTodo({
										...item,
										text: e.target.value,
										id: item.id,
									})
								)
							}
						/>
						<button
							onClick={() => dispatch(deleteTodo(item.id))}
							className="delete-button">
							✘
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
