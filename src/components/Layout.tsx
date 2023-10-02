import { NavigationBar } from "./Navbar";

interface LayoutProps {
  children: any;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-scroll">
      {/* <Drawbar /> */}
      <NavigationBar />
      {children}
    </div>
  );
};

export default Layout;
