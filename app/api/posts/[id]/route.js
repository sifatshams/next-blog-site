import { verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import postModel from '@/lib/models/post.model';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// middleware function for check user is authorized or not?
export async function getUser() {
  // get cookies from browser
  const cookieStore = await cookies();
  const token = await cookieStore.get('next-auth-token')?.value;

  // validate
  return verifyToken(token);
}

export async function GET(_, { params }) {
  try {
    // connect database
    await connectDB();
    // params id
    const { id } = await params;

    // find post
    const post = await postModel.findById(id).populate('author', 'name email');
    // validation
    if (!post) {
      return NextResponse.json({ error: 'Post not found!' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    // get the user
    const user = await getUser();
    // validation
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 });
    }

    // now connect the database
    await connectDB();

    // id from params
    const { id } = await params;

    // find post
    const post = await postModel.findById(id);
    // validation
    if (!post) {
      return NextResponse.json({ error: 'Post not found!' }, { status: 404 });
    }

    if (post.author.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden!' }, { status: 403 });
    }

    // destructure post data
    const { title, body, tags, published } = await request.json();

    // now update the post
    const updated = await postModel.find(
      id,
      {
        title,
        body,
        tags,
        published,
      },
      { new: true },
    );

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    // get the user
    const user = await getUser();
    // validation
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized!' }, { status: 401 });
    }

    // now connect the database
    await connectDB();

    // id from params
    const { id } = await params;

    // find post
    const post = await postModel.findById(id);
    // validation
    if (!post) {
      return NextResponse.json({ error: 'Post not found!' }, { status: 404 });
    }

    if (post.author.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden!' }, { status: 403 });
    }

    // delete the post
    await post.deleteOne();
    return NextResponse.json({ message: 'Post deleted successfully!' });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
