import bcrypt from 'bcryptjs';

export function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}

export async function hashOTP(otp) {
  return await bcrypt.hash(otp, 10);
}

export async function compareOTP(otp, hash) {
  return await bcrypt.compare(otp, hash);
}
