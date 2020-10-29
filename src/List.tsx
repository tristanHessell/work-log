import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TravelItem } from "./types";
import { DatePicker } from "./DatePicker";
import { TravelItemTable } from "./TravelItemTable";
import { getFromLocalStorage } from "./utils";
import { deleteTravelItem, fetchTravelItems } from "./api";
import { DateTime } from "luxon";

export const List = (): JSX.Element => {
  const [currentDate, setCurrentDate] = useState<DateTime>(() => {
    const storedDateString = getFromLocalStorage<string>("currentDate");

    if (storedDateString) {
      return DateTime.fromISO(storedDateString);
    }

    return DateTime.local();
  });
  const [travelItems, setTravelItems] = useState<TravelItem[]>([]);

  function onDeleteTravelItem(item: TravelItem): void {
    const itemIndex = travelItems.indexOf(item);
    setTravelItems([
      ...travelItems.slice(0, itemIndex),
      ...travelItems.slice(itemIndex + 1),
    ]);

    deleteTravelItem(item.id, currentDate.toFormat("yyyyMMdd")).then(() => {
      // TODO
    });
  }

  async function onChangeDate(date: DateTime): Promise<void> {
    setCurrentDate(date);
    setTravelItems([]);
    fetchTravelItems(date.toFormat("yyyyMMdd")).then(
      (newItems: TravelItem[]) => {
        setTravelItems(newItems);
      }
    );
    localStorage.setItem(
      "currentDate",
      JSON.stringify(date.toFormat("yyyyMMdd"))
    );
  }

  useEffect(() => {
    // get the items
    fetchTravelItems(currentDate.toFormat("yyyyMMdd")).then(
      (newItems: TravelItem[]) => {
        setTravelItems(newItems);
      }
    );
  }, []);

  return (
    <div>
      <Link to="">Home</Link>
      <DatePicker currentDate={currentDate} onChange={onChangeDate} />
      <TravelItemTable
        travelItems={travelItems}
        onDelete={onDeleteTravelItem}
      />
    </div>
  );
};
