import React from "react";
import {
  DataGrid,
  GridColumnMenuContainer,
  GridFilterMenuItem,
  GridColumnMenuProps,
  GridFilterOperator,
} from "@mui/x-data-grid";

// Define the custom filter operator
const containsFilterOperator: GridFilterOperator = {
  label: "Contains",
  value: "contains",
  getApplyFilterFn: (filterItem) => {
    if (!filterItem.value) {
      return null;
    }
    return ({ value }) => {
      return value
        ?.toString()
        .toLowerCase()
        .includes(filterItem.value.toLowerCase());
    };
  },
};

// Custom column menu to show only "contains" filter option
const CustomColumnMenu = (props: GridColumnMenuProps) => {
  const { hideMenu, currentColumn } = props;

  // Create a custom filter menu item that only shows "contains"
  const CustomFilterMenuItem = () => (
    <GridFilterMenuItem
      onClick={hideMenu}
      column={currentColumn}
      operator={containsFilterOperator}
    />
  );

  return (
    <GridColumnMenuContainer hideMenu={hideMenu} currentColumn={currentColumn}>
      <CustomFilterMenuItem />
    </GridColumnMenuContainer>
  );
};

export default CustomColumnMenu;
