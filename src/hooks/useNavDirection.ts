import { createContext, useContext } from "react";

export const NavDirectionContext = createContext<number>(1);
export const useNavDirection = () => useContext(NavDirectionContext);
