# Restaurant Ordering System

**Live site:** https://restaurant-ordering-system-1.onrender.com/

A full-stack web application for online restaurant ordering with real-time order tracking, Stripe payments, and SMS notifications.

## Features

- Browse a menu split by Starters, Mains and Desserts
- Add items to a cart and place orders as a guest or registered user
- Delivery eligibility check based on your address (within 20km of the restaurant)
- Secure card payments via Stripe
- Real-time order status tracking with a visual progress stepper
- SMS notifications on payment confirmation and delivery via Twilio
- Staff and admin dashboard for managing orders and menu items
- Admin panel for creating staff and admin accounts

## Tech Stack

**Frontend:** React, React Router, Stripe.js  
**Backend:** Node.js, Express  
**Database:** MongoDB Atlas (Mongoose)  
**Payments:** Stripe  
**SMS:** Twilio  
**Delivery radius:** Google Distance Matrix API  

## User Roles

| Role | Access |
|------|--------|
| Customer | Browse menu, place orders, track orders, pay |
| Staff | Everything above + manage orders and menu items |
| Admin | Everything above + create staff/admin accounts |

## Running the Frontend Locally

```bash
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` and connects to the hosted backend automatically.

## Notes

- The backend is hosted on Render's free tier and may take 30-60 seconds to respond on first load after a period of inactivity.
- Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC.
