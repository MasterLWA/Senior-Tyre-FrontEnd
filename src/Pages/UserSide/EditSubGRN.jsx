import React, { useState } from 'react'

const EditSubGRN = () => {

    const [QuantitiestoShop, setQuantitiestoShop] = useState()


    return (
        <div>
                {/* form to add supplier */}
                <div className="form container text-center m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">

                <h1 className="text-center mb-3">Update GRN Form</h1>

                    <form action="">

                        <input type="text" placeholder="Quantity" className="mt-1 form-control mx-auto" />
                        <br />

                        
                    </form>
                </div>
        </div>
    )
}

export default EditSubGRN