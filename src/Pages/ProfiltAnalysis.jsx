import DashboardNavbar from "../Components/DashboardNavbar";


// This Page filter transactions by date and show profit and loss reports
// Also Generate PDF Reports and Excel Reports

const ProfitAnalysis = () => {
    return (
        <div>
            <DashboardNavbar />

            <div className="container">
                <h1 className="text-center mb-3 mt-3">
                    Profit Analysis</h1>

                <div className="container text-center m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">

                </div>

            </div>

        </div>
    );
}

export default ProfitAnalysis;