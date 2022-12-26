import React from "react";
import ImportCustomer from "./ImportCustomer";
import { Typography, Divider, AppBar, Tabs, Tab, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import axios from "axios";
import appConfig from "../../config/appConfig";
import ResetData from "./ResetData";
import ImportBulkTransaction from "./ImportBulkTransaction";
import RewindTransactions from "./RewindTransactions";
import EmailSendingList from "./EmailSendingList";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Settings() {
  const [value, setValue] = React.useState(0);
  const [groups, setGroups] = React.useState({});
  
  React.useEffect(() => {
    if (Object.entries(groups).length === 0 && groups.constructor === Object)
      axios
        .get(appConfig.baseApiUrl + "customer/GetCustomerGroups")
        .then((resJson) => {
          var obj = {};
          resJson.data.map((item: any) => {
            return (obj[item.id] = item.groupName);
          });
          setGroups(obj);
        });
  }, [groups]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          variant="scrollable"
          scrollButtons="on"
        >
          <Tab label="Müşteri Girişi" {...a11yProps(0)} />
          <Tab label="Bilgileri Sıfırla" {...a11yProps(1)} />
          <Tab label="Tarihe Geri Dön" {...a11yProps(2)} />
          <Tab label="Toplu İşlem Girişi" {...a11yProps(3)} />
          <Tab label="Mail Gidecek Kişiler" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <Divider />

      <TabPanel value={value} index={0}>
        <ImportCustomer groups={groups}></ImportCustomer>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ResetData>
          
        </ResetData>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RewindTransactions/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ImportBulkTransaction/>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <EmailSendingList />
          
      </TabPanel>
    </div>
  );
}
