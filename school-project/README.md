# School Directory Application

This is a web application for a school directory, built with Next.js and a MySQL database. It allows users to view a list of schools and add new ones via a submission form.

## Features

- **Discover Schools:** Browse a list of schools from a connected MySQL database.
- **Add a School:** A form to submit new school information, including name, address, contact details, and an image.
- **Dynamic Data Display:** Fetches and displays school data from a public API endpoint.
- **Responsive Design:** A clean, responsive user interface.

## Technologies Used

- **Frontend:** Next.js (React)
- **Styling:** CSS Modules
- **Database:** MySQL
- **ORM/Database Driver:** mysql2

## Getting Started

### Prerequisites

You need to have the following installed on your machine:

- Node.js (v14.x or higher)
- npm or yarn
- A running MySQL database instance

### Installation

1.  Clone the repository:
    git clone [https://github.com/belikecoder/school-directory.git]
    cd school-directory
    
2.  Install the dependencies:
    
    npm install
 
    
3.  Set up your environment variables:
    Create a `.env.local` file in the root of your project and add your database connection details.
    
    DATABASE_HOST=your_db_host
    DATABASE_USER=your_db_user
    DATABASE_PASSWORD=your_db_password
    DATABASE_NAME=your_db_name
    
4.  Run the development server:
    npm run dev
    
   ***Live Link***  

The application will be accessible at 'https://school-directory-qx3x.onrender.com'.

## API Endpoints

- 'https://school-directory-qx3x.onrender.com/showSchool': Fetches all school records from the database.
- 'https://school-directory-qx3x.onrender.com/addSchool'**: Adds a new school to the database. Accepts `multipart/form-data`.
  

## Database Schema

The `schools` table schema is defined as follows:

  ***mysql***
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    states VARCHAR(100) NOT NULL,
    contact BIGINT NOT NULL,
    image TEXT NOT NULL,
    email_id VARCHAR(255) NOT NULL,
    board VARCHAR(100) NOT NULL
);
