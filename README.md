# 💰 Hisaab-Kitaab – Expense Management System

HisabKitab is a **modern expense management system** designed to help individuals and groups track income, expenses, and budgets.
It provides **secure authentication, budgeting tools, detailed analytics, and group expense sharing** – making personal and shared money management simple.

---

## ✨ Features

### 🔐 1. User Authentication (Cookie Session)

* Secure **Sign-Up & Login** (Name, Email, Mobile Number, Password).
* **OTP Verification** via Nodemailer (Email mandatory, Mobile optional if free service available).
* **Login without OTP** – Users can log in using only email & password.
* **Password Reset** – Secure password recovery system.
* **Profile Deletion** – Users can permanently delete their account & all data.

---

### 💸 2. Expense Tracking

* **Add Expenses** – Input amount, category, date, and description.
* **Edit/Delete** – Modify or remove existing expenses.
* **Categorization** – Organize expenses into categories like *Food, Travel, Bills, Entertainment, etc.*

---

### 💰 3. Income Tracking

* **Add Monthly Income** – Users can record income.
* Income is displayed on the **profile dashboard** with total monthly expense for comparison.

---

### 📊 4. Budgeting & Alerts

* **Set Budget Goals** – Define monthly spending limits.
* **Real-Time Alerts** – Notifications when nearing or exceeding budget.

---

### 📈 5. Reports & Analytics

* **Monthly & Yearly Summaries** – Clear breakdown of spending patterns.
* **Visual Charts** – Pie charts & bar graphs for analysis.
* **Export Data** – Download expense reports in **CSV/PDF** format.

---

### 👥 6. Multi-User & Group Expenses

* **Shared Expenses** – Split costs among friends/family (like Splitwise).
* **Group Expense Feature** –

  * Create groups.
  * Add members (by Mobile Number).
  * Divide expenses fairly (visible to all group members).
* **Flexible Cost Splitting** – Choose different methods to split costs.

---

## 🛠️ Tech Stack

* **Frontend:** React + Vite + Tailwind CSS
* **Backend:** Node.js + Express
* **Database:** MongoDB / PostgreSQL (your choice)
* **Authentication:** Cookie Session + JWT (for APIs)
* **Email Service:** Nodemailer
* **Optional:** SMS API (if free service available for mobile OTP)

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/hisabkitab.git

# Navigate to project folder
cd hisabkitab

# Install dependencies (Frontend + Backend separately)
cd frontend
npm install

cd ../backend
npm install

# Run development servers
npm run dev