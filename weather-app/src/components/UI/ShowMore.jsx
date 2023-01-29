import React, { useState } from "react";
import classes from "./ShowMore.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

const ShowMore = (props) => {
//   const [opened, setOpened] = useState(false);

//   const openHandler = () => {
//     setOpened((prevState) => {
//       setOpened(!prevState);
//     });
//   };

  return (
    <button
      className={`${classes.show_btn} ${!props.collapsed && classes.transformDown}`}
      onClick={props.onCollapse}
    >
      <FontAwesomeIcon icon={!props.collapsed ? faAngleDown : faAngleUp} size='lg' />
    </button>
  );
};

export default ShowMore;
