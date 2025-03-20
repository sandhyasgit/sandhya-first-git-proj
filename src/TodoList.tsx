import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define types for the Todo item
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const url='http://localhost:5000/todos';
const TodoList: React.FC = () => {
  // State to manage the list of todos
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  // Fetch todos from the backend API
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${url}`);
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos', error);
      }
    };

    fetchTodos();
  }, []);

  // Handle the change in the input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };
  // Handle adding a new todo
  const handleAddTodo = async () => {
    if (newTodo.trim() === '') return;

    try {
      const response = await axios.post(`${url}`, {
        text: newTodo,
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo', error);
    }
  };
  
  // Toggle the completed status of a todo
  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      await axios.put(`${url}/${id}`, {
        completed: !completed,
      });
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    } catch (error) {
      console.error('Error updating todo', error);
    }
  };

  // Handle deleting a todo
  const handleDeleteTodo = async (id: number) => {
    try {
      await axios.delete(`${url}/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };

  return (
    <div className="todo-list">
      <h1>Todo List React + MySQL</h1>

      <input
        type="text"
        value={newTodo}
        onChange={handleInputChange}
        placeholder="Add a new todo..."
      />
      <button onClick={handleAddTodo}>Add</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <span onClick={() => handleToggleComplete(todo.id, todo.completed)}>{todo.text}</span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
