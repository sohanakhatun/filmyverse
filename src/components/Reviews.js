import React, { useContext, useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import {reviewsRef, db} from '../firebase/firebase'
import { addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore'
import { TailSpin, ThreeDots } from 'react-loader-spinner'
import swal from 'sweetalert'
import {Appstate} from '../App';
import { useNavigate } from 'react-router-dom'

const Reviews = ({id, prevRating, userRated}) => {
    const useAppstate = useContext(Appstate);
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [thoughts, setThoughts] = useState("");
    const [reviews, setReviews] = useState([]);
    const [newAdded, setNewAdded] = useState(0);

    const sendReview = async () => {
        setLoading(true);
        try {
            if(useAppstate.login) {
            await addDoc(reviewsRef, {
                MovieId: id,
                Name: useAppstate.userName,
                Ratings: rating,
                Thoughts: thoughts,
                TimeStamp: new Date().getTime()
            })

            const updateRating = doc(db, "Movies", id);
            await updateDoc(updateRating, {
                rating: prevRating + rating,
                rated: userRated + 1
            })

            setRating(0);
            setThoughts("");
            setNewAdded(newAdded + 1);
            swal({
                title: "Review Sent",
                icon: "success",
                buttons: false,
                timer: 3000
              })
            } else {
                navigate('/login')
            }
        } catch (error) {
            swal({
                title: error.message,
                icon: "error",
                buttons: false,
                timer: 3000
              })
        }
        setLoading(false);
    }

    useEffect(() => {
        async function getReviews() {
            setReviewsLoading(true);
            setReviews([]);
            let setReviewById = query(reviewsRef, where('MovieId', '==', id))
            const getReviewById = await getDocs(setReviewById);

            getReviewById.forEach((doc) => {
                setReviews((prev) => [...prev, doc.data()])
            })

            setReviewsLoading(false);
        }
        getReviews();
    },[newAdded])

  return (
    <div className='mt-4 border-t-2 border-gray-700 w-full'>
        <ReactStars
            size={30}
            half={true}
            value={rating}
            onChange={(rate) => setRating(rate)}
        />
        <input 
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder='Share Your thoughts...'
            className='w-full p-2 outline-none header'
        />
        <button onClick={sendReview} className='w-full flex justify-center py-1 mt-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>
            {loading ? <TailSpin height={20} color="white" /> : 'Share'}
        </button>

        {reviewsLoading ? 
            <div className='mt-6 flex justify-center'><ThreeDots height={10} color="white" /></div>
        :
        <div className='mt-4'>
            {reviews.map((e, i) => {
                return(
                    <div className=' p-2 w-full border-b header bg-opacity-50 border-gray-600 mt-2' key={i}>
                        <div className='flex items-center'>
                            <p className='text-blue-500'>{e.Name}</p>
                            <p className='ml-3 text-xs'>({new Date(e.TimeStamp).toLocaleString()})</p>
                        </div>
                        <ReactStars
                            size={15}
                            half={true}
                            value={e.Ratings}
                            edit={false}
                        />

                        <p>{e.Thoughts}</p>
                    </div>     
                )
            })}
        </div>
        }
    </div>
  )
}

export default Reviews