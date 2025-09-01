'use client';

import { useForm } from 'react-hook-form';

import { useState } from 'react';

import styles from '../styles/addSchool.module.css';





export default function AddSchool() {

  const { register, handleSubmit, reset } = useForm();

  const [message, setMessage] = useState('');

  const [showNotification, setShowNotification] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);



  const onSubmit = async (data) => {

    setIsSubmitting(true);

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) =>

      formData.append(key, key === 'image' ? value[0] : value)

    );



    const res = await fetch('/api/addSchool', {

      method: 'POST',

      body: formData,

    });



    const result = await res.json();

    setMessage(result.message);

   

    // Simulate a 2-second delay for the loader

    await new Promise(resolve => setTimeout(resolve, 2000));



    setIsSubmitting(false);



    if (res.ok) {

      setShowNotification(true);

      setTimeout(() => {

        setShowNotification(false);

      }, 3000); // Hide notification after 3 seconds

    }

    reset();

  };



  return (

    <main className={styles.pageBackground}>

      {showNotification && (

        <div className={styles.notification}>

          <p>{message}</p>

        </div>

      )}

      <div className={styles.formContainer}>

        {isSubmitting ? (

          <div className={styles.loaderContainer}>

            <div className={styles.loader}></div>

            <p className={styles.loadingText}>Adding School...</p>

          </div>

        ) : (

          <>

            <h2 className={styles.heading}>Add a School 🏫</h2>

            <p className={styles.subheading}>Help us grow our directory by adding a school's information below.</p>

            <form

              className={styles.form}

              onSubmit={handleSubmit(onSubmit)}

              encType="multipart/form-data"

            >

              <input {...register('name')} placeholder="School Name" required className={styles.input} />

              <input {...register('address')} placeholder="Address" required className={styles.input} />

              <input {...register('city')} placeholder="City" required className={styles.input} />

              <input {...register('states')} placeholder="State" required className={styles.input} />

              <input {...register('contact')} placeholder="Contact Number" required className={styles.input} />

              <input {...register('email_id')} placeholder="Email ID" type="email" required className={styles.input} />

              <input {...register('board')} placeholder="Board (e.g., CBSE/ICSE)" required className={styles.input} />

              <label htmlFor="school-image" className={styles.fileInputLabel}>

                <span className={styles.fileInputText}>Upload School Image</span>

                <input id="school-image" {...register('image')} type="file" accept="image/*" required className={styles.hiddenInput} />

              </label>

              <button type="submit" className={styles.button}>Add School</button>

            </form>

          </>

        )}

      </div>

    </main>

  );

}