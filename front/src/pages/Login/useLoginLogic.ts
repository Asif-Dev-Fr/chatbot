import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assurez-vous d'avoir react-router-dom installé
import { FormDataLogin } from "../../types";

const validationSchema = yup.object().shape({
  email: yup.string().required("Email is required").email("Email is invalid"),
  password: yup.string().required("Password is required"),
});

export const useLoginLogic = () => {
  const { register, handleSubmit, formState } = useForm<FormDataLogin>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur", // Validate on blur
  });
  const navigate = useNavigate();

  const onSubmit = async (data: FormDataLogin) => {
    try {
      const userInfo = {
        email: data.email,
        password: data.password,
      };
      // Assurez-vous que cette route correspond à votre backend Flask
      const response = await axios.post("/login", userInfo);

      // Handle successful login (e.g., store token, redirect)
      console.log("Login successful:", response.data);
      const token = response.data.token; // Assuming your backend returns a JWT token
      localStorage.setItem("authToken", token); // Store the token (consider security implications)
      navigate("/"); // Redirect to the main page
    } catch (error: any) {
      // Handle login errors (e.g., display error message)
      console.error("Login failed:", error.response?.data);
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
