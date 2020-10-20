import React from "react";
import { TravelItem } from "./types";

interface Props {
  travelItems: TravelItem[];
  onDelete: (item: TravelItem) => void;
}

export const TravelItemTable: React.FC<Props> = ({ travelItems, onDelete }) => {
  return (
    <div>
      {travelItems.map((item) => (
        <div key={item.id}>
          <input type="number" value={item.startingOdometer} readOnly />
          <input disabled value={item.start.name} readOnly />
          <input disabled value={item.end.name} readOnly />
          <input disabled value={item.distance} readOnly />
          <button onClick={(): unknown => onDelete(item)}>Delete</button>
        </div>
      ))}
    </div>
  );
};
