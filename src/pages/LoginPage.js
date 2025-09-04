





import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();

    // State management for form data, errors, and loading status
    const [formData, setFormData] = useState({ 
        email: "", 
        password: "" 
    });
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });
    const [touched, setTouched] = useState({
        email: false,
        password: false
    });
    const [loading, setLoading] = useState(false);

    // Handle input changes and validate in real-time
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Validate field as user types (after they've touched it)
        if (touched[name]) {
            validateField(name, value);
        }
    };

    // Mark field as touched when user focuses out
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        validateField(name, formData[name]);
    };

    // Validate individual fields
    const validateField = (fieldName, value) => {
        let error = "";
        
        switch(fieldName) {
            case "email":
                if (!value) {
                    error = "Email is required";
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                    error = "Invalid email address";
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
            default:
                break;
        }
        
        setErrors({ ...errors, [fieldName]: error });
        return error === "";
    };

    // Validate entire form before submission
    const validateForm = () => {
        const newErrors = {
            email: "",
            password: ""
        };
        
        let isValid = true;
        
        // Validate email
        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = "Invalid email address";
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
        
        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mark all fields as touched to show errors
        setTouched({
            email: true,
            password: true
        });
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        // 🔥 Supabase login
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        setLoading(false);

        if (error) {
            setErrors({ ...errors, submit: error.message });
        } else {
            alert("Login successful!");
            console.log("User session:", data);
            console.log(data.session.access_token);
            navigate('/Studentdashboard');
        }
    };

    // Password rule checks for live feedback
    const passwordChecks = {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /\d/.test(formData.password),
        special: /[@$!%*?&]/.test(formData.password),
    };

    // Email validation for live feedback
    const emailChecks = {
        valid: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email),
        hasValue: formData.email.length > 0
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Email Input with Live Validation */}
                <div style={styles.inputGroup}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
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
                            <p style={emailChecks.valid ? styles.valid : styles.invalid}>
                                {emailChecks.valid ? "✅" : "❌"} Valid email format
                            </p>
                        </div>
                    )}
                    
                    {/* Email Error Message */}
                    {touched.email && errors.email && (
                        <p style={styles.errorText}>{errors.email}</p>
                    )}
                </div>

                {/* Password Input with Live Validation */}
                <div style={styles.inputGroup}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
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
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

// Styles for the component
const styles = {
    container: {
        width: "100%",
        maxWidth: "400px",
        margin: "50px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        background: "#f9f9f9",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    title: {
        textAlign: "center",
        marginBottom: "25px",
        color: "#333",
        fontSize: "28px",
        fontWeight: "600",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    input: {
        padding: "14px",
        borderRadius: "8px",
        border: "2px solid #ddd",
        fontSize: "16px",
        transition: "all 0.3s ease",
    },
    inputError: {
        borderColor: "#ff5252",
        backgroundColor: "#fff9f9",
    },
    inputSuccess: {
        borderColor: "#4CAF50",
        backgroundColor: "#f9fff9",
    },
    rules: {
        marginTop: "8px",
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "#f5f5f5",
        fontSize: "14px",
    },
    valid: {
        color: "#4CAF50",
        margin: "4px 0",
    },
    invalid: {
        color: "#ff5252",
        margin: "4px 0",
    },
    errorText: {
        color: "#ff5252",
        fontSize: "14px",
        marginTop: "5px",
    },
    button: {
        padding: "14px",
        background: "#1976d2",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        transition: "all 0.3s ease",
        marginTop: "10px",
    },
    buttonDisabled: {
        background: "#cccccc",
        cursor: "not-allowed",
    },
};

export default LoginPage;