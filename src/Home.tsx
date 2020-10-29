import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Place, TravelItem } from "./types";
import { PlaceInput } from "./PlaceInput";
import { getFromLocalStorage } from "./utils";
import { getPlace, getDistance, saveTravelItem } from "./api";
import { DateTime } from "luxon";

function getEndOdometer(item: Partial<TravelItem>): number {
  return item.start && item.end
    ? (item?.distance || 0) + (item.startingOdometer || 0)
    : 0;
}

export const Home = (): JSX.Element => {
  const [currentItem, setCurrentItem] = useState<Partial<TravelItem>>(
    () =>
      getFromLocalStorage<Partial<TravelItem>>("currentItem") || {
        id: uuid(),
        startingOdometer: 0,
      }
  );
  const startingOdoRef = useRef<HTMLInputElement>(null);

  function onClickClearCurrent(
    e: React.MouseEvent,
    item: Partial<TravelItem>
  ): void {
    setCurrentItem({
      id: item.id,
      startingOdometer: 0,
    });
    localStorage.removeItem("currentItem");
    startingOdoRef.current?.focus();
  }

  function onClickAddNew(e: React.MouseEvent, item: TravelItem): void {
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
  }, []);

  return (
    <div className="home">
      <div className="item-entry">
        <div className="lstart-odo">Start Odo</div>
        <div className="lstart-location">Start</div>
        <div className="lend-location">End</div>
        <div className="lend-odo">End Odo</div>
        <div className="ldistance">Distance</div>
        <div className="lactioncol"></div>
        <input
          className="start-odo"
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
          className="start-location"
          place={currentItem.start}
          getter={getPlace}
          onComplete={onClickStartPlace}
          trigger={(onClick: () => void): React.ReactNode => (
            <button className="start-location-btn" onClick={onClick}>
              Get Start
            </button>
          )}
          input={(place?: Place): React.ReactNode => (
            <input
              className="start-location-input"
              value={place?.name || ""}
              placeholder="Start Location"
              readOnly
            />
          )}
        />
        <PlaceInput
          className="end-location"
          place={currentItem.end}
          getter={getPlace}
          onComplete={onClickEndPlace}
          trigger={(onClick: () => void): React.ReactNode => (
            <button className="end-location-btn" onClick={onClick}>
              End location
            </button>
          )}
          input={(place?: Place): React.ReactNode => (
            <input
              className="end-location-input"
              value={place?.name || ""}
              placeholder="End Location"
              readOnly
            />
          )}
        />
        <input
          className="distance"
          value={currentItem.distance || 0}
          readOnly
        />
        <input
          className="end-odo"
          value={getEndOdometer(currentItem)}
          readOnly
        />
        <button
          className="clear-btn"
          onClick={(e) => onClickClearCurrent(e, currentItem)}
        >
          Clear
        </button>
      </div>
      <button
        onClick={(e) => onClickAddNew(e, currentItem as TravelItem)}
        disabled={!currentItem.start || !currentItem.end}
      >
        (Save and) Start new
      </button>
      <Link to="list/">List</Link>
    </div>
  );
};
