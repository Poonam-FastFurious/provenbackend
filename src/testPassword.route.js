import express from 'express';
import bcrypt from 'bcrypt';
import { User } from './models/User.model.js'; // adjust the path as needed

const router = express.Router();

router.post('/test-password', async (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
      }

      try {
            const user = await User.findOne({ email });

            if (!user) {
                  return res.status(404).json({ message: 'User not found' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('Test Password Comparison:', { enteredPassword: password, hashedPassword: user.password, isPasswordValid });

            return res.status(200).json({ isPasswordValid });
      } catch (error) {
            console.error('Error testing password:', error);
            return res.status(500).json({ message: 'Internal server error' });
      }
});

export default router;
