import { useState, useEffect } from "react";
import "./App.css";
import {
	addTodo,
	deleteTodo,
	updateTodoState,
	updateTodoText,
} from "./lib/todosSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./lib/firebase";

function App() {
	const todos = useSelector((state) => state.todos.value);
	const [newTodoText, setNewTodoText] = useState("");
	const dispatch = useDispatch();

	useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				switch (change.type) {
					case "added":
						dispatch(
							addTodo({
								id: change.doc.id,
								...change.doc.data(),
							})
						);
						break;
					case "modified":
						dispatch(
							updateTodoText(
								change.doc.id,
								change.doc.data().text
							)
						);
						dispatch(
							updateTodoState(
								change.doc.id,
								change.doc.data().done
							)
						);
						break;
					case "removed":
						dispatch(deleteTodo(change.doc.id));
						break;
					default:
						break;
				}
			});
		});

		return unsubscribe;
	}, []);

	const handleAddTodo = async (text) => {
		const newTodo = { text, done: false };
		const docRef = doc(collection(db, "todos"));
		await setDoc(docRef, newTodo);
	};

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
							handleAddTodo(newTodoText);
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
									updateTodoState(item.id, e.target.checked)
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
									updateTodoText(item.id, e.target.value)
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
