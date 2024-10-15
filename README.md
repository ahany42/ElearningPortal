# ELearning Portal
## 1. Introduction

This eLearning platform enables users to enroll in courses, submit assignments, and take exams. The platform supports four types of users: Students, Instructors, Admins, and Super Admins. Each role has distinct functionalities, ensuring the system is secure and efficient in managing courses and student progress.

## 2. Technology Stack
The platform is developed using the MERN stack along with additional tools like bcrypt for password encryption, express-rate-limiter for rate limiting, Vite for fast builds, Bootstrap, and Material-UI (MUI) for styling:

- **Frontend**: React.js  
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React Logo" style="width:100px; height:100px;">

- **Backend**: Node.js with Express.js  
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" alt="Express Logo" style="width:100px; height:100px;">

- **Database**: MongoDB  
  <img src="https://webimages.mongodb.com/_com_assets/cms/mongodb-logo-rgb-j6w271g1xn.jpg" alt="MongoDB Logo" style="width:100px; height:100px;">

- **Authentication**: JWT (JSON Web Token)  
  <img src="https://jwt.io/img/pic_logo.svg" alt="JWT Logo" style="width:100px; height:100px;">

- **Styling**: Bootstrap  
  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg" alt="Bootstrap Logo" style="width:100px; height:100px;">

- **Styling**: Material-UI (MUI)  
  <img src="https://mui.com/static/logo.png" alt="Material-UI Logo" style="width:100px; height:100px;">

- **Build Tool**: Vite  
  <img src="https://vitejs.dev/logo.svg" alt="Vite Logo" style="width:100px; height:100px;">

## 3. User Roles and Permissions

### Student
- **Enroll in Courses**: Students can enroll in available courses.
- **Submit Assignments**: Students can upload their assignment submissions for each course.
- **Solve Exams**: Students can participate in multiple-choice exams and submit answers.
- **View Deadlines**: Students can see upcoming deadlines for assignments and exams.
- **Track Progress**: Students can view their progress for each course they are enrolled in, including marks for assignments and exams.

### Instructor
- **Manage Course Materials**: Instructors can add, edit, and delete course materials, such as announcements, exams, and assignments.
- **Add MCQ Exams with Auto-Correction**: Instructors can create multiple-choice exams with model answers. The system automatically corrects student submissions and displays the marks.
- **Track Student Progress**: Instructors can view the progress of students enrolled in the courses they teach.

### Admin
- **Manage Courses**: Admins can add, edit, or delete courses from the system.
- **Manage Users**: Admins can remove students or instructors from the system.
- **Assign Instructors to Courses**: Admins can assign instructors to specific courses.
- **View Student Progress**: Admins can view the progress of all students in all courses.

### Super Admin
- **Full Admin Access**: Super Admins have all the capabilities of Admins.
- **Advanced User Management**: Super Admins can also manage admins and their permissions.

## 4. Core Features

### Student Features
- **Course Enrollment**: Students can browse the course catalog and enroll in available courses.
- **Assignment Submission**: Students upload their completed assignments to be graded by the instructor.
- **Exam Participation**: Students can take exams, with MCQ exams being auto-corrected by the system.
- **Progress Tracking**: Students can view their marks and progress for every enrolled course.
  
### Instructor Features
- **Material Management**: Instructors can create and manage course materials, including assignments, exams, and announcements.
- **Auto-Graded Exams**: Instructors can upload MCQ exams along with correct answers for automatic grading.
- **View Student Progress**: Instructors can monitor the performance of students in the courses they are assigned.

### Admin Features
- **Course Management**: Admins can create, update, and delete courses.
- **User Management**: Admins can remove students or instructors from the system and assign instructors to courses.
- **Progress Monitoring**: Admins have access to the performance records of all students.

### Super Admin Features
- **Admin Management**: Super Admins can manage Admins, as well as all other entities within the system.

## 5. Backend Overview

### Authentication
- **JWT (JSON Web Token)**: All users are authenticated using JWT tokens, ensuring secure access to the platform's resources.
- **Email Verification & Password Reset**: Users can reset their passwords through email authentication. A UUID v4 token is generated and sent to the user’s email for password recovery.

## 6. Frontend Overview

The frontend is built using **React.js** with Material-UI for component styling. It provides a user-friendly interface for navigating the platform. Each user role has a dedicated dashboard with role-specific features and actions.

## 7. Database Schema

The platform uses **MongoDB** as the primary database, with the following collections:
- **Users**: Stores details about students, instructors, admins, and super admins.
- **Courses**: Stores course information, including the materials, exams, and student enrollment data.
- **Assignments**: Stores submitted assignments for each course.
- **Exams**: Stores MCQ exams and model answers.
- **Progress**: Tracks students' progress across courses.

## 8. Deployment



