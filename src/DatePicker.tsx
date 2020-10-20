import React from "react";
import { DateTime } from "luxon";

interface Props {
  onChange: (date: DateTime) => void;
  currentDate: DateTime;
}

export const DatePicker: React.FC<Props> = ({ currentDate, onChange }) => {
  const isTodaysDate = Math.abs(currentDate.diffNow("days").days) < 1;

  async function onClickDecrementCurrentDay(): Promise<void> {
    const newCurrentDate = currentDate.minus({ days: 1 });
    onChange(newCurrentDate);
  }

  async function onClickIncrementCurrentDay(): Promise<void> {
    const newCurrentDate = currentDate.plus({ days: 1 });
    onChange(newCurrentDate);
  }

  return (
    <div>
      <button onClick={onClickDecrementCurrentDay}>&lt;</button>
      {currentDate.toLocaleString()}
      <button onClick={onClickIncrementCurrentDay} disabled={isTodaysDate}>
        &gt;
      </button>
    </div>
  );
};
