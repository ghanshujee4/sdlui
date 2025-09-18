import { useState, navigate } from 'react';
import ChartDashboard from './ChartDashboard';
import { Card } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const DashboardChart = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(Date);

    return (
        <div className='container'>
            <hr></hr>
            <div className="mb-3 col-sm-3 float-left">
  <Card className="badge bg-danger text-wrap select2-container" style={{ fontSize: '22px', cursor: 'pointer' }} onClick={() => navigate("/paymentdashboard")}>
    Payment Chart Board 
  </Card></div>
  <hr></hr>
            <h3 className="text-xl font-bold mb-4">User Status Chart</h3>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mb-4 border p-2 rounded"
            />
            <ChartDashboard selectedDate={selectedDate} />
        </div>
    );
};

export default DashboardChart;
