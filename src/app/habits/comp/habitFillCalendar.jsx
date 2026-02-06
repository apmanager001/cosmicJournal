import React from 'react'
import IndividualFillCalendar from './individualFillCalendar.jsx'
import {
  useUserHabits,
  usePublicHabits,
  useCreateUserHabit,
} from "@/comp/utility/tanstack/habitHooks";

const HabitFillCalendar = () => {
    const { data: userHabits, isLoading: habitsLoading } = useUserHabits();

  return (
    <div className="inline-flex flex-col md:flex-row justify-center md:justify-around gap-2 p-3 rounded-xl border border-gray-600 shadow-sm customContainer mb-6 w-full">
     {userHabits.map((habit) => (
          <IndividualFillCalendar
            key={habit.id}
            habitId={habit.id}
            title={habit.habit.name}
          />
        ))}
    </div>
  );
}

export default HabitFillCalendar