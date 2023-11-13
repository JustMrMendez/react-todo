import { useState } from "react";
import "./App.css";

function App() {
	const [todo, setTodo] = useState([
		{ id: 1, text: "Learn React", done: false },
	]);
	const [newTodoText, setNewTodoText] = useState("");

	const updateTodoState = (id, state) => {
		const newTodo = todo.map((item) => {
			if (item.id === id) {
				return { ...item, done: state };
			}
			return item;
		});
		setTodo(newTodo);
	};

	const updateTodoText = (id, text) => {
		const newTodo = todo.map((item) => {
			if (item.id === id) {
				return { ...item, text };
			}
			return item;
		});
		setTodo(newTodo);
	};

	const addTodo = (text) => {
		const newTodo = [
			...todo,
			{ id: todo.length + 1, text: text, done: false },
		];
		setTodo(newTodo);
	};

	const deleteTodo = (id) => {
		const newTodo = todo.filter((item) => item.id !== id);
		setTodo(newTodo);
	};

	return (
		<div className="container">
			<h1 style={{ color: "white", fontSize: "4rem" }}>{"<"}WON&apos;T DO LIST{" />"}</h1>
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
							addTodo(newTodoText);
							setNewTodoText("");
						}}
						className="new-todo-button">
						✘
					</button>
				</form>
				{todo.map((item) => (
					<li
						className={`todo-item ${item.done ? "done" : ""}`}
						key={item.id}>
						<input
							type="checkbox"
							value={item.done}
							onChange={(e) =>
								updateTodoState(item.id, e.target.checked)
							}
						/>
						<input
							className={`todo-item-input ${
								item.done ? "done" : ""
							}`}
							value={item.text}
							onInput={(e) =>
								updateTodoText(item.id, e.target.value)
							}
						/>
						<button
							onClick={() => deleteTodo(item.id)}
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
