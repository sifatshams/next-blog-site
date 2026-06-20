import PostCard from '@/components/PostCard';

async function getPost() {
  const res = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=12',
    {
      next: { revalidate: 60 },
    },
  );

  // validation
  if (!res.ok) {
    throw new Error('Failed to fetch data!');
  }

  // success response
  return res.json();
}

const page = async () => {
  const posts = await getPost();
  return (
    <div>
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default page;
