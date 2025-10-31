# MyPocketPal-Client Copilot Instructions

## Project Overview

MyPocketPal-Client is a German-language personal finance tracking web application. It's a single-page application (SPA) built with vanilla JavaScript that helps users manage their financial transactions, budgets, and categories.

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **No Framework**: Pure JavaScript without any frameworks like React, Vue, or Angular
- **Backend API**: ASP.NET Core Web API running on `https://localhost:7248`
- **Authentication**: Cookie-based authentication with credentials
- **Styling**: Custom CSS with Material Icons for icons
- **Language**: German (UI and comments)

## Project Structure

```
MyPocketPal-Client/
├── index.html          # Main page with transaction management
├── login.html          # Login/registration page
├── setting.html        # Settings page for user preferences
├── css/
│   ├── main.css       # Main stylesheet with beige color scheme
│   └── login.css      # Login page specific styles
├── js/
│   ├── index.js       # Transaction management logic
│   ├── main.js        # Shared utilities, API calls, authentication
│   ├── login.js       # Login/registration logic
│   └── settings.js    # Settings page logic
└── img/               # Images and icons
```

## Architecture & Patterns

### File Organization

- **HTML Files**: Each page is a separate HTML file with its own purpose
- **JavaScript Modules**: JavaScript is organized by page/feature, not by type
- **Shared Code**: `main.js` contains shared functionality used across all pages

### Code Conventions

1. **Language**: 
   - UI text and comments are in German
   - Variable and function names are in English
   - Example: `const username = "..."; // Benutzername`

2. **JavaScript Style**:
   - Use `async/await` for asynchronous operations
   - Use `const` and `let`, avoid `var`
   - Use template literals for string interpolation
   - Functions are typically declared as `async function functionName()` or `function functionName()`
   - Arrow functions are used for callbacks and event listeners

3. **Naming Conventions**:
   - Functions: camelCase (e.g., `getUserStatus`, `handleNewTransaction`)
   - Variables: camelCase (e.g., `transactionId`, `categoryName`)
   - Constants: camelCase for most, UPPER_SNAKE_CASE rarely used
   - HTML IDs: kebab-case (e.g., `add-transaction-btn`, `new-transaction-form`)

4. **HTML/CSS**:
   - Use semantic HTML5 elements
   - CSS follows BEM-like naming for complex components
   - Color scheme: Beige tones (#f5f0e6, #a68b7b, #8d7b69, #5f4b33)
   - Responsive design with viewport meta tag

## API Integration

### Backend API Base URL
```javascript
const API_BASE = "https://localhost:7248/api";
```

### Common API Endpoints

**User Management:**
- `GET /api/user/status` - Check if user is logged in
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `POST /api/user/logout` - Logout user

**Transactions:**
- `GET /api/transaction/` - Get all transactions
- `POST /api/transaction` - Create new transaction
- `PUT /api/transaction/{id}` - Update transaction
- `DELETE /api/transaction/{id}` - Delete transaction
- `GET /api/transaction/{id}` - Get single transaction
- `GET /api/transaction/balance` - Get user balance
- `GET /api/transaction/transactions?IsIncome=false` - Get expenses

**Categories:**
- `GET /api/category` - Get all categories
- `GET /api/category?isIncome={boolean}` - Get categories by type
- `POST /api/category/create` - Create new category
- `GET /api/category/search/{name}/{isIncome}` - Search categories

**Settings:**
- `GET /api/settings/` - Get user settings
- `POST /api/settings` - Create/update settings

### API Call Pattern

All API calls follow this pattern:
```javascript
const response = await fetch(url, {
  method: "GET|POST|PUT|DELETE",
  credentials: "include",  // Important for cookie auth
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data), // For POST/PUT
});

if (!response.ok) {
  throw new Error("Error message");
}

return await response.json();
```

## Key Features

### 1. Transaction Management
- Add, edit, delete transactions
- Filter by category, type (income/expense), date
- Sort by various fields
- Import/export transactions (CSV)
- Automatic AI categorization using Ollama API

### 2. Category Management
- Create custom categories
- Filter categories by income/expense type
- Dynamic category dropdowns

### 3. User Settings
- Monthly budget management
- Currency selection
- Notification preferences
- Warning display toggles

### 4. Authentication
- Cookie-based session management
- Login/logout functionality
- User registration
- Protected routes (redirect if not authenticated)

## Development Guidelines

### When Adding New Features

1. **Check User Authentication**: Most features require the user to be logged in
   ```javascript
   const userStatus = await checkUserStatusAndUpdateUI();
   if (userStatus && userStatus.isLoggedIn) {
     // Feature logic
   }
   ```

2. **Follow the Modal Pattern**: Use modals for forms (see transaction modal)
   - Open/close functions
   - Form submission handlers
   - Validation before submission

3. **Use Existing Helper Functions**: Leverage shared utilities in `main.js`
   - `displayMessage()` for user feedback
   - `fetchWithErrorHandling()` for API calls
   - `formatDate()` for date formatting

4. **Handle Errors Gracefully**: Always use try-catch and provide user feedback
   ```javascript
   try {
     // API call
   } catch (error) {
     console.error("Fehler:", error);
     displayMessage(errorElement, "Fehler beim...", false);
   }
   ```

### When Modifying Existing Code

1. **Maintain German UI Text**: Keep all user-facing text in German
2. **Preserve the Color Scheme**: Use existing beige color palette
3. **Keep the Flat Structure**: Don't introduce unnecessary complexity
4. **Test Authentication Flow**: Ensure login/logout still works
5. **Maintain API Compatibility**: Don't break existing API contracts

### Testing Considerations

- Test with backend API running on `https://localhost:7248`
- Test both authenticated and unauthenticated states
- Test across different pages (index, login, settings)
- Verify form validation works correctly
- Test with German locale/language settings

## Common Patterns to Follow

### Event Listeners
```javascript
document.getElementById("element-id").addEventListener("click", functionName);
```

### Form Handling
```javascript
async function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  // Process form data
}
```

### DOM Updates
```javascript
element.textContent = value;  // For text
element.innerHTML = htmlString;  // For HTML
element.style.display = "none|block";  // For visibility
```

### Display Messages
```javascript
displayMessage(element, message, isSuccess);
```

## Files You'll Likely Modify

- **`js/index.js`**: Transaction-related features
- **`js/main.js`**: Shared utilities, API calls, authentication
- **`js/settings.js`**: User settings and preferences
- **`css/main.css`**: Styling changes
- **`index.html`**: Main page structure

## Important Notes

1. **Backend Dependency**: This is a frontend-only repository. The backend API must be running separately
2. **HTTPS Localhost**: API uses HTTPS on localhost - certificate warnings are expected in development
3. **German Language**: Maintain German for all UI text and error messages
4. **No Build Process**: This is a static site with no build step - files are served as-is
5. **Cookie Authentication**: All API calls must include `credentials: "include"` for authentication to work

## When in Doubt

- Keep code simple and maintain the existing vanilla JavaScript approach
- Follow the patterns already established in the codebase
- Use German for user-facing text
- Test authentication flows
- Ensure backward compatibility with the existing API
