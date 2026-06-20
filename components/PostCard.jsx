const PostCard = ({ post }) => {
  const { id, title, tags, author, body, createdAt } = post;
  const { name } = author ?? {};
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}
        {body && <p>{body}</p>}
        <div className="card-actions justify-end">
          {tags &&
            tags?.map((tag) => (
              <div key={id} className="badge badge-outline">
                {tag}
              </div>
            ))}
        </div>
        {author && author?.name && (
          <p className="text-sm text-slate-600 font-semibold">{name}</p>
        )}
        {createdAt && (
          <p className="text-sm text-slate-800 mt-2">{createdAt}</p>
        )}
      </div>
    </div>
  );
};

export default PostCard;
