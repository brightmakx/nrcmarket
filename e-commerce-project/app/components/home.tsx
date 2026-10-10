import Banner from "./banner";
import Categories from "./products/categories";
import SpecialOffers from "./specialOffers";
import Services from "./services";
import LatestProducts from "./products/LatestProduct";
import WhyMarket from "./WhyMarket";
import BecomeProvider from "./BecomeProvider";
import Footer from "./footer";

export default function Home() {
    return (
        <>
            <Banner />
            <Categories />
            <SpecialOffers />
            <Services />
            <LatestProducts />
            <WhyMarket />
            <BecomeProvider />
            <Footer />
        </>
    );
}