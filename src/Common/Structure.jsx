import Footer from "./Footer";
import RouterApp from "../Routers/RouterApp";
import Header from "./Header";


const Structure = () => {
    return (
        <>
            <Header />
                <div>
                    <RouterApp />
                </div>

            <Footer />
        </>
    );
}

export default Structure;