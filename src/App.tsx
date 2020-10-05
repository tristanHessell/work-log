import React, { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { Place, TravelItem } from "./types";
import { getPlace, getDistance } from "./api";
import "./App.css";

// TODO
// make it so you can delete a time entry and the times follow on
// make it so the time entries are saved use google cloud
// ensure API key isnt inside version control

function App(): JSX.Element {
  const [travelItems, setTravelItems] = useState<TravelItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<TravelItem>>({
    id: uuid(),
    startingOdometer: 0,
  });
  const startingOdoRef = useRef<HTMLInputElement>(null);

  function onClickDeleteItem(e: any, item: TravelItem): void {
    const itemIndex = travelItems.indexOf(item);
    setTravelItems([
      ...travelItems.slice(0, itemIndex),
      ...travelItems.slice(itemIndex + 1),
    ]);
  }

  function onClickClearCurrent(e: any, item: Partial<TravelItem>) {
    setCurrentItem({
      id: item.id,
      startingOdometer: 0,
    });
    startingOdoRef.current?.focus();
  }

  function onClickAddNew(e: any, item: Partial<TravelItem>): void {
    // add the currrent item to the list
    setTravelItems([...travelItems, item as TravelItem]);
    // change he current item to a new one
    setCurrentItem({
      id: uuid(),
      startingOdometer: item.startingOdometer || 0,
    });
  }

  async function onChangeOdometer(
    e: any,
    item: Partial<TravelItem>
  ): Promise<void> {
    setCurrentItem({
      ...item,
      startingOdometer: +e.target.value,
    });
  }

  async function onClickStartPlace(
    e: any,
    item: Partial<TravelItem>
  ): Promise<void> {
    const start = await getPlace();

    setCurrentItem({
      ...item,
      start,
    });
  }

  async function onClickEndPlace(
    e: any,
    item: Partial<TravelItem>
  ): Promise<void> {
    const end = await getPlace();
    const distance = await getDistance(item.start as Place, end);

    setCurrentItem({
      ...item,
      end,
      distance,
    });
  }

  useEffect(() => {
    startingOdoRef.current?.focus();
  });

  return (
    <div className="App">
      {travelItems.map((item) => (
        <div key={item.id}>
          <input type="number" value={item.startingOdometer} readOnly />
          <input disabled value={item.start.name} readOnly />
          <input disabled value={item.end.name} readOnly />
          <input disabled value={item.distance} readOnly />
          <button onClick={(e) => onClickDeleteItem(e, item)}>Delete</button>
        </div>
      ))}
      <button
        onClick={(e) => onClickAddNew(e, currentItem)}
        disabled={!currentItem.start || !currentItem.end}
      >
        (Save and) Start new
      </button>
      <div>
        <input
          ref={startingOdoRef}
          type="number"
          value={currentItem.startingOdometer}
          placeholder="Starting odometer reading"
          onChange={(e) => onChangeOdometer(e, currentItem)}
        />
        <button onClick={(e) => onClickStartPlace(e, currentItem)}>
          Get Start Location
        </button>
        <input
          value={currentItem.start?.name || ""}
          placeholder="Start Location"
          readOnly
        />
        <button onClick={(e) => onClickEndPlace(e, currentItem)}>
          Get End Location
        </button>
        <input
          value={currentItem.end?.name || ""}
          placeholder="End Location"
          readOnly
        />
        <input value={currentItem.distance || 0} readOnly />
        <button onClick={(e) => onClickClearCurrent(e, currentItem)}>
          Clear
        </button>
      </div>
    </div>
  );
}

export default App;
