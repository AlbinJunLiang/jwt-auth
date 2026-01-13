

import { compareOTP, generateOTP, hashOTP } from "../../src/utils/otp.util.js";

test('El OTP hasheado se compara correctamente', async () => {
    const otp = '882412';          // siempre string
    const hash = await hashOTP(otp);
    const result = await compareOTP(otp, hash);

    expect(result).toBe(true);
});
