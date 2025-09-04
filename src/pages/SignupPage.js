







import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";


/**
 * SignupPage Component
 * 
 * A user registration form with comprehensive validation and error handling.
 * Features real-time validation feedback and integration with Supabase authentication.
 * 
 * @component
 * @example
 * return (
 *   <SignupPage />
 * )
 */
function SignupPage() {
  // State management for form data, errors, and loading status
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    submit: ""
  });
  
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  
  const [loading, setLoading] = useState(false);

  /**
   * Handles input changes and validates fields in real-time
   * @param {Object} e - The event object from the input field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate field as user types (after they've touched it)
    if (touched[name]) {
      validateField(name, value);
    }
  };

  /**
   * Marks a field as touched when it loses focus
   * @param {Object} e - The event object from the input field
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };

  /**
   * Validates a specific form field
   * @param {string} fieldName - The name of the field to validate
   * @param {string} value - The value of the field to validate
   * @returns {boolean} - True if the field is valid, false otherwise
   */
  const validateField = (fieldName, value) => {
    let error = "";
    
    switch(fieldName) {
      case "name":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (!/^[A-Za-z]+(?:[ -'][A-Za-z]+)*$/.test(value)) {
          error = "Please enter a valid name (letters, spaces, hyphens, and apostrophes only)";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
        
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
        
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
          error = "Password must include uppercase, lowercase, number, and special character";
        }
        break;
        
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
        
      default:
        break;
    }
    
    setErrors({ ...errors, [fieldName]: error });
    return error === "";
  };

  /**
   * Validates the entire form before submission
   * @returns {boolean} - True if the form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      submit: ""
    };
    
    let isValid = true;
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    } else if (!/^[A-Za-z]+(?:[ -'][A-Za-z]+)*$/.test(formData.name)) {
      newErrors.name = "Please enter a valid name";
      isValid = false;
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = "Password must include uppercase, lowercase, number, and special character";
      isValid = false;
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handles form submission
   * @param {Object} e - The event object from the form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show errors
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // 🔥 Supabase signup
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { 
          name: formData.name,
          // You can add more metadata fields here as needed
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrors({ ...errors, submit: error.message });
    } else {
      alert("Signup successful! Please check your email for verification.");
      navigate("/login");
      console.log("User data:", data);     //must not pushed in production
      // You might want to redirect to a confirmation page or login page here
    }
  };

  // Validation checks for live feedback
  const nameChecks = {
    hasValue: formData.name.length > 0,
    validFormat: /^[A-Za-z]+(?:[ -'][A-Za-z]+)*$/.test(formData.name),
    minLength: formData.name.length >= 2
  };

  const emailChecks = {
    hasValue: formData.email.length > 0,
    validFormat: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  };

  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[@$!%*?&]/.test(formData.password)
  };

  const confirmPasswordChecks = {
    matches: formData.confirmPassword === formData.password && formData.password.length > 0
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Your Account</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Name Input */}
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(touched.name && errors.name ? styles.inputError : {}),
              ...(touched.name && !errors.name && formData.name ? styles.inputSuccess : {})
            }}
          />
          
          {/* Name Validation Feedback */}
          {touched.name && (
            <div style={styles.rules}>
              <p style={nameChecks.hasValue ? styles.valid : styles.invalid}>
                {nameChecks.hasValue ? "✅" : "❌"} Name is provided
              </p>
              <p style={nameChecks.validFormat ? styles.valid : styles.invalid}>
                {nameChecks.validFormat ? "✅" : "❌"} Valid name format
              </p>
              <p style={nameChecks.minLength ? styles.valid : styles.invalid}>
                {nameChecks.minLength ? "✅" : "❌"} At least 2 characters
              </p>
            </div>
          )}
          
          {/* Name Error Message */}
          {touched.name && errors.name && (
            <p style={styles.errorText}>{errors.name}</p>
          )}
        </div>

        {/* Email Input */}
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(touched.email && errors.email ? styles.inputError : {}),
              ...(touched.email && !errors.email && formData.email ? styles.inputSuccess : {})
            }}
          />
          
          {/* Email Validation Feedback */}
          {touched.email && (
            <div style={styles.rules}>
              <p style={emailChecks.hasValue ? styles.valid : styles.invalid}>
                {emailChecks.hasValue ? "✅" : "❌"} Email is provided
              </p>
              <p style={emailChecks.validFormat ? styles.valid : styles.invalid}>
                {emailChecks.validFormat ? "✅" : "❌"} Valid email format
              </p>
            </div>
          )}
          
          {/* Email Error Message */}
          {touched.email && errors.email && (
            <p style={styles.errorText}>{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(touched.password && errors.password ? styles.inputError : {}),
              ...(touched.password && !errors.password && formData.password ? styles.inputSuccess : {})
            }}
          />
          
          {/* Password Validation Feedback */}
          {touched.password && (
            <div style={styles.rules}>
              <p style={passwordChecks.length ? styles.valid : styles.invalid}>
                {passwordChecks.length ? "✅" : "❌"} At least 8 characters
              </p>
              <p style={passwordChecks.uppercase ? styles.valid : styles.invalid}>
                {passwordChecks.uppercase ? "✅" : "❌"} At least 1 uppercase letter
              </p>
              <p style={passwordChecks.lowercase ? styles.valid : styles.invalid}>
                {passwordChecks.lowercase ? "✅" : "❌"} At least 1 lowercase letter
              </p>
              <p style={passwordChecks.number ? styles.valid : styles.invalid}>
                {passwordChecks.number ? "✅" : "❌"} At least 1 number
              </p>
              <p style={passwordChecks.special ? styles.valid : styles.invalid}>
                {passwordChecks.special ? "✅" : "❌"} At least 1 special character (@$!%*?&)
              </p>
            </div>
          )}
          
          {/* Password Error Message */}
          {touched.password && errors.password && (
            <p style={styles.errorText}>{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(touched.confirmPassword && errors.confirmPassword ? styles.inputError : {}),
              ...(touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword ? styles.inputSuccess : {})
            }}
          />
          
          {/* Confirm Password Validation Feedback */}
          {touched.confirmPassword && (
            <div style={styles.rules}>
              <p style={confirmPasswordChecks.matches ? styles.valid : styles.invalid}>
                {confirmPasswordChecks.matches ? "✅" : "❌"} Passwords match
              </p>
            </div>
          )}
          
          {/* Confirm Password Error Message */}
          {touched.confirmPassword && errors.confirmPassword && (
            <p style={styles.errorText}>{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Error Message */}
        {errors.submit && (
          <p style={styles.errorText}>{errors.submit}</p>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          style={
            loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button
          } 
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

// Component styles
const styles = {
  container: {
    width: "100%",
    maxWidth: "500px",
    margin: "30px auto",
    padding: "30px",
    border: "1px solid #e1e5eb",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#2d3748",
    fontSize: "28px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#4a5568",
    marginBottom: "5px",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "8px",
    border: "2px solid #e1e5eb",
    fontSize: "16px",
    transition: "all 0.3s ease",
    backgroundColor: "#f9fbfd",
  },
  inputError: {
    borderColor: "#e53e3e",
    backgroundColor: "#fff5f5",
  },
  inputSuccess: {
    borderColor: "#38a169",
    backgroundColor: "#f0fff4",
  },
  rules: {
    marginTop: "8px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#f7fafc",
    fontSize: "14px",
  },
  valid: {
    color: "#38a169",
    margin: "4px 0",
    fontSize: "14px",
  },
  invalid: {
    color: "#e53e3e",
    margin: "4px 0",
    fontSize: "14px",
  },
  errorText: {
    color: "#e53e3e",
    fontSize: "14px",
    marginTop: "5px",
  },
  button: {
    padding: "16px",
    background: "linear-gradient(to right, #38a169, #48bb78)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    marginTop: "15px",
    boxShadow: "0 4px 10px rgba(72, 187, 120, 0.25)",
  },
  buttonDisabled: {
    background: "#a0aec0",
    cursor: "not-allowed",
    boxShadow: "none",
  },
};

export default SignupPage;