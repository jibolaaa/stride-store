import MotionRoot from "./MotionRoot";
import { UIProvider } from "./UIProvider";
import { CartProvider } from "./CartProvider";
import SmoothScroll from "./SmoothScroll";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import MenuDrawer from "./MenuDrawer";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "./CartDrawer";
import QuickAddSheet from "./QuickAddSheet";
import Toast from "./Toast";

// Everything around the shop's pages: header, footer, bag, menu and search.
// The back office (/office) has its own frame instead.
export default function StoreShell({ children }) {
  return (
    <MotionRoot>
      <UIProvider>
        <CartProvider>
          <SmoothScroll />
          <AnnouncementBar />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <MenuDrawer />
          <SearchOverlay />
          <CartDrawer />
          <QuickAddSheet />
          <Toast />
        </CartProvider>
      </UIProvider>
    </MotionRoot>
  );
}
