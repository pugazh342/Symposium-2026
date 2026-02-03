# 🚀 Symposium 2026 - Event Management System

A full-stack event registration and management platform built for the National Level Technical Symposium "Aanivaru Akkuvaru".

![Symposium 2026 Banner](/public/logo.png)

## ✨ Features

### 🎓 For Students
* **Seamless Registration:** Register as an Individual or Team.
* **Dynamic QR Payments:** Auto-generated UPI QR codes based on selected events.
* **Status Tracking:** Check approval status using Email or Transaction ID.
* **PDF Entry Pass:** Auto-generated downloadable PDF tickets upon approval.
* **Email Notifications:** Instant confirmation and approval emails.

### 🛡️ For Admins
* **Secure Dashboard:** Password-protected admin panel.
* **Real-time Analytics:** Track total revenue, registrations, and event popularity.
* **Approval Workflow:** Approve/Reject students with a single click (triggers auto-email).
* **Data Export:** Download all participant data as CSV for Excel.

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS
* **Backend / Database:** Supabase (PostgreSQL)
* **Email Service:** EmailJS
* **PDF Generation:** jsPDF
* **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites
* Node.js installed
* Supabase account
* EmailJS account

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/pugazh342/symposium-2026.git
    cd symposium-2026
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add your keys:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📄 License

This project is licensed under the MIT License.


