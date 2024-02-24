# Redux Supermarket

Redux Supermarket is a web application built with Django and React(Redux). It allows users to register, login, view products, and perform various CRUD operations on products.

## Features

- User authentication: Users can register, login, and logout securely.
- Product management: Authenticated users can view products, add new products, update existing products, and delete products.
- Token-based authentication: JWT (JSON Web Tokens) are used for user authentication and authorization.
- Refresh Token system: Users can choose to stay logged in and have their Access Tokens refreshed.
- Responsive UI: The frontend is built using React, providing a responsive and intuitive user interface.

## Preview
![Preview Image](https://i.imgur.com/IuX4l9c.png)

## Technologies Used

- Django: Backend framework for building the RESTful API.
- Django REST Framework: Toolkit for building Web APIs in Django.
- React: JavaScript library for building user interfaces.
- Redux: State management library for managing application state in React.
- Redux Toolkit: Library for efficient Redux development, including tools like createSlice and createAsyncThunk.
- Axios: Promise-based HTTP client for making API requests from the frontend.
- JWT (JSON Web Tokens): Token-based authentication mechanism used for user authentication and authorization.
- react-toastify: Library for displaying toast notifications in React applications.

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Jindouz/redux_djg_supermarket_login.git
```

2. Install dependencies for the backend:
```bash
cd backend
#Create Virtual Environment
pip install -r requirements.txt
```

3. Run the Django development server:
```bash
python manage.py runserver
```

4. Install dependencies for the frontend:
```bash
cd frontend
npm install
```

5. Run the React development server:
```bash
npm start
```

7. Access the application in your web browser at `http://localhost:3000`.

## API Endpoints

- `/register`: POST endpoint for user registration.
- `/login`: POST endpoint for user login.
- `/refersh-token`: POST endpoint for refresh token requests (requires authentication).
- `/products`: GET endpoint for fetching products.
- `/authproducts`: POST endpoint for adding products (requires authentication).
- `/authproducts/<int:id>`: GET, PUT, DELETE endpoints for fetching, updating, and deleting individual products (requires authentication).

## Authors

- [Maor](https://github.com/Jindouz)



