import { useEffect, useState } from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {CircularProgress} from '@mui/material';
import {IconButton} from "@mui/material"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import axios from 'axios';

export default function Bookmate() {
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    const [book, setBook] = useState("");
    const [bookInfo, setBookInfo] = useState({});
    const [seeInfo, setSeeInfo] = useState(false);
    const [count, setCount] = useState(5);
    const [popularBooks, setPopularBooks] = useState([]);


    useState(() => {
        const getPopularBooks = async (count) => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/popular_books?c=${count}`);
            if(response.status == 200) {
                setPopularBooks(response.data.popular_books);
            }
        }
        getPopularBooks(count)
    }, []);

    const getRecommendations = async (book, count) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/recommend_books?b=${book}&c=${count}`);
            if(response.status == 200) {
                setRecommendedBooks(response.data.recommended_books);
                setLoading(false);
                setMessage("");              
            }
        } catch(err) {
            setMessage("Book Not Found!");
            setLoading(false);
        }
    }

    const recommendMovies = () => {
        if(book) {
            setLoading(true);
            setSeeInfo(false); 
            setBookInfo(null); 
            getRecommendations(book, count);            
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
                {recommendedBooks?.length > 0 ? 
                recommendedBooks.map((book, idx) => <BookCard key={idx} book={book} imageUrl={book.imageUrl} loading={loading} setSeeInfo={setSeeInfo} setBookInfo={setBookInfo}/>) :
                popularBooks.length > 0 ? popularBooks.map((book, idx) => <BookCard key={idx} book={book} setBookInfo={setBookInfo} setSeeInfo={setSeeInfo} imageUrl={book.imageUrl} loading={loading}/>) :
                Array.from({length: 5}).map((_, idx) => <BookCard key={idx} book={null} setBookInfo={setBookInfo} setSeeInfo={setSeeInfo} imageUrl={book.imageUrl} loading={loading}/>)}
           </div> : <BookInfo bookInfo={bookInfo}/>}
           <div className='h-2/12 w-full flex flex-col justify-center items-center'>
                <p className='mb-2 text-sm text-neutral-400'>{message ? message :"Search a Book you like"}</p>
                <div className='h-9 w-11/12 lg:w-2/6 md:w-2/6 border-2 border-gray-300 flex justify-between items-center'>
                    <input type="text" className='outline-0 pl-3 text-white text-sm' placeholder='eg: avatar' value={book} onChange={e => setBook(e.target.value)}/>
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

function BookCard({book, imageUrl, loading, setSeeInfo, setBookInfo}) {
    const getInfo = () => {
        if(book) {
            setBookInfo(book);
            setSeeInfo(i => !i);
        }
    }
    return (
        <div
            onClick={() => getInfo()}
            className='skelitan h-12/12 min-w-full lg:min-w-59 md:min-w-59'>
            {!loading ? <img src={imageUrl} alt="IMG" className='h-12/12 w-12/12' /> : null}
        </div>
    );
}


function BookInfo({bookInfo}) {
    if(!bookInfo) {
        return (null);
    }

    return (
        <div className='h-9/12 w-12/12 overflow-y-auto flex flex-col sm:flex-row lg:flex-row md:flex-row gap-2'>
            <div
                className='h-12/12 w-full sm:w-4/12 lg:w-3/12 md:w-4/12'>
                <img src={bookInfo.imageUrl} alt="IMG" className='h-12/12 w-12/12' />
            </div>
            <div className='h-12/12 sm:w-8/12 md:w-8/12 lg:w-9/12 p-5 bg-neutral-900'>
                <div className='h-3/12 overflow-y-auto'>
                    <h1 className='text-3xl text-gray-100 font-bold'>{bookInfo.bookTitle}</h1>
                </div>
                <div className='h-9/12 w-full border-t-2 border-red-900 text-gray-200 overflow-y-auto'>
                    <div className='py-3 border-b-2 border-neutral-950'>
                        <h1 className='font-semibold'>Author: </h1>
                        <div className='px-4 py-1 m-1 text-xs bg-neutral-800 flex justify-center items-center'>
                            <p>{bookInfo.bookAuthor}</p>
                        </div>
                    </div>
                    <div>
                        <h1 className='font-semibold'>Publisher: </h1>
                        <div className='px-4 py-1 m-1 text-xs bg-neutral-950 flex justify-center items-center'>
                            <p>{bookInfo.publisher}/10</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}