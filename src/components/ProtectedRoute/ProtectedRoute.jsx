import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ loggedIn, component: Component, ...props }) => {
  const navigate = useNavigate();

  return loggedIn ? (
    <Component {...props} />
  ) : (
    navigate("/sign-in", { replace: true })
  );
};

export default ProtectedRoute;
