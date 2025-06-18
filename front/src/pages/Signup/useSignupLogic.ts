import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assurez-vous d'avoir react-router-dom installé
import { FormDataSignup } from "../../types";

const validationSchema = yup.object().shape({
  email: yup.string().required("Email is required").email("Email is invalid"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const useSignupLogic = () => {
  const { register, handleSubmit, formState } = useForm<FormDataSignup>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur", // Validate on blur
  });
  const navigate = useNavigate();

  const onSubmit = async (data: FormDataSignup) => {
    try {
      const userInfo = {
        email: data.email,
        password: data.password,
      };

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${apiBaseUrl}/auth/signup`, userInfo, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      // const response = await fetch(`${apiBaseUrl}/auth/signup`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(userInfo),
      // });

      // Handle successful signup (e.g., store token, redirect)
      console.log("Signup successful:", response);
      // For now, let's just redirect to the login page
      // navigate("/login");
    } catch (error: any) {
      // Handle signup errors (e.g., display error message)
      console.error("Signup failed:", error.response?.data);
      // You might want to set an error state to display to the user
    }
  };

  return {
    register,
    handleSubmit,
    formState,
    onSubmit,
  };
};
