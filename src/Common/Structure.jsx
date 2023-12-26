import Footer from "./Footer";
import RouterApp from "../Routers/RouterApp";
import Header from "./Header";


const Structure = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
                <div>
                    <RouterApp />
                </div>

            <Footer />
        </div>
    );
}

export default Structure;