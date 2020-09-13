export interface IValidator {
    isValid: boolean;
    message?: string;
}

export const validateInput = (inputParams: string[], input: any): IValidator => {
    let param;
    if (input === null || isEmpty(input)) {
        return {
            isValid: false,
            message: 'Input is empty or has wrong format',
        };
    }

    for (let i = 0; i < inputParams.length; i++) {
        param = inputParams[i];
        if (isEmpty(input[param]))
            return {
                isValid: false,
                message: `Input parameter ${param} is empty or has wrong format`,
            };
    }
    return {
        isValid: true,
    };
};

export const validateEmail = (email: string): IValidator => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return {
        isValid: regex.test(email.toLowerCase()),
        message: `Input email ${email} has incorrect format`,
    };
};

export const validateProductIDFormat = (productID: string): IValidator => {
    const array = productID.split('-');
    if (array.length < 2) {
        return {
            isValid: false,
            message: `ProductID ${productID} has wrong format`,
        };
    }
    return {
        isValid: true,
    };
};

export const isEmpty = (value: any): boolean => {
    return typeof value === 'string' && !value.trim() || typeof value === 'undefined' || value === null;
};

export const isInt = (n) => (parseInt(n) === n);
