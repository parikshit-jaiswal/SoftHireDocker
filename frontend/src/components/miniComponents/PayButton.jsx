import { redirectToCheckout } from "@/Api/StripeServices";
import React from "react";

const PayButton = ({ applicationId, token }) => {
    const handlePay = () => {
        redirectToCheckout(applicationId, token);
    };

    return (
        <button onClick={handlePay} className="btn btn-primary">
            Pay Application Fee
        </button>
    );
};

export default PayButton;
