/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { Place, TravelItem } from "./types";
import {
  getPlace,
  getDistance,
  deleteTravelItem,
  saveTravelItem,
  fetchTravelItems,
} from "./api";
import { DateTime } from "luxon";
import "./App.css";

// TODO
// make it so the time entries are deleted use google cloud
// save the entries locally (session) until they are confirmed to be saved to backend

type Requested<T = Record<string, unknown>, E = Error> =
  | { type: "Entity"; entity?: T }
  | { type: "Loading" }
  | { type: "Error"; error: E };

interface PlaceProps {
  itemMeta: Requested<Place>;
  children: React.ReactNode;
}

const PlaceInput: React.FC<PlaceProps> = ({ itemMeta, children }) => {
  switch(itemMeta.type) {
    case "Loading": {
      return <>LOADING</>
    }
    case "Entity": {
      return <>{children}</>;
    }
    case "Error": {
      return <>Error</>;
    }
  }
};

function errorReplacer (key: string, value: unknown): unknown | Record<string, unknown> {
    if (value instanceof Error) {
      const error: Record<string, unknown> = {};

        Object.getOwnPropertyNames(value).forEach(function (key) {
          //@ts-ignore
          error[key] = value[key];
        });

        return error;
    }

    return value;
}

const DEFAULT_REQUESTED: Requested<Place> = { type: "Entity" };

function App(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<DateTime>(() =>
    DateTime.local()
  );
  const [travelItems, setTravelItems] = useState<TravelItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<TravelItem>>({
    id: uuid(),
    startingOdometer: 0,
  });
  const startingOdoRef = useRef<HTMLInputElement>(null);
  const isTodaysDate = Math.abs(currentDate.diffNow("days").days) < 1;
  const [startState, setStartState] = useState<Requested<Place>>(DEFAULT_REQUESTED);
  const [endState, setEndState] = useState<Requested<Place>>(DEFAULT_REQUESTED);

  function onClickDeleteItem(e: any, item: TravelItem): void {
    const itemIndex = travelItems.indexOf(item);
    setTravelItems([
      ...travelItems.slice(0, itemIndex),
      ...travelItems.slice(itemIndex + 1),
    ]);

    deleteTravelItem(item.id).then(() => {
      // TODO
    });
  }

  function onClickClearCurrent(e: any, item: Partial<TravelItem>): void {
    setCurrentItem({
      id: item.id,
      startingOdometer: 0,
    });
    setStartState(DEFAULT_REQUESTED);
    setEndState(DEFAULT_REQUESTED);
    startingOdoRef.current?.focus();
  }

  function onClickAddNew(e: any, item: TravelItem): void {
    // add the currrent item to the list
    setTravelItems([...travelItems, item]);
    // change he current item to a new one
    setCurrentItem({
      id: uuid(),
      startingOdometer: item.startingOdometer || 0,
    });
    startingOdoRef.current?.focus();

    saveTravelItem(item).then(() => {
      // TODO
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
    try {
      setStartState({ type: "Loading" });
      const start = await getPlace();

      setCurrentItem({
        ...item,
        start,
      });
      setStartState({ type: "Entity", entity: start });
    } catch (err) {
      console.log(err, JSON.stringify(err));
      setStartState({ type: "Error", error: err });
    }
  }

  async function onClickEndPlace(
    e: any,
    item: Partial<TravelItem>
  ): Promise<void> {
    try {
      setEndState({ type: "Loading" });
      const end = await getPlace();
      const distance = await getDistance(item.start as Place, end);

      setCurrentItem({
        ...item,
        end,
        distance,
      });
      setEndState({ type: "Entity", entity: end });
    } catch (err) {
      setEndState({ type: "Error", error: err });
    }
  }

  //start with the focus on the starting odometer input
  useEffect(() => {
    startingOdoRef.current?.focus();
  }, []);

  async function onClickDecrementCurrentDay(): Promise<void> {
    const newCurrentDate = currentDate.minus({ days: 1 });
    setCurrentDate(newCurrentDate);
    fetchTravelItems().then((newItems: TravelItem[]) => {
      setTravelItems(newItems);
    });
  }

  async function onClickIncrementCurrentDay(): Promise<void> {
    const newCurrentDate = currentDate.plus({ days: 1 });
    setCurrentDate(newCurrentDate);
    fetchTravelItems().then((newItems: TravelItem[]) => {
      setTravelItems(newItems);
    });
  }

  return (
    <div className="App">
      <div>
        <button onClick={onClickDecrementCurrentDay}>&lt;</button>
        {currentDate.toLocaleString()}
        <button onClick={onClickIncrementCurrentDay} disabled={isTodaysDate}>
          &gt;
        </button>
      </div>
      {travelItems.map((item) => (
        <div key={item.id}>
          <input type="number" value={item.startingOdometer} readOnly />
          <input disabled value={item.start.name} readOnly />
          <input disabled value={item.end.name} readOnly />
          <input disabled value={item.distance} readOnly />
          <button onClick={(e: any): unknown => onClickDeleteItem(e, item)}>
            Delete
          </button>
        </div>
      ))}
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
        <button
          onClick={(e): void => {
            onClickStartPlace(e, currentItem);
          }}
        >
          Get Start Location
        </button>
        <PlaceInput itemMeta={startState} >
      <input value={currentItem.start?.name || ""} placeholder="Start Location" readOnly />
      </PlaceInput>
        <button onClick={(e: any): unknown => onClickEndPlace(e, currentItem)}>
          Get End Location
        </button>
        <PlaceInput itemMeta={endState} >
      <input value={currentItem.end?.name || ""} placeholder="End Location" readOnly />
        </PlaceInput>
        <input value={currentItem.distance || 0} readOnly />
        <button onClick={(e): unknown => onClickClearCurrent(e, currentItem)}>
          Clear
        </button>
      </div>
      <button
        onClick={(e: any): unknown =>
          onClickAddNew(e, currentItem as TravelItem)
        }
        disabled={!currentItem.start || !currentItem.end}
      >
        (Save and) Start new
      </button>
      Current:<pre>{JSON.stringify(currentItem, errorReplacer, 2)}</pre>
      Start:<pre>{JSON.stringify(startState, errorReplacer, 2)}</pre>
      End:<pre>{JSON.stringify(endState, errorReplacer, 2)}</pre>
    </div>
  );
}

export default App;
