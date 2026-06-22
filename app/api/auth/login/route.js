import { generateToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import userModel from '@/lib/models/user.model';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // connect database
    await connectDB();
    const { email, password } = await request.json();

    // validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required!' },
        { status: 400 },
      );
    }

    // find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials!' },
        { status: 401 },
      );
    }

    // compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials!' },
        { status: 401 },
      );
    }

    // generate the token (jwt)
    const token = await generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // success response
    const response = NextResponse.json(
      {
        message: 'User logged in successfully!',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );

    // success response with cookie
    response.cookies.set('next-auth-token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.log('Login err: ', error);
    return NextResponse.json(
      { error: 'Internal server error!' },
      { status: 500 },
    );
  }
}
