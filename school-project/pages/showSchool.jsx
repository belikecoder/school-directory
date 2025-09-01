'use client';
import { useEffect, useState } from 'react';
import styles from '../styles/showSchool.module.css';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/getSchools');
        if (response.ok) {
          const data = await response.json();
          setSchools(data);
        } else {
          console.error('Failed to fetch schools.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSchools();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={styles.starFilled}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={styles.starHalf}>★</span>);
      } else {
        stars.push(<span key={i} className={styles.starEmpty}>★</span>);
      }
    }
    return stars;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Discover Our Schools
      </h2>
      <div className={styles.grid}>
        {schools.map((school, index) => (
          <div key={index} className={styles.card}>
            {school.image && (
              <div className={styles.imageContainer}>
                <img
                  src={`https://school-directory-qx3x.onrender.com${school.image}`}
                  alt={school.name}
                  className={styles.image}
                  width="100%"
                  height="auto"
                />
              </div>
            )}
            <div className={styles.content}>
              <div className={styles.cardHeader}>
                <div className={styles.rating}>
                  {renderStars(school.star_rating || 3.5)}
                </div>
                {school.board && (
                  <p className={styles.board}>{school.board}</p>
                )}
              </div>
              <p className={styles.info1}>
                <span className={styles.label}></span> {school.states}
              </p>
              <h3 className={styles.cardTitle}>{school.name}</h3>
              <p className={styles.info}>
                <span className={styles.label}></span> {school.city}
              </p>
              <button className={styles.applyButton}>
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
