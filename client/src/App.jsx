import { useState, useEffect } from "react";

const PORT = 80;

function App() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:${PORT}/topstories`)
      .then((response) => response.json())
      .then((stories) =>
        setStories(
          stories.slice(0).sort((a, b) => {
            if (a.time > b.time) return -1;
            if (a.time < b.time) return 1;
            return 0;
          })
        )
      )
      .catch((error) => alert(error.message));
  }, []);

  useEffect(() => console.log(stories), [stories]);

  return (
    <div className="my-8 text-center">
      <header className="text-4xl">The Latest Hacker News</header>
      <ul className="mt-6">
        {stories.map((item) => {
          const { id, title, time, score, by, url } = item;

          return (
            <li key={id} className="mt-4">
              <h4 className="text-xl">
                <a
                  href={url}
                  target="_blank"
                  className={`inline-block ${
                    url ? "text-blue-600 underline visited:text-gray-400" : ""
                  }`}
                >
                  {title}
                </a>
              </h4>
              <p className="mt-2">Upvotes: {score}</p>
              <p className="mt-2">
                {by} - {new Date(time * 1000).toLocaleString()}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
