import React from "react";
import { Box, Tab, Tabs } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Panel=({sentRequests , friendRequests , friends})=>{
    const [value, setValue] = React.useState(0);
    
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    };
    
    return(
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Sent Requests" {...a11yProps(0)} />
                    <Tab label="Friends" {...a11yProps(1)} />
                    <Tab label="Incoming Friend Requests" {...a11yProps(2)} />
                </Tabs>
            </Box>
    
            <CustomTabPanel value={value} index={0}>
                <div className="w-full bg-white p-4 rounded-lg shadow-md mb-4 mt-4">
                    {sentRequests.length > 0 ? (
                        <ul>
                        {sentRequests.map((request, index) => (
                            <li key={index} className="border-b py-2">{request.name}</li>
                        ))}
                        </ul>
                    ) : (
                        <p>No sent requests.</p>
                    )}
                </div>
            </CustomTabPanel>
    
            <CustomTabPanel value={value} index={1}>
                <div className="w-full bg-white p-4 rounded-lg shadow-md mb-4 mt-4">
                    {friends.length > 0 ? (
                    <ul>
                        {friends.map((friend, index) => (
                        <li key={index} className="border-b py-2">{friend.name}</li>
                        ))}
                    </ul>
                    ) : (
                    <p>No friends.</p>
                    )}
                </div>
            </CustomTabPanel>
    
            <CustomTabPanel value={value} index={2}>
                <div className="w-full bg-white p-4 rounded-lg shadow-md mb-4 mt-4">
                    {friendRequests.length > 0 ? (
                    <ul>
                        {friendRequests.map((request, index) => (
                        <li key={index} className="border-b py-2">{request.name}</li>
                        ))}
                    </ul>
                    ) : (
                    <p>No friend requests.</p>
                    )}
                </div>
            </CustomTabPanel>
        </div>
    )
}

export default Panel;