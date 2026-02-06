import Calendar from "react-fill-calendar";
import {
  useUserHabits,
  usePublicHabits,
  useCreateUserHabit,
  useHabitLogs,
} from "@/comp/utility/tanstack/habitHooks";

const IndividualFillCalendar = ({ habitId, title }) => {
  const { data: habitLogs, isLoading: logsLoading } = useHabitLogs(habitId);

  const completed = habitLogs
    ? habitLogs.map((log) => ({
        day: new Date(log.date).toISOString().split("T")[0],
      }))
    : [];
    
  return (
    <Calendar
      key={habitId}
      title={title}
      selectedDates={completed}
      hoverborderColor="#FFCCCB"
    />
  );};

export default IndividualFillCalendar;
