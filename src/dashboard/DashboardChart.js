import { useState } from 'react';
import ChartDashboard from './ChartDashboard';

const DashboardChart = () => {
    const [selectedDate, setSelectedDate] = useState(Date);

    return (
        <div className='container'>
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
