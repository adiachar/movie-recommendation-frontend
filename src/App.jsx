import { useState } from 'react';
import './App.css';
import Bookmate from './Bookmate';
import Cinemate from './Cinemate';
import { Button } from '@mui/material';

function App() {
  const [cinimate, setCinimate] = useState(true);
  return (
    <div className='App min-h-screen w-screen lg:py-4 md:py-4 bg-neutral-700 flex flex-col justify-center items-center'>
      <div className='my-2 flex gap-2'>
        <Button 
          size='small'
          sx={{borderRadius: "1rem"}}
          variant={cinimate ? 'contained' : 'outlined'} 
          color='error'
          onClick={() => setCinimate(true)}>Cinimate</Button>
          <Button 
          size='small'
          sx={{borderRadius: "1rem"}}
          variant={!cinimate ? 'contained' : 'outlined'} 
          color='success'
          onClick={() => setCinimate(false)}>Cinimate</Button>
      </div>
      {cinimate ? <Cinemate/> : <Bookmate/>}
    </div>
  )
}

export default App
