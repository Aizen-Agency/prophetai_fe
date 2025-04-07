import { Navbar } from "./components/navbar";
import Product from "./components/product";
import Reviews from "./components/reviews";
import { FAQ } from "./components/faq";
import { FooterComponent } from "./components/footer";
import Header from "./components/header";
export default function Home() {
  return (
    <>
      <Navbar />
      <Header />
      <Product />
      <Reviews />
      <FAQ />
      <FooterComponent />
    </>
  );
}
