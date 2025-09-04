import { useEffect, useState } from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {CircularProgress} from '@mui/material';
import {IconButton} from "@mui/material"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import axios from 'axios';
import avengers from "./assets/avengers.jpg";
import inception from "./assets/inception.jpg";
import megan from "./assets/megan.jpg";
import spiderman from "./assets/spiderman2.jpg";
import toystory from "./assets/toy_story_ver1_xlg.jpg";
import jurasicworld from "./assets/jurasicWorld.jpg";


let dummyPosters = [avengers, inception, megan, spiderman, toystory, jurasicworld];

export default function Cinemate() {
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    const [movie, setMovie] = useState("");
    const [movieInfo, setMovieInfo] = useState({});
    const [seeInfo, setSeeInfo] = useState(false);
    const [count, setCount] = useState(10);

    const getRecommendations = async (movie, count) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/recommend_movies?m=${movie}&c=${count}`);
            setRecommendedMovies(response.data.recommended_movies);
            setLoading(false);
            setMessage("");
        } catch(err) {
            setMessage("Move Not Found!");
            setLoading(false);
        }
    }

    const recommendMovies = () => {
        if(movie) {
            setLoading(true);
            setSeeInfo(false); 
            setMovieInfo(null); 
            getRecommendations(movie, count);            
        }
    }

    return (
        <div 
            style={{backgroundColor: "#292929"}}
            className='main h-12/12 w-12/12 lg:w-11/12 md:w-11/12 p-4'>
            <div className='h-1/12 flex cursor-pointer' onClick={() => setSeeInfo(false)}>
                <IconButton>
                    <ArrowBackIosNewIcon className='text-white'/>
                </IconButton>
            </div>
           {!seeInfo ? <div className='h-9/12 w-full overflow-x-auto flex gap-2'>
                {recommendedMovies?.length > 0 ? 
                recommendedMovies.map((movie, idx) => <MovieCard key={idx} movie={movie} poster={movie.poster_url} loading={loading} setSeeInfo={setSeeInfo} setMovieInfo={setMovieInfo}/>) :
                dummyPosters.map((poster, idx) => <MovieCard key={idx} movie={null} poster={poster} loading={loading}/>)}
           </div> : <MovieInfo movieInfo={movieInfo}/>}
           <div className='h-2/12 w-full flex flex-col justify-center items-center'>
                <p className='mb-2 text-sm text-neutral-400'>{message ? message :"Search a movie you like"}</p>
                <div className='h-9 w-11/12 lg:w-2/6 md:w-2/6 border-2 border-gray-300 flex justify-between items-center'>
                    <input type="text" className='w-10/12 outline-0 pl-3 text-white text-sm' placeholder='eg: avatar' value={movie} onChange={e => setMovie(e.target.value)}/>
                    {!loading ? 
                        <IconButton 
                            onClick={() => recommendMovies()} 
                            loading={loading} disabled={loading}>{loading ? 
                            <PlayCircleOutlineIcon className='text-gray-400'/> : 
                            <PlayCircleIcon className='text-white'/>}
                        </IconButton> : 
                        <CircularProgress
                            className='mr-2'
                            sx={{color: "white"}}
                            size={20}/>
                    }
                </div>
           </div>
        </div>
    );
}

function MovieCard({movie, poster, loading, setSeeInfo, setMovieInfo}) {
    const getInfo = () => {
        if(movie) {
            setMovieInfo(movie);
            setSeeInfo(i => !i);
        }
    }
    return (
        <div
            onClick={() => getInfo()}
            className='skelitan h-12/12 min-w-full lg:min-w-59 md:min-w-59'>
            {!loading ? <img src={poster} alt="IMG" className='h-12/12 w-12/12' /> : null}
        </div>
    );
}


function MovieInfo({movieInfo}) {
    if(!movieInfo) {
        return (null);
    }

    return (
        <div className='h-9/12 w-12/12 overflow-y-auto flex flex-col sm:flex-row lg:flex-row md:flex-row gap-2'>
            <div
                className='h-12/12 w-full sm:w-4/12 lg:w-3/12 md:w-4/12'>
                <img src={movieInfo.poster_url} alt="IMG" className='h-12/12 w-12/12' />
            </div>
            <div className='h-12/12 sm:w-8/12 md:w-8/12 lg:w-9/12 p-5 bg-neutral-900'>
                <div className='h-3/12 overflow-y-auto'>
                    <h1 className='text-3xl text-gray-100 font-bold'>{movieInfo.title}</h1>
                    <p className='mb-2 text-gray-400 text-sm'>{movieInfo.overview}</p>                    
                </div>
                <div className='h-9/12 w-full border-t-2 border-red-900 text-gray-200 overflow-y-auto'>
                    <div className='py-3 border-b-2 border-neutral-950'>
                        <h1 className='font-semibold'>Release date: </h1>
                        <div className='px-4 py-1 m-1 text-xs bg-neutral-800 flex justify-center items-center'>
                            <p>{movieInfo.release_date}</p>
                        </div>
                    </div>
                    <div>
                        <h1 className='font-semibold'>Year of Publication: </h1>
                        <div className='px-4 py-1 m-1 text-xs bg-neutral-950 flex justify-center items-center'>
                            <p>{movieInfo.yearOfPublication}/10</p>
                        </div>
                    </div>
                    <div className='py-3 border-b-2 border-neutral-950'>
                        <h1 className='font-semibold'>Genre: </h1>
                        <ul className='w-12/12 list-none flex overflow-x-auto'>
                            {movieInfo.genres.map((genre) => 
                            <li className='px-4 py-1 m-1 text-xs bg-neutral-950 flex justify-center items-center'>
                                <p>{genre.name}</p>
                            </li>)}
                        </ul>
                    </div>
                    <div className='py-3 border-b-2 border-neutral-950'>
                        <h1 className='font-semibold'>Cast: </h1>
                        <ul className='w-12/12 list-none flex overflow-x-auto'>
                            {movieInfo.cast.map((c, idx) => 
                            <li key={idx} className='px-4 py-1 m-1 text-xs bg-neutral-950 flex justify-center items-center'>
                                <p>{c}</p>
                            </li>)}
                        </ul>
                    </div>
                    <div className='py-3 border-b-2 border-neutral-950'>
                        <h1 className='font-semibold'>Director: </h1>
                        <ul className='w-12/12 list-none flex overflow-x-auto'>
                            <li className='px-4 py-1 m-1 text-xs bg-neutral-950 flex justify-center items-center'>
                                <p>{movieInfo.crew}</p>
                            </li>
                        </ul>
                    </div>
                    <div className='py-3 border-b-2 border-neutral-950'>
                        <h1 className='font-semibold'>Keywords: </h1>
                        <ul className='w-12/12 list-none flex overflow-x-auto'>
                            {movieInfo.keywords.map((obj, idx) => 
                            <li key={idx} className='px-4 py-1 m-1 text-xs bg-neutral-950 flex justify-center items-center'>
                                <p>{obj.name}</p>
                            </li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}