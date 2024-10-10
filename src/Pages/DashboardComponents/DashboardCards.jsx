import React from 'react';
import { Card, CardContent, Grid, Typography, Box } from '@mui/material';




const cardData = [
  { title: "Total Tickets", value: 144, color: "bg-blue-500" },
  { title: "Incidents", value: 59, percentage: "41%", color: "bg-yellow-500" },
  { title: "Services Requests", value: 27, percentage: "19%",  color: "bg-green-500" },
  { title: "Tasks", value: 58, percentage: "40%",  color: "bg-purple-500" },
  { title: "Aged Tickets 15+ Days", value: 86,  color: "bg-red-500" },
  { title: "Agreements Breached", value: 61, percentage: "42%", color: "bg-orange-500" },
];

export default function DashboardCards() {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={2} key={index}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                  {card.title}
                </Typography>
                {/* <IconWrapper color={card.bgColor}> */}
                  {/* <img src={card.icon} alt={card.title} style={{ width: 40, height: 40 }} /> */}
                {/* </IconWrapper> */}
              </Box>
              <Typography variant="h4" component="div" sx={{ mt: 2, color: card.color }}>
                {Number(card.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

