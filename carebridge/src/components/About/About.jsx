import React, { useState, useEffect } from "react";
import axios from "axios";
import "./About.css";

const Counter = ({ end, duration, label, suffix = "+" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    if (end > 0) {
      window.requestAnimationFrame(step);
    }
  }, [end, duration]);

  return (
    <div className="stat-item">
      <h2>{count}{suffix}</h2>
      <p>{label}</p>
    </div>
  );
};

function About() {
  const [stats, setStats] = useState({ donations: 0, receivers: 0, communities: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("https://carebridge-auom.onrender.com/api/stats");
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="about-us" id="about">
        <h1 id="mission">Join Our Mission</h1>
        <h3>
          "Join us in making a difference! Donate food, clothes, and support education
          to uplift lives and build a brighter future together."
        </h3>

        <div className="stats-container">
          <Counter end={stats.donations} duration={2000} label="List of Items" />
          <Counter end={stats.receivers} duration={2000} label="Orders" />
          <Counter end={stats.communities} duration={2000} label="Delivery Boys" />
        </div>
    </section>
  );
}
export default About;