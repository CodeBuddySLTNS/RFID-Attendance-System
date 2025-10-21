import React, { type ReactNode } from "react";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="w-full h-dvh grid grid-rows-[max-content_1fr]">
      <div className="w-full p-2 px-3 text-white bg-primary shadow">
        <div className="flex gap-2">
          <div className="flex justify-center items-center">
            <div className="w-10 aspect-square rounded-full bg-gray-200"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-snug">
              Philippine Advent College Inc. - Salug Campus
            </h1>
            <h3 className="leading-tight text-muted">
              Poblacion East, Salug, Zamboanga del Norte
            </h3>
          </div>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
};

export default Layout;
