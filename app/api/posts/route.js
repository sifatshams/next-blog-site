import { verifyToken } from '@/lib/auth-edge';
import { connectDB } from '@/lib/db';
import postModel from '@/lib/models/post.model';
import '@/lib/models/user.model';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // get cookies from browser
  const cookieStore = await cookies();
  const token = cookieStore.get('next-auth-token')?.value;

  // now verify the token
  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: 'User unauthorized!' }, { status: 401 });
  }

  // connect database
  await connectDB();
  const { title, body, tags, published } = await request.json();

  // validation
  if (!title || !body) {
    return NextResponse.json(
      { error: 'Title and body are required!' },
      { status: 400 },
    );
  }

  // create post
  const post = await postModel.create({
    title,
    body,
    tags: tags || [],
    published: published ?? true,
    author: user.id?.id,
  });

  // success response
  return NextResponse.json(
    { message: 'Post created successfully!', post },
    { status: 200 },
  );
}

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    const query = { published: true };

    if (tag) query.tags = tag;

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const posts = await postModel
      .find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.log('GET POSTS ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts!' },
      { status: 500 },
    );
  }
}
