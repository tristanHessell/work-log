import React, { useState } from "react";
import { Place, Requested } from "./types";

interface Props {
  className?: string;
  place?: Place;
  trigger: (onClick: () => void) => React.ReactNode;
  input: (place?: Place) => React.ReactNode;
  getter: () => Promise<Place>;
  onComplete: (place: Place) => void;
}

const DEFAULT_ITEM_META: Requested<Place> = { type: "Entity" };

export const PlaceInput: React.FC<Props> = ({
  getter,
  onComplete,
  trigger,
  input,
  place,
  className,
}) => {
  const [itemMeta, setItemMeta] = useState<Requested<Place>>(DEFAULT_ITEM_META);

  const onClickTrigger = async (): Promise<void> => {
    try {
      setItemMeta({ type: "Loading" });

      const item = await getter();
      setItemMeta({ type: "Entity" });

      onComplete(item);
    } catch (err) {
      setItemMeta({ type: "Error", error: err });
    }
  };

  switch (itemMeta.type) {
    case "Loading": {
      return <div className={className}>LOADING {trigger(onClickTrigger)}</div>;
    }
    case "Entity": {
      return (
        <div className={className}>
          {input(place)}
          {trigger(onClickTrigger)}
        </div>
      );
    }
    case "Error": {
      return <div className={className}>Error {trigger(onClickTrigger)}</div>;
    }
  }
};
