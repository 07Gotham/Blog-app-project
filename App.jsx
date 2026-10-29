import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
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

  const filtered = blogs.filter((blog) => {
    const matchesSearch = `${blog.title} ${blog.excerpt} ${blog.author}`
      .toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (category === "All" || blog.category === category);
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
          <span className="muted">{filtered.length} stories</span>
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

        <div className="blog-grid">
          {filtered.map((blog) => (
            <article className="blog-card" key={blog.id}>
              <div className={`card-art ${blog.color}`}>
                <span>{blog.category}</span>
                <span className="art-symbol">✳</span>
              </div>
              <div className="card-body">
                <div className="muted small">{blog.date} · {blog.read}</div>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <div className="author">✦ &nbsp;{blog.author}</div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p>No stories found. Try another search.</p>}
        </div>
      </main>
      <footer>inkwell. <span>Made for curious minds.</span></footer>
    </>
  );
}

function Login() {
  const navigate = useNavigate();
  return (
    <AuthLayout title="Welcome back" subtitle="Your next great read is waiting.">
      <form onSubmit={(e) => { e.preventDefault(); navigate("/dashboard"); }}>
        <label>Email address<input type="email" placeholder="you@example.com" required /></label>
        <label>Password<input type="password" placeholder="Enter your password" required /></label>
        <button className="button button-dark full">Log in →</button>
      </form>
      <p className="auth-switch">New to Inkwell? <Link to="/register">Create an account</Link></p>
    </AuthLayout>
  );
}

function Register() {
  const navigate = useNavigate();
  return (
    <AuthLayout title="Join the community" subtitle="Create an account and share your perspective.">
      <form onSubmit={(e) => { e.preventDefault(); navigate("/dashboard"); }}>
        <label>Your name<input placeholder="Alex Morgan" required /></label>
        <label>Email address<input type="email" placeholder="you@example.com" required /></label>
        <label>Password<input type="password" minLength="6" placeholder="At least 6 characters" required /></label>
        <button className="button button-dark full">Create account →</button>
      </form>
      <p className="auth-switch">Already a member? <Link to="/login">Log in</Link></p>
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

function Dashboard({ blogs }) {
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
    </main>
  );
}

function CreateBlog({ onCreate }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("");

  function submit(e) {
    e.preventDefault();
    onCreate({
      id: Date.now(),
      title,
      category,
      excerpt,
      author: author || "Guest Writer",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      read: "3 min read",
      color: "mint",
    });
    navigate("/");
  }

  return (
    <main className="create-page content">
      <span className="eyebrow">THE WRITING ROOM</span>
      <h1>Every story starts somewhere.</h1>
      <p className="muted">Put your thoughts into words.</p>
      <form className="editor-card" onSubmit={submit}>
        <label>Story title<input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your story a title..." required /></label>
        <label>Author name<input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Your name" /></label>
        <label>Category
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option>Technology</option><option>Lifestyle</option><option>Creativity</option>
          </select>
        </label>
        <label>Short introduction<textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="What is your story about?" rows="6" required /></label>
        <div className="editor-actions">
          <Link to="/" className="text-link">Cancel</Link>
          <button className="button button-dark">Publish story →</button>
        </div>
      </form>
    </main>
  );
}

function AppContent() {
  const [blogs, setBlogs] = useState(initialBlogs);
  const addBlog = (blog) => setBlogs(previous => [blog, ...previous]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home blogs={blogs} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard blogs={blogs} />} />
        <Route path="/create" element={<CreateBlog onCreate={addBlog} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}