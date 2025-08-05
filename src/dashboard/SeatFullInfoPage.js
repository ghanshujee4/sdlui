import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import config from "../config";
import MultiSelect from "../MultiSelect";
import { HiArrowNarrowLeft } from "react-icons/hi";
import Icon from "../utils/IconButton";
import GrowLoader from "../utils/Growloader";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry } from 'ag-grid-community';
import {
  AllCommunityModules
} from 'ag-grid-community';

// ✅ Register modules globally
ModuleRegistry.registerModules(AllCommunityModules);



const SeatFullInfoPage = () => {
  const gridRef = useRef();
  const [seats, setSeats] = useState([]);
  const [filteredSeats, setFilteredSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);

  useEffect(() => {
    fetchSeatData();
  }, []);

  const fetchSeatData = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/seats/full-info`);
      const sortedData = response.data.sort(
        (a, b) => parseInt(a.seatNo) - parseInt(b.seatNo)
      );
      setSeats(sortedData);
      setFilteredSeats(sortedData);

      const shifts = [...new Set(sortedData.map((item) => item.shift).filter(Boolean))];
      setShiftOptions(shifts.sort().map((shift) => ({ name: shift })));
    } catch (error) {
      console.error("Error fetching seat data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShiftSelect = (selectedList) => {
    setSelectedShifts(selectedList);
    if (selectedList.length === 0) {
      setFilteredSeats(seats);
    } else {
      const selectedShiftNames = selectedList.map((item) => item.name);
      const filtered = seats.filter((seat) =>
        selectedShiftNames.includes(seat?.shift)
      );
      setFilteredSeats(filtered);
    }
  };

  const handleShiftRemove = (removedList) => {
    handleShiftSelect(removedList);
  };

  const today = new Date().toISOString().split("T")[0];

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Enrollment ID",
        field: "userId",
        sortable: true,
        filter: true,
        maxWidth: 100,
        cellClass: "text-center font-semibold",
      },
      {
        headerName: "Seat No",
        field: "seatNo",
        sortable: true,
        filter: true,
        maxWidth: 100,
        cellClass: "text-center font-semibold",
      },
      {
        headerName: "Shift",
        field: "shift",
        sortable: true,
        filter: true,
        maxWidth: 90,
        cellClass: "text-center",
      },
      {
        headerName: "User Name",
        field: "userName",
        valueGetter: (params) => params.data?.userName || "Empty",
        flex: 1,
        minWidth: 140,
        cellClass: "pl-3",
      },
      // {
      //   headerName: "Mobile",
      //   field: "mobile",
      //   minWidth: 100,
      // },
      {
        headerName: "Due Date",
        field: "dueDate",
        maxWidth: 120,
        cellStyle: { textAlign: "center" },
      },
    ],
    []
  );

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
  }), []);

const getRowStyle = (params) => {
  const dueDateStr = params.data?.dueDate;
  const paymentDateStr = params.data?.paymentDate;

  const toDate = (str) => (str ? new Date(str.split("T")[0]) : null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = toDate(dueDateStr);
  const paymentDate = toDate(paymentDateStr);

  if (paymentDate && paymentDate.getTime() === today.getTime()) {
    return { backgroundColor: "#fff4f4" }; // Today
  } else if (paymentDate && dueDate && paymentDate < dueDate) {
    return { backgroundColor: "#f0fff4" }; // Early
  } else if (dueDate && dueDate < today && (!paymentDate || paymentDate > dueDate)) {
    return { backgroundColor: "#ffe4e6" }; // Late or missing
  }

  return {};
};



  if (loading) {
    return (
      <div className="text-center mt-5">
        <GrowLoader />
        <div>Loading data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Icon
        Icon={HiArrowNarrowLeft}
        label="Back"
        onClick={() => window.history.back()}
      />

      <h2 className="text-2xl font-bold mb-4">Seat Full Information</h2>

      <div className="mb-4 max-w-md">
        <MultiSelect
          options={shiftOptions}
          selectedValues={selectedShifts}
          onSelect={handleShiftSelect}
          onRemove={handleShiftRemove}
          placeholder="Filter by shift"
        />
      </div>

      <div className="ag-theme-alpine shadow-lg rounded-xl overflow-hidden" style={{ height: 900, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={filteredSeats}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowStyle={getRowStyle}
          pagination={true}
          paginationPageSize={25}
          animateRows={true}
          rowSelection="single"
          // domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

export default SeatFullInfoPage;
