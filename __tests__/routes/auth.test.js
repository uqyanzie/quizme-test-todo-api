
const { User, OTP } = require('../../app/models');
const request = require('supertest');
const app = require('../../server');

const TEST_USERNAME = 'uqyanzie';
const TEST_EMAIL_ADDRESS = 'uqyanzie@gmail.com';
const TEST_EMAIL_PASSWORD = 'Password@123';

let otp = '';

beforeAll(async () => {
    await User.deleteOne({ email: TEST_EMAIL_ADDRESS });
    await OTP.deleteMany();
});


describe('POST /send-otp', () => {
    it('should return 200 OK', async () => {
        const res = await request(app)
            .post('/api/send-otp')
            .send({
                email: TEST_EMAIL_ADDRESS
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.otpBody.email).toBe(TEST_EMAIL_ADDRESS);
        expect(res.body.otpBody.otp).toBeDefined();
        otp = res.body.otpBody.otp;
    })
});

describe('POST /register missing fields', () => {
    it('should return 400 OK', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe('POST /register invalid email address', () => {
    it('should return 400 OK', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                username: TEST_USERNAME,
                email: 'invalidemail',
                password: TEST_EMAIL_PASSWORD,
                confirmPassword: TEST_EMAIL_PASSWORD,
                otp: otp
            });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe('POST /register invalid OTP', () => {
    it('should return 200 OK', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                username: TEST_USERNAME,
                email: TEST_EMAIL_ADDRESS,
                password: TEST_EMAIL_PASSWORD,
                confirmPassword: "wrongpasswordnotmatch",
                otp: 'otpInvalid'
            });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe('POST /register invalid confirmation password', () => {
    it('should return 200 OK', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                username: TEST_USERNAME,
                email: TEST_EMAIL_ADDRESS,
                password: TEST_EMAIL_PASSWORD,
                confirmPassword: "wrongpasswordnotmatch",
                otp: otp
            });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe('POST /register Success register user', () => {
    it('should return 200 OK', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                username: TEST_USERNAME,
                email: TEST_EMAIL_ADDRESS,
                password: TEST_EMAIL_PASSWORD,
                confirmPassword: TEST_EMAIL_PASSWORD,
                otp: otp
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.username).toBe('uqyanzie');
        expect(res.body.data.email).toBe('uqyanzie@gmail.com');
    });
});

describe('POST /auth failed to authenticate user of wrong credentials', () => {
    it('should return 400 OK', async () => {
        const res = await request(app)
            .post('/api/auth')
            .send({
                email: TEST_EMAIL_ADDRESS,
                password: 'wrongpassword'
            });
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
});  

describe('POST /auth Authenticate user', () => {
    it('should return 200 OK', async () => {
        const res = await request(app)
            .post('/api/auth')
            .send({
                email: TEST_EMAIL_ADDRESS,
                password: TEST_EMAIL_PASSWORD
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.accessToken).toBeDefined();
    });
});

describe('POST /register User email already exists', () => {
    it('should return 400 OK', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                username: TEST_USERNAME,
                email: TEST_EMAIL_ADDRESS,
                password: TEST_EMAIL_PASSWORD,
                confirmPassword: TEST_EMAIL_PASSWORD,
                otp: otp
            });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});



