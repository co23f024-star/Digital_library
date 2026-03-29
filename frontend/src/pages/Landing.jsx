import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/landingpage1.png";

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id:
        "367392967591-ffd6glp7d1v6h1939vu5ipq8iijsg9is.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      {
        theme: "filled_blue",
        size: "large",
        width: 280,
      }
    );
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await axios.post(
        "https://digital-library-wtvm.onrender.com/auth/google-login",  // ✅ CORRECT URL
        { idToken: response.credential }
      );

      // Save token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      // Redirect by role
      if (res.data.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }

    } catch (error) {
      console.error(error.response?.data || error);
      alert("Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative text-center backdrop-blur-sm px-10 py-12 rounded-2xl">
        <h1 className="text-6xl font-black mb-4 text-blue-300 drop-shadow-lg">
          DIGITAL LIBRARY
        </h1>

        <p className="text-2xl font-bold mb-10 text-indigo-200">
          Secure Cloud-Based Library for YBIT Students & Staff
        </p>

        <div className="flex justify-center">
          <div id="googleBtn"></div>
        </div>
      </div>
    </div>
  );
}

export default Landing;