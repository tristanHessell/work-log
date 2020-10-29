import React from "react";
import { TravelItem } from "./types";

interface Props {
  travelItems: TravelItem[];
  onDelete: (item: TravelItem) => void;
}

export const TravelItemTable: React.FC<Props> = ({ travelItems, onDelete }) => {
  return (
    <div className="travel-item-table">
      <div className="title-bar">
        <div className="start-odo">Start Odo</div>
        <div className="start-location">Start</div>
        <div className="end-location">End</div>
        <div className="end-odo">End Odo</div>
        <div className="distance">Distance</div>
      </div>
      {travelItems.map((item) => (
        <div key={item.id}>
          <input
            className="start-odo"
            type="number"
            value={item.startingOdometer}
            disabled
            readOnly
          />
          <input
            className="start-location"
            disabled
            value={item.start.name}
            readOnly
          />
          <input
            className="end-location"
            disabled
            value={item.end.name}
            readOnly
          />
          <input
            className="end-odo"
            value={(item.distance || 0) + (item.startingOdometer || 0)}
            readOnly
          />
          <input className="distance" disabled value={item.distance} readOnly />
          <button
            className="delete-btn"
            onClick={(): unknown => onDelete(item)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
