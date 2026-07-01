import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export const SuccessToast = ({ message }) => (
    <div className="premium-toast success-toast">
        <div className="toast-icon success-icon">
            <CheckCircle2 size={22} />
        </div>

        <div className="toast-content">
            <h4>Success</h4>
            <p>{message}</p>
        </div>
    </div>
);

export const ErrorToast = ({ message }) => (
    <div className="premium-toast error-toast">
        <div className="toast-icon error-icon">
            <AlertTriangle size={22} />
        </div>

        <div className="toast-content">
            <h4>Error</h4>
            <p>{message}</p>
        </div>
    </div>
);

export const InfoToast = ({ message }) => (
    <div className="premium-toast info-toast">
        <div className="toast-icon info-icon">
            <Info size={22} />
        </div>

        <div className="toast-content">
            <h4>Information</h4>
            <p>{message}</p>
        </div>
    </div>
);