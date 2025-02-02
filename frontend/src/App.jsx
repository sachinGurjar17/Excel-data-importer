import './App.css'
import FileUpload from './components/Fileupload'
import  { Toaster } from 'react-hot-toast';

function App() {

  return (
      <>
        <h1 className='text-bold text-sm text-center'>Excel Data Importer</h1>
        <Toaster/>
        <FileUpload/>
      </>
  )
}

export default App
