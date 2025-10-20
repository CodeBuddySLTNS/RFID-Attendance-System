import React, { type ReactNode } from "react";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="w-full h-dvh">{children}</div>;
};

export default Layout;
