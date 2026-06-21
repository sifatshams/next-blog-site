import { generateToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import userModel from '@/lib/models/user.model';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // connect database
    await connectDB();
    const { name, email, password } = await request.json();

    // validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required!' },
        { status: 400 },
      );
    }

    // if user exists?
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered!' },
        { status: 409 },
      );
    }

    // hash the password
    const hashed = await bcrypt.hash(password, 12);

    // create user
    const user = await userModel.create({ name, email, password: hashed });

    // generate token
    const token = await generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // success response
    const response = NextResponse.json(
      {
        message: 'User registered successfully!',
        user: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 },
    );

    // response with cookie
    response.cookies.set('next-auth-token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.log('Signup err: ', error);
    return NextResponse.json(
      { error: 'Internal server error!' },
      { status: 500 },
    );
  }
}
