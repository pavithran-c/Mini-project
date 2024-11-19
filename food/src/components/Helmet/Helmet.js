import React, { useEffect } from "react";

const Helmet = ({ title, children }) => {
  useEffect(() => {
    document.title = "My Pizza - " + title;
  }, [title]); // Only update title when 'title' prop changes

  return <div className="w-100">{children}</div>;
};

export default Helmet;
