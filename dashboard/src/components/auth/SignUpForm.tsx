import React, { useState } from "react";
import { Link } from "react-router-dom";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    terms: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    let newErrors = { fname: "", lname: "", email: "", password: "", terms: "" };
    let isValid = true;

    if (!formData.fname) {
      newErrors.fname = "First name is required!";
      isValid = false;
    }

    if (!formData.lname) {
      newErrors.lname = "Last name is required!";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required!";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format!";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required!";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
      isValid = false;
    }

    if (!isChecked) {
      newErrors.terms = "You must agree to the terms and conditions!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Submitting", formData);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700">
          <i className="pi pi-chevron-left size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">Sign Up</h1>
        <p className="text-sm text-gray-500">Enter your details to create an account!</p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="fname" className="">First Name <span className="text-error-500">*</span></Label>
                <Input
                  type="text"
                  id="fname"
                  name="fname"
                  placeholder="Enter your first name"
                  value={formData.fname}
                  onChange={handleChange}
                  error={!!errors.fname}
                  min="0"
                  max="100"
                  step="1"
                  hint=""
                />
                {errors.fname && <p className="text-red-500 text-sm">{errors.fname}</p>}
              </div>
              <div>
                <Label htmlFor="lname" className="">Last Name <span className="text-error-500">*</span></Label>
                <Input
                  type="text"
                  id="lname"
                  name="lname"
                  placeholder="Enter your last name"
                  value={formData.lname}
                  onChange={handleChange}
                  error={!!errors.lname}
                  min="0"
                  max="100"
                  step="1"
                  hint=""
                />
                {errors.lname && <p className="text-red-500 text-sm">{errors.lname}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="">Email <span className="text-error-500">*</span></Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                min="0"
                max="100"
                step="1"
                hint=""
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="">Password <span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`${errors.password ? "border-red-500" : "border-gray-300"}`}
                  error={!!errors.password}
                  min="0"
                  max="100"
                  step="1"
                  hint=""
                />
                <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/5 cursor-pointer">
                  {showPassword ? <i className="pi pi-eye" /> : <i className="pi pi-eye-slash" />}
                </span>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="flex items-center gap-3">
              <Checkbox id="terms-checkbox" label="Agree to terms" checked={isChecked} onChange={setIsChecked} />
              <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                You must to agree to the{" "}
                <span className="text-gray-800 dark:text-white/90">Terms and Conditions,</span>{" "}
                and our <span className="text-gray-800 dark:text-white">Privacy Policy</span>
              </p>
            </div>
            {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

            <Button onClick={handleSubmit} className="w-full" startIcon={null} endIcon={null}>Sign Up</Button>
          </div>
        </form>

        <p className="text-sm text-center mt-5">
          Already have an account?{" "}
          <Link to="/Signin" className="text-brand-500 hover:text-brand-600">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
