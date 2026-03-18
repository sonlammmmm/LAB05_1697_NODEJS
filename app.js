const express = require('express');
const app = express();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userController = require('./controllers/userController');

// Middleware
app.use(express.json());

// Kết nối database
connectDB();

// Routes
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);

// Các API bổ sung theo yêu cầu riêng
app.post('/enable', userController.enableUser);
app.post('/disable', userController.disableUser);
app.get('/roles/:id/users', userController.getUsersByRole);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
