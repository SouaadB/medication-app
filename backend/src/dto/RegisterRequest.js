class RegisterRequest {
    constructor(data) {
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.phone = data.phone;
        this.chifaCardRegistrationNumber = data.chifaCardRegistrationNumber;
        this.dateOfBirth = data.dateOfBirth;
        this.smartphoneSkillLevel = data.smartphoneSkillLevel;
    }

    // Validate CHIFA number (exactly 9 digits)
    static isValidChifaNumber(number) {
        const chifaRegex = /^[0-9]{9}$/;
        return chifaRegex.test(number);
    }

    // Validate phone number (10 digits, starts with 05, 06, or 07)
    static isValidPhoneNumber(phone) {
        const phoneRegex = /^(05|06|07)[0-9]{8}$/;
        return phoneRegex.test(phone);
    }

    // Validate date format (DD-MM-YYYY)
    static isValidDateFormat(date) {
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/;
        return dateRegex.test(date);
    }

    // Validate smartphone skill level
    static isValidSkillLevel(level) {
        const validLevels = ['BASIC', 'INTERMEDIATE', 'ADVANCED'];
        return validLevels.includes(level);
    }

    // Validate password strength
    static isValidPassword(password) {
        // At least 8 characters
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters long' };
        }
        
        // At least one lowercase letter
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one lowercase letter' };
        }
        
        // At least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one uppercase letter' };
        }
        
        // At least one number
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one number' };
        }
        
        // At least one special character
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one special character (!@#$%^&* etc.)' };
        }
        
        return { valid: true };
    }

    // Convert DD-MM-YYYY to MySQL date format (YYYY-MM-DD)
    static convertToMySQLDate(date) {
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day}`;
    }
}

module.exports = RegisterRequest;