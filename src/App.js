
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient"; // ✅ make sure this file exists

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
function App() {
  // const [todos, setTodos] = useState([]);

  // // Fetch data on component mount
  // useEffect(() => {
  //   fetchTodos();
  // }, []);

  // async function fetchTodos() {
  //   const { data, error } = await supabase.from("todos").select("*");
  //   if (error) {
  //     console.error("Error fetching todos:", error);
  //   } else {
  //     setTodos(data);
  //   }
  // }

  // return (
  //   <div style={{ padding: "20px" }}>
  //     <h1>My Todos</h1>
  //     <ul>
  //       {todos.map((todo) => (
  //         <li key={todo.id}>
  //           <strong>{todo.task}</strong> — {todo.is_complete ? "✅ Done" : "❌ Pending"}
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );

  return (
    // used to redirect to different pages
   <Router>
    
      <Routes>
         <Route path="/login" element={<LoginPage />} /> 
         <Route path="/StudentDashboard" element={<StudentDashboard/>}/>
        <Route path="/" element={<SignupPage/>}/>
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
  
}

export default App;

