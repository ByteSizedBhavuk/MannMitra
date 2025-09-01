
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient"; // ✅ make sure this file exists

function App() {
  const [todos, setTodos] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const { data, error } = await supabase.from("todos").select("*");
    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setTodos(data);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <strong>{todo.task}</strong> — {todo.is_complete ? "✅ Done" : "❌ Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

