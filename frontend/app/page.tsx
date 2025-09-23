import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to The Quisine 🍲</h1>
      <p>Delicious food delivered fresh to your doorstep.</p>
      <Link href="/menu">
        <button
          style={{
            marginTop: "1rem",
            background: "#124f31",
            color: "#fff",
            padding: "0.8rem 1.5rem",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          View Menu
        </button>
      </Link>
    </div>
  );
}
