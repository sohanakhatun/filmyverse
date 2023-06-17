import React, { useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { useParams } from 'react-router-dom'
import {db} from '../firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { ThreeCircles } from 'react-loader-spinner'
import Reviews from './Reviews'

const Detail = () => {
  const {id} = useParams();
  const [details, setDetails] = useState({
    title: "",
    year: "",
    image: "",
    description: "",
    rating: 0,
    rated: 0
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    async function getDetails() {
      setLoading(true);
      const _doc = doc(db, "Movies", id);
      const _data = await getDoc(_doc);
      setDetails(_data.data());
      setLoading(false);
    }
    getDetails();
  },[])

  return (
    <div className=' p-4 mt-4 flex flex-col md:flex-row items-center md:items-start w-full justify-center'>
     { loading ? <div className='h-96 flex w-full justify-center items-center'><ThreeCircles height={30} color="white" /></div> : 
      <div className='flex flex-row'>
      <img className='h-96 block md:sticky top-24 rounded-sm' src={details.image} />

      <div className='md:ml-4 ml-0 w-full md:w-1/2'>
        <h1 className='text-3xl font-bold text-gray-400'>{details.title} <span className='text-xl'>({details.year})</span></h1>

        <ReactStars
          size={20}
          half={true}
          value={details.rating/details.rated}
          edit={false}
        />

        <p className='mt-2'>{details.description}</p>

        <Reviews id={id} prevRating={details.rating} userRated={details.rated} />
      </div>
    
      </div>
    }
    </div>

  )
}

export default Detail;