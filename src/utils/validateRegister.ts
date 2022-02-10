import { EmailPasswordInput } from "../resolvers/EmailPasswordInput";

const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const validateRegister = ({ email, password }: EmailPasswordInput) => {

    if (!validateEmail(email)) {
        return [
            {
                field: "email",
                message: "invalid email",
            },
        ];
    }

    if (password.length < 6) {
        return [
            {
                field: "password",
                message: "Your password must be at least 6 characters long"
            }
        ]
    }

    if (password.search(/[a-z]/i) < 0) {
        return [
            {
                field: "password",
                message: "Your password must contain at least one letter"
            }
        ]
    }

    if (password.search(/[A-Z]/) < 0) {
        return [
            {
                field: "password",
                message: "Your password must contain at least one uppercase letter"
            }
        ]
    }

    if (password.search(/[0-9]/) < 0) {
        return [
            {
                field: "password",
                message: "Your password must contain at least one digit"
            }
        ]
    }

    if (password.search(/.*[!@#$%^&*() =+_-]/) < 0) {
        return [
            {
                field: "password",
                message: "Your password must contain at least one special character or space"
            }
        ]
    }


    return null;
};