// src/context/AuthContext/useAuth.js
import { useContext } from 'react';
import JobContext from './JobContext';

const useJob = () => useContext(JobContext);
export default useJob;