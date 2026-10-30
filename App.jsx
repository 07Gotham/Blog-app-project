import { registerUser,loginUser,createBlog,getBlogs,getBlogById,updateBlog,deleteBlog} from "./api";
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate,useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import "./App.css";

const initialBlogs = [
  {
    id: 1,
    title: "How to Build Better Habits",
    category: "Lifestyle",
    author: "Alex Morgan",
    date: "Oct 24, 2026",
    read: "5 min read",
    excerpt: "Small daily actions can create remarkable changes. Learn how to build habits that last.",
    color: "peach",
  },
  {
    id: 2,
    title: "The Future of Web Development",
    category: "Technology",
    author: "Jordan Lee",
    date: "Oct 22, 2026",
    read: "8 min read",
    excerpt: "Explore the tools, frameworks, and ideas shaping the next generation of the web.",
    color: "lavender",
  },
  {
    id: 3,
    title: "Finding Inspiration in Everyday Life",
    category: "Creativity",
    author: "Sam Taylor",
    date: "Oct 20, 2026",
    read: "4 min read",
    excerpt: "Discover practical ways to stay curious, creative, and motivated every day.",
    color: "mint",
  },
];

function Header() {
  return (
    <header className="topbar">
      <Link to="/" className="brand">ink<span>well.</span></Link>
      <nav>
        <NavLink to="/">Explore</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>
      <div className="header-actions">
        <Link className="text-link" to="/login">Log in</Link>
        <Link className="button button-dark" to="/register">Get started</Link>
      </div>
    </header>
  );
}

function Home({ blogs }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

const filteredBlogs = blogs.filter((blog) => {
  const matchesSearch =
    `${blog.title} ${blog.excerpt} ${blog.content || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesCategory =
    category === "All" || blog.category === category;

  return matchesSearch && matchesCategory;
});

  return (
    <>
      <section className="hero">
        <span className="eyebrow">A little space for big ideas</span>
        <h1>Stories worth<br /> <span>stopping for.</span></h1>
        <p>Fresh perspectives, thoughtful stories, and ideas to take with you.</p>
        <Link to="/create" className="button button-dark">Write a story ↗</Link>
        <div className="hero-decoration">✳</div>
      </section>

      <main className="content">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE JOURNAL</span>
            <h2>Explore stories</h2>
          </div>
         <span className="muted">{filteredBlogs.length} stories</span>
        </div>

        <input
          className="search"
          placeholder="Search stories or authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="categories">
          {["All", "Lifestyle", "Technology", "Creativity"].map((item) => (
            <button
              key={item}
              className={category === item ? "chip active" : "chip"}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="All">All Categories</option>

  {[...new Set(blogs.map((blog) => blog.category))].map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ))}
</select>

        <div className="blog-grid">
          {filteredBlogs.map((blog) => (
            <article className="blog-card" key={blog._id}>
              <div className={`card-art ${blog.color}`}>
                <span>{blog.category}</span>
                <span className="art-symbol">✳</span>
              </div>
              <div className="card-body">
                <div className="muted small">{blog.date} · {blog.read}</div>
                <h3><Link to={`/blog/${blog._id || blog.id}`}>{blog.title}</Link></h3>
                <p>{blog.excerpt}</p>
                <div className="author">✦ &nbsp;{blog.author}</div>
              </div>
            </article>
          ))}
          {filteredBlogs.length === 0 && <p>No stories found. Try another search.</p>}
        </div>
      </main>
      <footer>inkwell. <span>Made for curious minds.</span></footer>
    </>
  );
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      sessionStorage.setItem("inkwell_token", data.token);
      sessionStorage.setItem("inkwell_user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Your next great read is waiting."
    >
      <form onSubmit={handleLogin}>
        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p role="alert" className="error-message">{error}</p>}

        <button className="button button-dark full" disabled={loading}>
          {loading ? "Logging in..." : "Log in →"}
        </button>
      </form>

      <p className="auth-switch">
        New to Inkwell? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser({ name, email, password });

      // Temporary demo storage. We'll improve token storage later.
      sessionStorage.setItem("inkwell_token", data.token);
      sessionStorage.setItem("inkwell_user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Join the community"
      subtitle="Create an account and share your perspective."
    >
      <form onSubmit={handleRegister}>
        <label>
          Your name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Morgan"
            required
          />
        </label>

        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            placeholder="At least 8 characters"
            required
          />
        </label>

        {error && <p role="alert" className="error-message">{error}</p>}

        <button className="button button-dark full" disabled={loading}>
          {loading ? "Creating account..." : "Create account →"}
        </button>
      </form>

      <p className="auth-switch">
        Already a member? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <Link to="/" className="brand">ink<span>well.</span></Link>
      <section className="auth-card">
        <div className="auth-icon">✳</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </section>
    </main>
  );
}


function Dashboard({ blogs, setBlogs }) {
  const navigate = useNavigate();

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return;

    try {
      const token = sessionStorage.getItem("inkwell_token");

      await deleteBlog(id, token);

      setBlogs((previous) =>
        previous.filter((blog) => blog._id !== id)
      );

      alert("Blog deleted successfully!");
    } catch (error) {
      alert(error.message || "Could not delete blog");
    }
  }

  return (
    <main className="dashboard content">
      <span className="eyebrow">YOUR WORKSPACE</span>
      <h1>Your dashboard.</h1>
      <p className="muted">A home for your ideas and stories.</p>

      <div className="stats">
        <div>
          <span>Stories</span>
          <strong>{blogs.length}</strong>
        </div>
        <div>
          <span>Categories</span>
          <strong>{new Set(blogs.map(b => b.category)).size}</strong>
        </div>
        <div>
          <span>Workspace</span>
          <strong>Ready</strong>
        </div>
      </div>

      <div className="section-heading">
        <h2>Recent stories</h2>
        <Link className="button button-dark" to="/create">
          + New story
        </Link>
      </div>

      {blogs.length === 0 && <p>No blogs published yet.</p>}

      {blogs.map((blog) => (
        <article className="dashboard-row" key={blog._id}>
          <div>
            <strong>{blog.title}</strong>
            <p className="muted small">{blog.category}</p>
          </div>

          <div className="dashboard-actions">
            <button
              type="button"
              onClick={() => navigate(`/edit/${blog._id}`)}
            >
             Edit
            </button>

            <button
              type="button"
              onClick={() => handleDelete(blog._id)}
            >
             Delete
            </button>
          </div>
        </article>
      ))}
    </main>
  );

  return (
    <main className="dashboard content">
      <span className="eyebrow">YOUR WORKSPACE</span>
      <h1>Your dashboard.</h1>
      <p className="muted">A home for your ideas and stories.</p>
      <div className="stats">
        <div><span>Stories</span><strong>{blogs.length}</strong></div>
        <div><span>Categories</span><strong>{new Set(blogs.map(b => b.category)).size}</strong></div>
        <div><span>Workspace</span><strong>Ready</strong></div>
      </div>
      <div className="section-heading">
        <h2>Recent stories</h2>
        <Link className="button button-dark" to="/create">+ New story</Link>
      </div>
      {blogs.map((blog) => (
        <article className="dashboard-row" key={blog.id}>
          <div><strong>{blog.title}</strong><p className="muted small">{blog.category} · {blog.date}</p></div>
          <span className="status">Draft / Demo</span>
        </article>
      ))}
      <p className="muted small">Demo dashboard: accounts and stories are not saved to a server yet.</p>
    <button
  type="button"
  onClick={() => navigate(`/edit/${blog._id}`)}
>
  Edit
</button>

<button
  type="button"
  onClick={() => handleDelete(blog._id)}
>
  Delete
</button>
</main>
  );
}

function CreateBlog({ onCreate }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const token = sessionStorage.getItem("inkwell_token");

    if (!token) {
      setError("Please log in before creating a blog.");
      return;
    }

    setLoading(true);

    try {
      const result = await createBlog(
        { title, category, excerpt },
        token
      );

      onCreate(result.blog);

      navigate("/");
    } catch (err) {
      setError(err.message || "Could not create blog.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create a Blog</h1>
        <p>Share your story with the Inkwell community.</p>

        {error && <p className="error-message">{error}</p>}

        <label htmlFor="blog-title">Title</label>
        <input
          id="blog-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title"
          required
        />

        <label htmlFor="blog-category">Category</label>
        <input
          id="blog-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Technology, Lifestyle..."
          required
        />

        <label htmlFor="blog-excerpt">Introduction</label>
        <textarea
          id="blog-excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Write a short introduction"
          rows={5}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </main>
  );
}


function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBlog() {
      try {
        const result = await getBlogById(id);
        const blog = result.blog;

        if (!cancelled) {
          setTitle(blog.title);
          setCategory(blog.category);
          setExcerpt(blog.excerpt);
          setContent(blog.content || "");
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBlog();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("inkwell_token");

      await updateBlog(
        id,
        { title, category, excerpt, content },
        token
      );

      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.message || "Could not update blog");
    }
  }

  if (loading) return <p>Loading blog...</p>;

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Edit Blog</h1>

        {error && <p className="error-message">{error}</p>}

        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <label>Introduction</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
        />

        <label>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
        />

        <button type="submit">Save Changes</button>
      </form>
    </main>
  );
}

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBlog() {
      try {
        const result = await getBlogById(id);
        setBlog(result.blog);
      } catch (err) {
        setError(err.message || "Could not load blog.");
      } finally {
        setLoading(false);
      }
    }

    loadBlog();
  }, [id]);

  if (loading) return <main className="content">Loading blog...</main>;
  if (error) return <main className="content">{error}</main>;
  if (!blog) return <main className="content">Blog not found.</main>;

  return (
    <main className="content">
      <Link to="/">← Back to stories</Link>
      <article className="blog-detail">
        <span className="eyebrow">{blog.category}</span>
        <h1>{blog.title}</h1>
        <p className="muted">
          By {blog.author}
          {blog.createdAt &&
            ` · ${new Date(blog.createdAt).toLocaleDateString()}`}
        </p>
        <p>{blog.excerpt}</p>
        <div className="blog-content">{blog.content}</div>
      </article>
    </main>
  );
}

function AppContent() {
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState("");


useEffect(() => {
  let cancelled = false;

  async function loadBlogs() {
    try {
      setBlogsLoading(true);
      setBlogsError("");

      const result = await getBlogs();

      if (!cancelled) {
        setBlogs(result.blogs || []);
      }
    } catch (error) {
      if (!cancelled) {
        setBlogsError(error.message || "Could not load blogs.");
      }
    } finally {
      if (!cancelled) {
        setBlogsLoading(false);
      }
    }
  }

  loadBlogs();

  return () => {
    cancelled = true;
  };
}, []);

  function addBlog(blog) {
    setBlogs((previousBlogs) => [blog, ...previousBlogs]);
  }

  return (
    <>
      <Header />

      {blogsLoading && <p>Loading blogs...</p>}
      {blogsError && <p className="error-message">{blogsError}</p>}

      <Routes>
        <Route path="/" element={<Home blogs={blogs} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard"element={<Dashboard blogs={blogs} setBlogs={setBlogs} />} />
        <Route path="/create" element={<CreateBlog onCreate={addBlog} />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/edit/:id" element={<EditBlog />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}
