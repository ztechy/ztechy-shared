# @ztechy/validation

Shared validation utilities for all ZTechy projects. Currently provides strict Egyptian phone number validation with proper handling of edge cases that standard libraries miss.

## 📦 Installation

```bash
npm install @ztechy/validation
# or
yarn add @ztechy/validation
# or
pnpm add @ztechy/validation
```

## 🚀 Quick Start

```typescript
import { isValidEgyptianPhone } from "@ztechy/validation";

// Validate Egyptian phone numbers
const isValid = isValidEgyptianPhone("+201012345678");
console.log(isValid); // true

const isInvalid = isValidEgyptianPhone("+20 12 028400");
console.log(isInvalid); // false (too short - only 8 digits)
```

## 📱 Egyptian Phone Number Validation

### Features

- ✅ **Strict validation** - Rejects invalid numbers that standard libraries might accept
- ✅ **All Egyptian formats** - Mobile (010, 011, 012, 015) and landlines
- ✅ **Length checking** - Ensures exact digit requirements
- ✅ **International support** - Works with +20 prefix or local format
- ✅ **Operator detection** - Identifies Vodafone, Etisalat, Orange, WE
- ✅ **Zero dependencies** - Only peer dependency on `react-phone-number-input`

### Usage

#### Basic Validation

```typescript
import { isValidEgyptianPhone } from "@ztechy/validation";

// Valid Egyptian mobile numbers (11 digits)
isValidEgyptianPhone("+201012345678"); // ✅ true (Vodafone)
isValidEgyptianPhone("+201112345678"); // ✅ true (Etisalat)
isValidEgyptianPhone("+201212345678"); // ✅ true (Orange)
isValidEgyptianPhone("+201512345678"); // ✅ true (WE)
isValidEgyptianPhone("01012345678");   // ✅ true (local format)

// Valid Egyptian landlines
isValidEgyptianPhone("+20223456789");  // ✅ true (Cairo - 10 digits)
isValidEgyptianPhone("+20312345678");  // ✅ true (Alexandria - 9 digits)

// Invalid numbers
isValidEgyptianPhone("+20 12 028400");  // ❌ false (too short - 8 digits)
isValidEgyptianPhone("+201312345678");  // ❌ false (invalid prefix 013)
isValidEgyptianPhone("+2010123456");    // ❌ false (too short)
isValidEgyptianPhone("+20101234567890"); // ❌ false (too long)
```

#### With React Hook Form

```typescript
import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { isValidEgyptianPhone } from "@ztechy/validation";

export function PhoneInputField() {
  const { control } = useFormContext();

  return (
    <Controller
      name="phone"
      control={control}
      rules={{
        required: "رقم الهاتف مطلوب",
        validate: (value) => 
          isValidEgyptianPhone(value) || "رقم الهاتف غير صحيح. يجب أن يكون 11 رقماً"
      }}
      render={({ field }) => (
        <PhoneInput
          {...field}
          international
          defaultCountry="EG"
          placeholder="+20 10 1234 5678"
        />
      )}
    />
  );
}
```

#### With Express.js Backend

```typescript
import { Request, Response, NextFunction } from "express";
import { isValidEgyptianPhone } from "@ztechy/validation";

// Middleware
export const validatePhoneMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      error: "رقم الهاتف مطلوب"
    });
  }

  if (!isValidEgyptianPhone(phone)) {
    return res.status(400).json({
      success: false,
      error: "رقم الهاتف غير صحيح"
    });
  }

  next();
};

// Controller
export const createLead = async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!isValidEgyptianPhone(phone)) {
    return res.status(400).json({
      success: false,
      error: "Invalid Egyptian phone number"
    });
  }

  // Continue with business logic...
};
```

#### Plain JavaScript

```typescript
import { isValidEgyptianPhone } from "@ztechy/validation";

const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("blur", (e) => {
  const phone = e.target.value;
  
  if (!isValidEgyptianPhone(phone)) {
    alert("رقم الهاتف غير صحيح");
  }
});
```

## 📋 Egyptian Phone Number Format Reference

### Mobile Numbers (11 digits)
| Operator | Prefix | Format | Example |
|----------|--------|--------|---------|
| Vodafone | 010 | 010 XXXX XXXX | +201012345678 |
| Etisalat | 011 | 011 XXXX XXXX | +201112345678 |
| Orange | 012 | 012 XXXX XXXX | +201212345678 |
| WE | 015 | 015 XXXX XXXX | +201512345678 |

### Landline Numbers
| City | Prefix | Digits | Format | Example |
|------|--------|--------|--------|---------|
| Cairo | 02 | 10 | 02 XXXX XXXX | +20223456789 |
| Alexandria | 03 | 9 | 03 XXX XXXX | +20312345678 |
| Other cities | 04-09 | 9 | 0X XXX XXXX | +20482345678 |

## ⚠️ Why This Package?

The standard `libphonenumber-js` library has known issues with Egyptian numbers:

```typescript
// ❌ Problem: Standard library accepts invalid short numbers
import { isValidPhoneNumber } from "libphonenumber-js";
isValidPhoneNumber("+20 12 028400"); // true ❌ WRONG! (only 8 digits)

// ✅ Solution: Our strict validation
import { isValidEgyptianPhone } from "@ztechy/validation";
isValidEgyptianPhone("+20 12 028400"); // false ✅ CORRECT!
```

This package provides **strict validation** that ensures Egyptian numbers meet the actual length requirements.

## 🔧 API Reference

### `isValidEgyptianPhone(phone: string): boolean`

Validates Egyptian phone numbers with strict length checking.

**Parameters:**
- `phone` (string): Phone number in any format (international or local)

**Returns:**
- `boolean`: `true` if valid Egyptian phone number, `false` otherwise

**Examples:**
```typescript
isValidEgyptianPhone("+201012345678")  // true
isValidEgyptianPhone("01012345678")    // true
isValidEgyptianPhone("+20 10 1234 5678") // true (with spaces)
isValidEgyptianPhone("+20 12 028400")  // false (too short)
```

## 🧪 Testing

The package includes comprehensive tests covering:
- ✅ All Egyptian mobile operators
- ✅ Cairo, Alexandria, and other city landlines
- ✅ Invalid prefixes and lengths
- ✅ Edge cases (empty strings, null, undefined)
- ✅ Various formatting styles

Run tests:
```bash
npm test
```

## 📚 TypeScript Support

Full TypeScript support included with type definitions.

```typescript
import { isValidEgyptianPhone } from "@ztechy/validation";

const phone: string = "+201012345678";
const isValid: boolean = isValidEgyptianPhone(phone);
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/ztechy-shared.git
cd ztechy-shared/packages/validation

# Install dependencies
npm install

# Run tests
npm test

# Type check
npm run type-check
```

## 📦 Package Structure

```
validation/
├── src/
│   └── index.ts           # Main validation function
├── tests/
│   └── index.test.ts      # Test suite
├── package.json
├── tsconfig.json
└── README.md
```

## 🐛 Known Issues

None currently. If you find a bug, please [open an issue](https://github.com/your-org/ztechy-shared/issues).

## 📝 Changelog

### v0.0.1 (Initial Release)
- ✨ Added `isValidEgyptianPhone()` function
- ✅ Strict validation for Egyptian mobile and landline numbers
- 📱 Support for all major Egyptian operators (Vodafone, Etisalat, Orange, WE)
- 🧪 Comprehensive test suite

## 📄 License

MIT

## 👥 Authors

ZTechy Team

## 🔗 Related Packages

- [@ztechy/auth](../auth) - Authentication utilities

## 📞 Support

For issues and questions:
- 📧 Email: support@ztechy.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/ztechy-shared/issues)
- 💬 Discord: [Join our community](https://discord.gg/ztechy)

---

Made with ❤️ by ZTechy Team