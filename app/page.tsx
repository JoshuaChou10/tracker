'use client'
import { useState, useEffect } from 'react';
import Image from "next/image";

export default function Home() {
  const [currentTracker, setCurrentTracker] = useState<string>('Tracker1');
  const [trackers, setTrackers] = useState<{ [key: string]: any }>({
    Tracker1: { count: 0, goal: 0, goalCondition: 'Above', addNumber: 1, countsByDay: [], tracking: '' },
    
  });
  const [note, setNote] = useState<string>('');

useEffect(() => {
  const savedNote = localStorage.getItem('note');
  if (savedNote !== null) setNote(savedNote);
}, []);

const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const newNote = e.target.value;
  setNote(newNote);
  localStorage.setItem('note', newNote);
};

  const [count, setCount] = useState<number>(0);
  const [countsByDay, setCountsByDay] = useState<{ date: string, count: number, dayName: string }[]>([]);
  const [goal, setGoal] = useState<number>(0);
  const [goalCondition, setGoalCondition] = useState<string>('Above');
  const [addNumber, setAddNumber] = useState<number>(1);
  const [tracking, setTracking] = useState<string>('');

  useEffect(() => {
    const savedTracking = localStorage.getItem('tracking');
    if (savedTracking !== null) setTracking(savedTracking);
  }, []);

  const handleTrackingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTracking = e.target.value;
    setTracking(newTracking);
    localStorage.setItem('tracking', newTracking);
  };

  useEffect(() => {
    const savedGoal = localStorage.getItem('goal');
    if (savedGoal !== null) setGoal(parseFloat(savedGoal));

    const savedGoalCondition = localStorage.getItem('goalCondition');
    if (savedGoalCondition !== null) setGoalCondition(savedGoalCondition);

    const savedAddNumber = localStorage.getItem('addNumber');
    if (savedAddNumber !== null && !Number.isNaN(parseFloat(savedAddNumber))) {
      setAddNumber(parseFloat(savedAddNumber));
    }
  }, []);

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGoal = parseFloat(e.target.value);
    setGoal(newGoal);
    localStorage.setItem('goal', newGoal.toString());
  };

  const handleGoalConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCondition = e.target.value;
    setGoalCondition(newCondition);
    localStorage.setItem('goalCondition', newCondition);
  };

  const handleAddNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddNumber = parseFloat(e.target.value);
    if (!Number.isNaN(newAddNumber)) {
      setAddNumber(newAddNumber);
      localStorage.setItem('addNumber', newAddNumber.toString());
    }
  };

  useEffect(() => {
    const today = new Date();
    const dateStrings = [];
    let dateString = today.toISOString().split('T')[0];
    const previousDay = new Date(today); // Initialize previousDay here
  
    while (true) {
      const savedCount = localStorage.getItem(`count${dateString}`);
      if (savedCount === null) {
        break;
      }
      const dateObj = new Date(dateString);
      dateObj.setDate(dateObj.getDate() + 1); // Adjust the date by adding 1 day
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  
      dateStrings.push({ date: dateString, count: parseFloat(savedCount), dayName });
  
      // Decrement the previousDay date correctly within the loop
      previousDay.setDate(previousDay.getDate() - 1);
      dateString = previousDay.toISOString().split('T')[0];
    }
  
    setCountsByDay(dateStrings);
  
    const todayCount = localStorage.getItem(`count${today.toISOString().split('T')[0]}`);
    if (todayCount !== null && !Number.isNaN(parseFloat(todayCount))) {
      setCount(parseFloat(todayCount));
    }
  }, []);
  

  const Add = () => {
    setCount(prev => {

      const newCount = prev + addNumber ;
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

      localStorage.setItem(`count${dateString}`, newCount.toString());
      
      setCountsByDay(prevCounts => {
        const updatedCounts = [...prevCounts];
        const todayIndex = updatedCounts.findIndex(c => c.date === dateString);
        if (todayIndex > -1) {
          updatedCounts[todayIndex].count = newCount;
        } else {
          updatedCounts.unshift({ date: dateString, count: newCount, dayName });
        }
        return updatedCounts;
      });

      return newCount;
    });
  };
  const Minus= () => {
    setCount(prev => {
      const newCount = prev -addNumber;
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

      localStorage.setItem(`count${dateString}`, newCount.toString());
      
      setCountsByDay(prevCounts => {
        const updatedCounts = [...prevCounts];
        const todayIndex = updatedCounts.findIndex(c => c.date === dateString);
        if (todayIndex > -1) {
          updatedCounts[todayIndex].count = newCount;
        } else {
          updatedCounts.unshift({ date: dateString, count: newCount, dayName });
        }
        return updatedCounts;
      });

      return newCount;
    });
  };
  const getFontSizeClass = (count:number) => {
    
    if (count <= 3) return 'text-lg';
    if (count <= 7) return 'text-xl';
    if (count <= 15) return 'text-2xl';
    return 'text-3xl';
    
  
    }
    const getCountClass = () => {
     
      if (goalCondition === "Above" && count >= goal) {
        return  "text-2xl text-green-500";
      } else if (goalCondition === "Below") {
     
        if (count >= goal) return "text-2xl text-red-500";
        if (count==0) return "text-2xl text-green-500"
        if (Math.abs(goal-count)<=2) return  "text-2xl text-orange-500";
        if (count < goal) return "text-2xl text-green-500";
      
        
      }
    return "text-2xl"
    };
    const Hide=()=>{
      setNote('By clicking on the title, all information is hidden. Just reload the page and all data will be back.')
      setTracking('You have found an easter egg')

    }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
          </a>
        </div>
      </div>
      <div className="fixed right-0 top-0 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
  <h2 className="text-lg font-bold mb-2">Notepad</h2>
  <textarea
    value={note}
    onChange={handleNoteChange}
    className="mb-4 p-2 bg-gray-700 text-white rounded w-full h-48"
    placeholder="Write any notes or reminders here"
  />
</div>

      <div className="fixed left-0 top-0 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
  <h2 className="text-lg font-bold mb-2">What Habit do You Plan to Build/Break?</h2>
  <input
    type="text"
    value={tracking}
    onChange={handleTrackingChange}
    className="mb-4 p-1 bg-gray-700 text-white rounded w-full"
  />
  <h2 className="text-lg font-bold mb-2">Goal for Today</h2>
  <select 
    value={goalCondition} 
    onChange={handleGoalConditionChange} 
    className="mb-2 p-1 bg-gray-700 text-white rounded"
  >
    <option value="Above">Above</option>
    <option value="Below">Below</option>
    <option value="None">None</option>
  </select>
  <input
    type="number"
    value={goal}
    onChange={handleGoalChange}
    className="ml-2 w-16 p-1 bg-gray-700 text-white rounded mb-4"
  />
</div>
<h1     onClick={Hide} className="text-2xl">{tracking}</h1>
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">

        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/tracker2.png"
          alt="Tracker Logo"
          width={200}
          height={42}
      
          priority
        />
      </div>

      <div className="flex flex-col items-center space-y-4">
        <h1 className={getCountClass()}>Count: {count}</h1>
        <button
          onClick={Add}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Add {addNumber}
        </button>
        <button
          onClick={Minus}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
         Minus {addNumber}
        </button>
        <h2 className="text-lg font-bold mb-2">Increase/Decrease</h2>
  <input
    type="number"
    step="0.5"
    value={addNumber}
    onChange={handleAddNumberChange}
    className="w-16 p-1 bg-gray-700 text-white rounded"
  />

      </div>
   
    

      <div className="w-full max-w-5xl mt-8">
        {countsByDay.map(({ date, count, dayName }) => (
          <div key={date} className="flex justify-between border-b py-2">
            <span>{dayName}, {date}</span>
            <span className={getFontSizeClass(count)}>{count}</span>
          </div>
        ))}
      </div>

  <footer className="mt-12 text-center text-gray-500 ">
    <p>Made by Joshua Chou © {new Date().getFullYear()}</p>
  </footer>
    </main>
  );
}
