import React from 'react';
import { Card, CardContent, Grid, Typography, Box } from '@mui/material';

export default function DashboardCards({ cards = [] }) {
  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              height: "100%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderRadius: "12px",
              position: "relative",
              overflow: "visible",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "20px",
                right: "20px",
                backgroundColor: card.color,
                borderRadius: "8px",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {card.icon}
            </Box>
            <CardContent sx={{ pt: 2, pb: "16px !important" }}>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#666",
                  mb: 1,
                }}
              >
                {card.title}
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  mb: 1.5,
                  fontSize: "1.75rem",
                  fontWeight: 600,
                  color: card.color,
                }}
              >
                {card.value}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  >
                    {card.subtitle1}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {card.value1}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  >
                    {card.subtitle2}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {card.value2}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
