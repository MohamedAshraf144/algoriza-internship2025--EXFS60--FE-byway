export const validationService = {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateName(name: string): boolean {
    return name.trim().length >= 2 && name.trim().length <= 50;
  },

  validatePrice(price: number): boolean {
    return price >= 0 && price <= 10000;
  },

  validateDuration(duration: number): boolean {
    return duration >= 1 && duration <= 1000;
  },

  validateRating(rating: number): boolean {
    return rating >= 0 && rating <= 5;
  },

  validateRequired(value: string): boolean {
    return value.trim().length > 0;
  },

  validateStringLength(value: string, min: number, max: number): boolean {
    return value.trim().length >= min && value.trim().length <= max;
  }
};
