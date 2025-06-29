import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Content from "../pages/Content";

const Layout = () => {
  return (
    <div className="layout">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/content/:id" element={<Content />} />
      </Routes>
    </div>
  );
};

export default Layout;
