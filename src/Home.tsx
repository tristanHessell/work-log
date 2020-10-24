import React, { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { Place, TravelItem } from "./types";
import { PlaceInput } from "./PlaceInput";
import { DatePicker } from "./DatePicker";
import { TravelItemTable } from "./TravelItemTable";
import { getFromLocalStorage, errorReplacer } from "./utils";
import {
  getPlace,
  getDistance,
  deleteTravelItem,
  saveTravelItem,
  fetchTravelItems,
} from "./api";
import { DateTime } from "luxon";
import "./App.css";

export const Home = (): JSX.Element => {
  const [currentDate, setCurrentDate] = useState<DateTime>(() =>
    DateTime.local()
  );
  const [travelItems, setTravelItems] = useState<TravelItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<TravelItem>>(
    getFromLocalStorage<Partial<TravelItem>>("currentItem") || {
      id: uuid(),
      startingOdometer: 0,
    }
  );
  const startingOdoRef = useRef<HTMLInputElement>(null);

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

  function onClickClearCurrent(e: React.MouseEvent, item: Partial<TravelItem>): void {
    setCurrentItem({
      id: item.id,
      startingOdometer: 0,
    });
    localStorage.removeItem("currentItem");
    startingOdoRef.current?.focus();
  }

  function onClickAddNew(e: React.MouseEvent, item: TravelItem): void {
    // add the currrent item to the list
    setTravelItems([...travelItems, item]);
    // change he current item to a new one
    setCurrentItem({
      id: uuid(),
      startingOdometer: item.startingOdometer || 0,
    });
    startingOdoRef.current?.focus();

    saveTravelItem(item, DateTime.local().toFormat("yyyyMMdd")).then(() => {
      localStorage.removeItem("currentItem");
    });
  }

  async function onChangeOdometer(
    e: React.ChangeEvent<HTMLInputElement>,
    item: Partial<TravelItem>
  ): Promise<void> {
    const newItem = {
      ...item,
      startingOdometer: +e.target.value,
    };
    setCurrentItem(newItem);
    localStorage.setItem("currentItem", JSON.stringify(newItem));
  }

  async function onClickStartPlace(start: Place): Promise<void> {
    const newItem = {
      ...currentItem,
      start,
    };

    setCurrentItem(newItem);
    localStorage.setItem("currentItem", JSON.stringify(newItem));
  }

  async function onClickEndPlace(end: Place): Promise<void> {
    const distance = await getDistance(currentItem.start as Place, end);

    const newItem = {
      ...currentItem,
      end,
      distance,
    };
    setCurrentItem(newItem);
    localStorage.setItem("currentItem", JSON.stringify(newItem));
  }

  useEffect(() => {
    //start with the focus on the starting odometer input
    startingOdoRef.current?.focus();
    // get the items
    fetchTravelItems(DateTime.local().toFormat("yyyyMMdd")).then(
      (newItems: TravelItem[]) => {
        setTravelItems(newItems);
      }
    );
  }, []);

  async function onChangeDate(date: DateTime): Promise<void> {
    setCurrentDate(date);
    fetchTravelItems(date.toFormat("yyyyMMdd")).then(
      (newItems: TravelItem[]) => {
        setTravelItems(newItems);
      }
    );
  }

  return (
    <div className="App">
      <DatePicker currentDate={currentDate} onChange={onChangeDate} />
      <TravelItemTable
        travelItems={travelItems}
        onDelete={onDeleteTravelItem}
      />
      <div>
        <input
          ref={startingOdoRef}
          type="number"
          min="0"
          value={currentItem.startingOdometer}
          placeholder="Starting odometer reading"
          onChange={(e): void => {
            onChangeOdometer(e, currentItem);
          }}
        />
        <PlaceInput
          place={currentItem.start}
          getter={getPlace}
          onComplete={onClickStartPlace}
          trigger={(onClick: () => void): React.ReactNode => (
            <button onClick={onClick}>Get Start Location</button>
          )}
          input={(place?: Place): React.ReactNode => (
            <input
              value={place?.name || ""}
              placeholder="Start Location"
              readOnly
            />
          )}
        />
        <PlaceInput
          place={currentItem.end}
          getter={getPlace}
          onComplete={onClickEndPlace}
          trigger={(onClick: () => void): React.ReactNode => (
            <button onClick={onClick}>Get end location</button>
          )}
          input={(place?: Place): React.ReactNode => (
            <input
              value={place?.name || ""}
              placeholder="End Location"
              readOnly
            />
          )}
        />
        <input value={currentItem.distance || 0} readOnly />
        <button onClick={(e) => onClickClearCurrent(e, currentItem)}>
          Clear
        </button>
      </div>
      <button
        onClick={(e) =>
          onClickAddNew(e, currentItem as TravelItem)
        }
        disabled={!currentItem.start || !currentItem.end}
      >
        (Save and) Start new
      </button>
      Current:<pre>{JSON.stringify(currentItem, errorReplacer, 2)}</pre>
    </div>
  );
};
