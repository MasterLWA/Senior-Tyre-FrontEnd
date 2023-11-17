import StockBalanceTable  from "../Components/StockBalanceTable";
import DashboardNavbar from "../Components/DashboardNavbar";

const Dashbord = () => {
    return (   
        <div>
        <DashboardNavbar/>
        <div className="container">
            <StockBalanceTable/>
        </div>
        </div>
    );

}

export default Dashbord;