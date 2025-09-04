// import React from "react";

// function StudentDashboard() {
//   // Later, you can fetch data from Supabase here
//   const student = {
//     name: "John Doe",
//     email: "john@example.com",
//     courses: ["Math", "Science", "History"],
//   };

//   return (
//     <div style={styles.container}>
//       <h1>Welcome, {student.name} 🎓</h1>
//       <p>Email: {student.email}</p>

//       <h2>Your Courses</h2>
//       <ul style={styles.list}>
//         {student.courses.map((course, index) => (
//           <li key={index} style={styles.listItem}>
//             {course}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     width: "600px",
//     margin: "50px auto",
//     padding: "20px",
//     border: "1px solid #ddd",
//     borderRadius: "10px",
//     background: "#f9f9f9",
//   },
//   list: {
//     listStyle: "none",
//     padding: 0,
//   },
//   listItem: {
//     padding: "10px",
//     margin: "6px 0",
//     background: "#e3f2fd",
//     borderRadius: "5px",
//   },
// };

// export default StudentDashboard;
  





import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        navigate("/login"); // not logged in → back to login
        return;
      }

      if (data.user.email_confirmed_at) {
        setVerified(true); // ✅ email verified
      } else {
        setVerified(false); // ❌ not verified
      }

      setLoading(false);
    };

    checkVerification();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  if (!verified) {
    return (
      <div style={styles.container}>
        <h2>Email not verified ❌</h2>
        <p>Please check your inbox and verify your email before continuing.</p>
        <button style={styles.button} onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>🎓 Student Dashboard</h1>
      <p>Welcome! Your email is verified ✅</p>
    </div>
  );
}

const styles = {
  container: {
    width: "500px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#f9f9f9",
    textAlign: "center",
  },
  button: {
    padding: "10px",
    marginTop: "15px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default StudentDashboard;
