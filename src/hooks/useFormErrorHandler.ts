import { useMemo } from "react";
import { FieldErrors } from "react-hook-form";

type ErrorMessage = { field: string; message: string };

const useFormErrorHandler = (errors: FieldErrors) => {
    const errorMessages = useMemo(() => {
        const messages: ErrorMessage[] = [];
        Object.keys(errors).forEach((field) => {
            const error = errors[field];
            if (error?.message) {
                messages.push({ field, message: error.message as string });
            }
        });
        return messages;
    }, [errors]);

    return {
        errorMessages,
    };
};

export default useFormErrorHandler;
