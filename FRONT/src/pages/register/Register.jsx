import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
    coverPicture: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" || name === "coverPicture") {
      setUser({ ...user, [name]: files[0] });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("confirmPassword", user.confirmPassword);
    formData.append("profilePicture", user.profilePicture);
    formData.append("coverPicture", user.coverPicture);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        body: formData,   
      });

      if (response.ok) {
        setUser({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          profilePicture: null,
          coverPicture: null,
        });
        alert("User Registered Successfully");
        navigate("/");
      } else {
        alert("User Registration Failed");
      }
    } catch (error) {
      console.log(error);
      alert("User Registration Failed");
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Facebook</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Facebook.
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="loginInput"
                value={user.username}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="loginInput"
                value={user.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="loginInput"
                value={user.password}
                onChange={handleChange}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Password Again"
                className="loginInput"
                value={user.confirmPassword}
                onChange={handleChange}
              />
              <input
                type="file"
                name="profilePicture"
                onChange={handleChange}
                className="loginInput"
              />
              <input
                type="file"
                name="coverPicture"
                onChange={handleChange}
                className="loginInput"
              />
              <button type="submit" className="loginButton">
                Sign Up
              </button>
              <Link to="/login">
                <button type="button" className="loginRegisterButton">
                  Log into Account
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
